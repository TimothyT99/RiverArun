exports.handler = async function (event) {
  const apiKey = process.env.ADMIRALTY_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "API key not configured" }) };
  }

  const stationId = event.queryStringParameters?.station || "0074";
  const url = `https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/${encodeURIComponent(stationId)}/TidalEvents?duration=1`;

  try {
    const res = await fetch(url, {
      headers: { "Ocp-Apim-Subscription-Key": apiKey }
    });

    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ error: `UKHO API ${res.status}` }) };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
};
