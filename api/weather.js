export default async function handler(req, res) {
  const { lat, lon } = req.query;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max&timezone=Asia%2FBangkok&start_date=2026-06-01&end_date=2026-06-30`;
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(200).json({ error: e.message });
  }
}
