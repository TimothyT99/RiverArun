const WAYPOINTS = [
  {
    name: "Littlehampton entrance",
    lag_mins: 0,
    zone: "salt",
    interpolated: false,
    note: "Reference point. Bar 0.9m above chart datum, extends 600m south of west pier. Spring ebb reaches 6.5 kts in the Narrows. Best entry HW\u22122 to HW+1.",
    access: null,
    harbourmaster: true
  },
  {
    name: "Ford",
    lag_mins: 25,
    zone: "salt",
    interpolated: false,
    note: "Lower estuary, strongly tidal. Ship & Anchor Marina slipway (by arrangement, 01243 551262).",
    access: { venue: "Ship & Anchor pub", phone: "01243 551262" }
  },
  {
    name: "Arundel Town Quay / bridges",
    lag_mins: 50,
    zone: "transitional",
    interpolated: false,
    note: "Harbourmaster jurisdiction ends at town bridge. Pontoon mooring in town centre managed by Edible Sandwich Co (01903 885969). Moorings here and at Black Rabbit belong to Angmering Park Estate (01903 882220). ABC slipway at Castle Car Park \u2014 tide drops considerably on return, slipway will be well exposed.",
    access: [
      { venue: "Waterside Tea Garden & Bistro", phone: "01903 882609" },
      { venue: "Edible Sandwich Co (pontoon)", phone: "01903 885969" }
    ]
  },
  {
    name: "Black Rabbit, Offham",
    lag_mins: 60,
    zone: "transitional",
    interpolated: true,
    note: "1 mile north of Arundel. Moorings belong to Angmering Park Estate. Mill Road parking often full in season.",
    access: { venue: "Black Rabbit Pub", phone: "01903 882828" }
  },
  {
    name: "South Stoke Church",
    lag_mins: 70,
    zone: "salt-wedge",
    interpolated: true,
    note: "Approximate. Salt wedge zone \u2014 at slack tide, denser saltwater continues upstream along the riverbed while freshwater flows seaward on the surface. Opposing currents possible even when main current appears stopped.",
    access: null
  },
  {
    name: "Amberley / Houghton Bridge",
    lag_mins: 90,
    zone: "fresh",
    interpolated: false,
    note: "Leaving Arundel at HW Littlehampton gives roughly 1 hour of flood, sufficient to reach here. Above here, rainfall becomes the dominant tidal modifier.",
    access: [
      { venue: "Boat House Brasserie", phone: "01798 831059" },
      { venue: "Bridge Inn", phone: "01798 831619" },
      { venue: "Riverside Tea Rooms", phone: "01798 831066" }
    ]
  },
  {
    name: "Pulborough",
    lag_mins: 240,
    zone: "fresh",
    interpolated: false,
    springs_only: false,
    note: "Normal tidal limit on average tides. On extreme neaps no tidal influence at all. Flood reaches here in ~4 hrs; ebb takes ~8 hrs \u2014 very slow to fall. Public slipway on north bank adjacent to tea rooms.",
    access: { venue: "Corn Store & Tea Rooms", phone: "01798 875067" }
  },
  {
    name: "White Hart, Stopham Bridge",
    lag_mins: 270,
    zone: "fresh",
    interpolated: true,
    springs_only: true,
    note: "Springs required. The tide at Stopham and Pulborough can be running in opposite directions simultaneously \u2014 the spatial overlap of flood/ebb conditions here is real and well documented.",
    access: { venue: "White Hart Pub", phone: "01798 873321" }
  },
  {
    name: "Pallingham Quay (tidal limit)",
    lag_mins: null,
    zone: "fresh",
    interpolated: false,
    springs_only: true,
    note: "2 miles north of Stopham, 13 miles from Arundel, 19 miles from Littlehampton. Former Wey & Arun Canal lock. Big spring tides only.",
    access: null
  }
];

const REFERENCE_DATA = {
  tidalRange: {
    title: "Tidal range",
    springs: { mhws: 5.9, mlws: 0.4, range: 5.5 },
    neaps: { mhwn: 4.4, mlwn: 1.7, range: 2.7 }
  },
  bar: {
    title: "Entrance bar",
    chartDatum: 0.9,
    minGauge: 3.4,
    safeWindow: "HW\u22122.5 to HW+3"
  },
  harbourmaster: {
    phone: "01903 721215",
    vhf: "Ch 71"
  }
};
