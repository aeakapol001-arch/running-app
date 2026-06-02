export default async function handler(req, res) {
  const { token, after, before } = req.query;
  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&per_page=100`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    if (!Array.isArray(data)) {
      return res.status(200).json([]);
    }
    res.status(200).json(data);
  } catch(e) {
    res.status(200).json([]);
  }
}
