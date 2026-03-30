// River Arun Tidal Guide — waypoint data
// Last verified: March 2026
// Sources: Littlehampton Harbour Board (littlehampton.org.uk), Arundel Boat Club archive,
//          Littlehampton Harbour Port Information Booklet 2024, direct business research

const WAYPOINTS = [
  {
    name: "Littlehampton entrance",
    lag_mins: 0,
    lag_confirmed: true,
    zone: "salt",
    springs_only: false,
    note: "Reference point. Bar sits 0.9m above chart datum, extends 600m south of west pier — depth over bar = tide gauge reading minus 0.9m. At least 3.4m on gauge from HW−2.5hrs to HW+3hrs. Spring ebb in the Narrows reaches 6.5 kts. Best entry HW−2 to HW+1. Call Harbour Office on VHF Ch 71 before entry.",
    access: null,
    harbourmaster: {
      authority: "Littlehampton Harbour Board",
      phone: "01903 721215",
      vhf: "Ch 71",
      note: "Responsible for river from sea to Arundel town bridge"
    }
  },
  {
    name: "Ford (Ship & Anchor)",
    lag_mins: 25,
    lag_confirmed: true,
    zone: "salt",
    springs_only: false,
    note: "Lower estuary, strongly tidal. Full marina with pontoon moorings and concrete slipway — best access HW±2hrs. Pub open all day (new owners since 2024, welcoming atmosphere). Slipway: Littlehampton HW +30 min. Call ahead to arrange visitor access.",
    access: [
      {
        venue: "Ship & Anchor pub, marina & campsite",
        phone: "01243 551262",
        url: "theshipandanchor.co.uk",
        note: "New owners 2024. Marina, slipway, pub and campsite. Call ahead for visitor moorings."
      }
    ]
  },
  {
    name: "Arundel Town Quay / bridges",
    lag_mins: 50,
    lag_confirmed: true,
    zone: "transitional",
    springs_only: false,
    note: "Harbourmaster jurisdiction ends at town bridge. Pontoon is on the west bank just downstream of Queens Road Bridge — call Edible Sandwich Co ahead to have the gate opened. Harbour limits end approximately at the Black Rabbit pub upstream. ABC slipway adjacent to Castle Car Park. Important: on return the slipway will be well exposed and current running hard out — allow for this.",
    access: [
      {
        venue: "Edible Sandwich Co (pontoon gate keeper)",
        phone: "01903 885969",
        url: "ediblesandwich.co.uk",
        note: "Manages access gate to the visitor pontoon downstream of Queens Road Bridge. Call ahead. Open daily."
      },
      {
        venue: "Waterside Tea Garden & Bistro",
        phone: null,
        note: "CLOSED — may reopen. Former riverside café and boat hire at Mill Road. Check locally for current status.",
        status: "closed"
      }
    ],
    moorings: {
      owner: "Angmering Park Estate",
      phone: "01903 882220",
      note: "Owns moorings at Arundel and Black Rabbit. Contact Moorings Administrator for overnight or longer stays."
    }
  },
  {
    name: "Black Rabbit, Offham",
    lag_mins: 60,
    lag_confirmed: false,
    zone: "transitional",
    springs_only: false,
    note: "Approximately 1 mile north of Arundel. Marks the upstream limit of Littlehampton Harbour Board jurisdiction. Moorings here belong to Angmering Park Estate (01903 882220). Access via muddy bank — wellies advised at low water.",
    access: [
      {
        venue: "Black Rabbit pub",
        phone: "01903 882638",
        url: "theblackrabbitarundel.co.uk",
        note: "Hall & Woodhouse (Badger ales). Riverside terrace, dog friendly. Open daily."
      }
    ]
  },
  {
    name: "South Stoke Church",
    lag_mins: 70,
    lag_confirmed: false,
    zone: "salt-wedge",
    springs_only: false,
    note: "Approximate lag — interpolated between Arundel and Houghton. Salt wedge zone: around slack tide, denser saltwater continues pushing upstream along the riverbed while freshwater flows seaward on the surface. Opposing currents possible even when main flow appears stopped — surface turbulence is the indicator.",
    access: null
  },
  {
    name: "Amberley / Houghton Bridge",
    lag_mins: 90,
    lag_confirmed: true,
    zone: "fresh",
    springs_only: false,
    note: "Leaving Arundel at HW Littlehampton gives roughly 1 hour of flood — sufficient to reach here. Above this point rainfall becomes the dominant tidal modifier: heavy recent rain can suppress tidal penetration significantly and advance the turn of the tide. All lag times assume normal river levels.",
    access: [
      {
        venue: "The Boathouse Amberley",
        phone: "01243 971880",
        url: "theboathouseamberley.co.uk",
        note: "Mediterranean/Italian restaurant at Houghton Bridge. Reviewed positively through late 2025. Call to confirm opening."
      },
      {
        venue: "Bridge Inn",
        phone: "01798 831619",
        url: "bridgeinnamberley.com",
        note: "Traditional pub, grade II listed. Open Wed–Sun. Real ales, home cooked food."
      },
      {
        venue: "Riverside Tea Rooms (Riverside South Downs)",
        phone: "01798 831066",
        url: "riversidesouthdowns.com",
        note: "Open daily. Breakfast, lunch, cream teas. Also offers self-drive boat hire on the Arun."
      }
    ]
  },
  {
    name: "Pulborough",
    lag_mins: 240,
    lag_confirmed: true,
    zone: "fresh",
    springs_only: false,
    note: "Normal tidal limit on average tides. On extreme neaps there may be no tidal influence at all. HW is 4 hours after Littlehampton — flood reaches here in ~4hrs, ebb takes ~8hrs and the river is very slow to fall. Public slipway on north bank adjacent to tea rooms.",
    access: [
      {
        venue: "Macklins @ The Riverside (formerly Corn Store)",
        phone: "01798 875067",
        url: null,
        note: "Tea room and antiques emporium at the Old Corn Store, Swan Bridge. Name changed — Macklins @ The Riverside per food hygiene register March 2025, 5-star rating."
      }
    ]
  },
  {
    name: "White Hart, Stopham Bridge",
    lag_mins: 270,
    lag_confirmed: false,
    zone: "fresh",
    springs_only: true,
    note: "Springs required. The tidal conditions at Stopham and Pulborough can be running in opposite directions simultaneously — well documented by paddlers. Verify the pub is open before making this your destination: reports of unexpected closures in 2025. Leasehold on market 2024 but under same ownership since 2020.",
    access: [
      {
        venue: "White Hart pub",
        phone: "01798 873321",
        url: null,
        note: "Riverside gastropub by old Stopham Bridge. Verify open before visiting. Grade II listed building."
      }
    ]
  },
  {
    name: "Pallingham Quay (tidal limit)",
    lag_mins: null,
    lag_confirmed: false,
    zone: "fresh",
    springs_only: true,
    note: "2 miles north of Stopham, 13 miles from Arundel, 19 miles from Littlehampton. Former Wey & Arun Canal lock. Big spring tides only — on average or neap tides the river will not be tidal here at all.",
    access: null
  }
];

// River characteristics
const RIVER_DATA = {
  tidal_limit_miles: 19,
  tidal_limit_km: 30,
  speed_description: "Second fastest flowing river in the UK",
  ebb_speed_knots: 6.5,
  flood_hours: 4,
  ebb_hours: 8,
  springs: {
    range_m: 5.5,
    mhws_m: 5.9,
    mlws_m: 0.4
  },
  neaps: {
    range_m: 2.7,
    mhwn_m: 4.4,
    mlwn_m: 1.7
  },
  bar: {
    height_above_cd_m: 0.9,
    length_m: 600,
    min_gauge_reading_m: 3.4,
    window_before_hw_hrs: 2.5,
    window_after_hw_hrs: 3
  },
  dover_offset_mins: 15,
  stand_of_tide_note: "At High Water, the level begins to drop before the current turns on the surface. These do not happen at the same moment — plan accordingly.",
  return_warning: "On return to Arundel, the slipway will be well exposed and the current running hard out. Allow time and plan your return before HW falls too far."
};

// Modifying factors for the reference section
const MODIFYING_FACTORS = [
  {
    id: "bar",
    title: "Littlehampton entrance bar",
    body: "The bar sits 0.9m above chart datum and extends 600m south of the west pier. Depth over bar = tide gauge reading minus 0.9m. A minimum of 3.4m on the gauge is available from HW−2.5hrs to HW+3hrs. Swell adds dynamic surge on top of the static depth — allow for sea state when calculating underkeel clearance."
  },
  {
    id: "rainfall",
    title: "Rainfall and freshwater flow",
    body: "Heavy or sustained rainfall upstream significantly suppresses tidal penetration. High river levels can push the effective tidal limit back downstream, reduce lag times, and advance the turn of the tide. Above Amberley this effect can become the dominant factor, overriding the astronomical tide entirely. All published lag times assume normal river levels."
  },
  {
    id: "salt-wedge",
    title: "Salt wedge and opposing currents",
    body: "Between Arundel and Amberley around slack tide, denser saltwater continues pushing upstream along the riverbed while lighter freshwater flows seaward on the surface. This creates opposing currents visible as surface turbulence — small craft can experience conflicting push and pull even when the main tidal current appears to have stopped."
  },
  {
    id: "asymmetry",
    title: "Tidal asymmetry upstream",
    body: "The flood wave travels upstream in approximately 4 hours (fast, energetic). The ebb takes approximately 8 hours (slow, sustained). Above Pulborough on springs, flood conditions can exist at Pulborough while ebb conditions prevail at Stopham simultaneously — the spatial overlap of tide states is real and well documented."
  },
  {
    id: "springs-neaps",
    title: "Springs vs neaps",
    body: "Spring tidal range (5.5m) is roughly double the neap range (2.7m). On extreme neaps there may be no tidal influence above Pulborough at all. Springs required for Stopham and Pallingham. Away from the coast, spring tides arrive earlier and run more strongly than neap predictions — lag times are approximations, not precise schedules."
  },
  {
    id: "stand",
    title: "Stand of the tide",
    body: "At High Water the water level begins to drop before the tidal current turns on the surface. These two events do not coincide. A vessel or paddler relying on current direction to judge the state of the tide may be caught out — use both the water level and the current as indicators."
  }
];

// Disclaimer
const DISCLAIMER = "Not for navigation. All times are predictions and do not account for weather, surge, or river conditions. Tidal lags are approximate and vary with rainfall, spring/neap cycle, and river levels. Businesses listed were verified March 2026 but status may have changed — always check before visiting. Verify all data against official sources before going afloat. Harbourmaster: 01903 721215 / VHF Ch 71.";
