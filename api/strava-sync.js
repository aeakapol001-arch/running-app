export default async function handler(req, res) {
  const { refresh_token, after, before } = req.query;

  try {
    // Step 1: Refresh token ก่อนเสมอ
    const tokenRes = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(200).json({ error: 'refresh_failed', details: tokenData });
    }

    // Step 2: ดึง activities
    const actRes = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&per_page=100`,
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    const activities = await actRes.json();

    if (!Array.isArray(activities)) {
      return res.status(200).json({ error: 'invalid_activities', details: activities });
    }

    // Step 3: ส่งทั้ง token ใหม่และ activities กลับ
    res.status(200).json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at,
      activities,
    });
  } catch(e) {
    res.status(200).json({ error: e.message });
  }
}
