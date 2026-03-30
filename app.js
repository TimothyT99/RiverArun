/* River Arun Tidal Guide — app.js */

(function () {
  "use strict";

  const DIRECT_API_BASE = "https://admiraltyapi.azure-api.net/uktidalapi/api/V1";
  const PROXY_PATH = "/.netlify/functions/tides";

  // ── Helpers ──

  function tzAbbr() {
    // Detect whether the browser is currently in BST or GMT
    const parts = new Intl.DateTimeFormat("en-GB", { timeZoneName: "short" }).formatToParts(new Date());
    const tz = parts.find(p => p.type === "timeZoneName");
    return tz ? tz.value : "";
  }

  function formatTime(date) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(date) {
    return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function addMinutes(date, mins) {
    return new Date(date.getTime() + mins * 60000);
  }

  function parseTidalEvent(ev) {
    // API returns GMT year-round — append 'Z' so the browser converts to local time
    const raw = ev.DateTime.endsWith("Z") ? ev.DateTime : ev.DateTime + "Z";
    return {
      type: ev.EventType === "HighWater" ? "HW" : "LW",
      time: new Date(raw),
      height: ev.Height
    };
  }

  // ── API fetch ──

  function isNetlify() {
    return location.hostname !== "localhost"
      && location.hostname !== "127.0.0.1"
      && !location.protocol.startsWith("file");
  }

  async function fetchTides() {
    const stationId = (typeof STATION_ID !== "undefined") ? STATION_ID : "0074";
    let res;

    if (isNetlify()) {
      // Production: use serverless proxy (key stays server-side)
      res = await fetch(`${PROXY_PATH}?station=${encodeURIComponent(stationId)}`);
    } else {
      // Local dev: call API directly using config.js key
      res = await fetch(
        `${DIRECT_API_BASE}/Stations/${encodeURIComponent(stationId)}/TidalEvents?duration=1`,
        { headers: { "Ocp-Apim-Subscription-Key": API_KEY } }
      );
    }

    if (!res.ok) throw new Error(`API ${res.status}`);

    const raw = await res.json();
    return raw.map(parseTidalEvent);
  }

  // ── Tide state logic ──

  function getTideState(events, now) {
    now = now || new Date();

    // Find the two events bracketing 'now'
    let prev = null;
    let next = null;
    for (const ev of events) {
      if (ev.time <= now) prev = ev;
      if (ev.time > now && !next) next = ev;
    }

    if (!prev && next) {
      return { state: next.type === "HW" ? "flooding" : "ebbing", arrow: next.type === "HW" ? "\u2191" : "\u2193", next };
    }
    if (prev && !next) {
      return { state: prev.type === "HW" ? "ebbing" : "flooding", arrow: prev.type === "HW" ? "\u2193" : "\u2191", prev };
    }

    const minsToNext = (next.time - now) / 60000;

    // Near HW/LW threshold: 20 minutes
    if (minsToNext < 20) {
      if (next.type === "HW") return { state: "near HW", arrow: "\u2195", next };
      return { state: "near LW", arrow: "\u2195", next };
    }

    const minsSincePrev = (now - prev.time) / 60000;
    if (minsSincePrev < 20) {
      if (prev.type === "HW") return { state: "near HW \u2014 stand of tide", arrow: "\u2195", prev };
      return { state: "near LW", arrow: "\u2195", prev };
    }

    // Between events
    if (prev.type === "LW" && next.type === "HW") {
      return { state: "flooding", arrow: "\u2191", next };
    }
    if (prev.type === "HW" && next.type === "LW") {
      return { state: "ebbing", arrow: "\u2193", next };
    }

    return { state: "unknown", arrow: "\u2014" };
  }

  function getUpstreamWindow(events) {
    // Find next/most recent HW at Littlehampton
    const now = new Date();
    let hw = null;
    for (const ev of events) {
      if (ev.type === "HW") {
        hw = ev;
        if (ev.time > now) break; // use next future HW
      }
    }
    if (!hw) return null;

    // Optimal departure from Arundel: HW Littlehampton - 60 mins
    // (Arundel lag is +50, so flood arrives ~50 mins after Littlehampton;
    //  depart just as flood reaches Arundel for max upstream push)
    const departArundel = addMinutes(hw.time, -60);
    const windowEnd = new Date(hw.time); // flood runs until roughly HW at Littlehampton

    return { hw, depart: departArundel, end: windowEnd };
  }

  // ── Render: tide panel ──

  function renderTidePanel(events) {
    const container = document.getElementById("tide-panel-body");
    const now = new Date();

    // Date and timezone
    const tz = tzAbbr();
    document.getElementById("tide-date").textContent = formatDate(now) + (tz ? ` (${tz})` : "");

    // Tide state
    const state = getTideState(events, now);
    container.innerHTML = "";

    // Status bar
    const statusDiv = document.createElement("div");
    statusDiv.className = "tide-status";
    statusDiv.innerHTML = `<span class="arrow">${state.arrow}</span> <span>${capitalise(state.state)}</span>`;
    container.appendChild(statusDiv);

    // HW/LW times grid
    const grid = document.createElement("div");
    grid.className = "tide-times";
    const todayEvents = events.filter(ev => ev.time.toDateString() === now.toDateString());
    if (todayEvents.length === 0) {
      // Show all events if none match today exactly (API might return UTC)
      events.forEach(ev => grid.appendChild(createEventCard(ev)));
    } else {
      todayEvents.forEach(ev => grid.appendChild(createEventCard(ev)));
    }
    container.appendChild(grid);

    // Upstream window
    const win = getUpstreamWindow(events);
    if (win) {
      const winDiv = document.createElement("div");
      winDiv.className = "upstream-window";
      winDiv.innerHTML = `
        <div class="window-title">Upstream window from Arundel</div>
        <div class="window-times">Depart ~${formatTime(win.depart)} \u2014 flood until ~${formatTime(win.end)}</div>
        <div class="window-note">Based on HW Littlehampton ${formatTime(win.hw.time)} (${win.hw.height.toFixed(1)}m). Aim to leave Arundel as the flood arrives.</div>
      `;
      container.appendChild(winDiv);
    }

    // Stand of tide note
    const note = document.createElement("div");
    note.className = "tide-note";
    note.textContent = "At High Water the water level begins to drop before the surface current turns \u2014 the stand of the tide. Height and current do not reverse at the same moment.";
    container.appendChild(note);
  }

  function createEventCard(ev) {
    const div = document.createElement("div");
    div.className = "tide-event " + (ev.type === "HW" ? "hw" : "lw");
    div.innerHTML = `
      <div class="label">${ev.type === "HW" ? "High Water" : "Low Water"}</div>
      <div class="time">${formatTime(ev.time)}</div>
      <div class="height">${ev.height.toFixed(1)}m</div>
    `;
    return div;
  }

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ── Render: waypoints ──

  function renderWaypoints(events) {
    const list = document.getElementById("waypoint-list");
    list.innerHTML = "";

    // Find next HW at Littlehampton for deriving upstream times
    const now = new Date();
    let nextHW = null;
    let prevHW = null;
    for (const ev of events) {
      if (ev.type === "HW") {
        if (ev.time <= now) prevHW = ev;
        if (ev.time > now && !nextHW) nextHW = ev;
      }
    }
    const refHW = nextHW || prevHW;

    WAYPOINTS.forEach(wp => {
      const card = document.createElement("div");
      card.className = "waypoint-card";

      // Header
      const header = document.createElement("div");
      header.className = "waypoint-header";

      let headerHTML = `<span class="waypoint-name">${wp.name}</span>`;
      headerHTML += `<span class="zone-badge ${wp.zone}">${wp.zone.replace("-", "\u2011")}</span>`;
      if (wp.springs_only) headerHTML += ` <span class="springs-badge">Springs only</span>`;
      if (wp.harbourmaster) headerHTML += ` <span class="harbourmaster-flag">Harbourmaster</span>`;
      header.innerHTML = headerHTML;

      // Body
      const body = document.createElement("div");
      body.className = "waypoint-body";

      let bodyHTML = "";

      // Derived HW time — use lag_confirmed (new field) falling back to !interpolated
      if (refHW && wp.lag_mins !== null) {
        const derived = addMinutes(refHW.time, wp.lag_mins);
        const isApprox = wp.hasOwnProperty("lag_confirmed") ? !wp.lag_confirmed : wp.interpolated;
        const approxLabel = isApprox ? ' <span class="approx">(approx.)</span>' : "";
        bodyHTML += `<div class="waypoint-hw">HW ${formatTime(derived)}${approxLabel}</div>`;
      } else if (wp.lag_mins === null) {
        bodyHTML += `<div class="waypoint-hw" style="color:var(--amber)">No regular tidal time</div>`;
      }

      // Note
      if (wp.note) {
        bodyHTML += `<div class="waypoint-note">${wp.note}</div>`;
      }

      // Access entries
      if (wp.access) {
        const items = Array.isArray(wp.access) ? wp.access : [wp.access];
        bodyHTML += `<div class="waypoint-access">`;
        items.forEach(a => {
          const isClosed = a.status === "closed";
          bodyHTML += `<div class="access-item${isClosed ? " closed" : ""}">`;
          bodyHTML += `<span class="venue">${a.venue}</span>`;
          if (isClosed) {
            bodyHTML += ` <span class="closed-badge">Closed</span>`;
          } else if (a.phone) {
            bodyHTML += ` <span class="phone"><a href="tel:${a.phone.replace(/\s/g, "")}">${a.phone}</a></span>`;
          }
          if (a.note && isClosed) {
            bodyHTML += `<div class="access-note">${a.note}</div>`;
          }
          bodyHTML += `</div>`;
        });
        bodyHTML += `</div>`;
      }

      // Moorings contact (Arundel etc.)
      if (wp.moorings) {
        bodyHTML += `<div class="waypoint-moorings">Moorings: ${wp.moorings.owner}`;
        if (wp.moorings.phone) bodyHTML += ` <a href="tel:${wp.moorings.phone.replace(/\s/g, "")}">${wp.moorings.phone}</a>`;
        bodyHTML += `</div>`;
      }

      body.innerHTML = bodyHTML;
      card.appendChild(header);
      card.appendChild(body);
      list.appendChild(card);
    });
  }

  // ── Render: reference section ──

  function renderReference() {
    const grid = document.getElementById("reference-grid");
    grid.innerHTML = "";

    // Use MODIFYING_FACTORS from data.js if available, else skip
    if (typeof MODIFYING_FACTORS === "undefined") return;

    MODIFYING_FACTORS.forEach(factor => {
      const div = document.createElement("div");
      div.className = "ref-card";
      div.innerHTML = `<h3>${factor.title}</h3><p>${factor.body}</p>`;
      grid.appendChild(div);
    });

    // Wire up disclaimer from data.js
    if (typeof DISCLAIMER !== "undefined") {
      const el = document.getElementById("footer-disclaimer");
      if (el) el.textContent = DISCLAIMER;
    }
  }

  // ── Fallback / demo mode ──

  function generateFallbackEvents() {
    // Generate plausible tide events for today so the page still works
    // without an API key. Based on semi-diurnal pattern.
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 12);
    return [
      { type: "HW", time: base, height: 5.2 },
      { type: "LW", time: addMinutes(base, 6 * 60 + 15), height: 0.8 },
      { type: "HW", time: addMinutes(base, 12 * 60 + 25), height: 5.0 },
      { type: "LW", time: addMinutes(base, 18 * 60 + 40), height: 1.0 }
    ];
  }

  // ── Init ──

  async function init() {
    renderReference();

    const body = document.getElementById("tide-panel-body");

    try {
      let events;
      const hasLocalKey = typeof API_KEY !== "undefined" && API_KEY !== "YOUR_API_KEY_HERE";
      if (!hasLocalKey && !isNetlify()) {
        // No API key and not on Netlify — show demo
        events = generateFallbackEvents();
        renderTidePanel(events);
        renderWaypoints(events);
        const notice = document.createElement("div");
        notice.className = "tide-note";
        notice.style.marginTop = "0.5rem";
        notice.style.color = "#b33";
        notice.textContent = "Demo mode \u2014 no API key configured. Times shown are illustrative only. Add your UKHO API key to config.js for live data.";
        body.appendChild(notice);
      } else {
        body.innerHTML = '<div class="tide-loading">Fetching tide data\u2026</div>';
        events = await fetchTides();
        renderTidePanel(events);
        renderWaypoints(events);
      }
    } catch (err) {
      console.error("Tide fetch failed:", err);
      // Fall back to demo
      const events = generateFallbackEvents();
      renderTidePanel(events);
      renderWaypoints(events);
      const notice = document.createElement("div");
      notice.className = "tide-note";
      notice.style.marginTop = "0.5rem";
      notice.style.color = "#b33";
      notice.textContent = `Could not fetch live tide data (${err.message}). Showing demo times.`;
      body.appendChild(notice);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
