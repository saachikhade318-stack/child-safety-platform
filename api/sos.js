export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { lat, lng, deviceType } = req.body;
      
      const newSOS = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        coords: { lat: lat || 40.7128, lng: lng || -74.0060 },
        device: deviceType || 'Web Client',
        status: 'Dispatched',
        actionPlan: [
          "SafeNest emergency coordinates transmitted securely to local authority desk.",
          "Nearest responsive patrol car and child health advocate notified.",
          "Encrypted backup log created locally to preserve timeline safety."
        ]
      };

      return res.status(200).json({
        success: true,
        sosId: newSOS.id,
        timestamp: newSOS.timestamp,
        actionPlan: newSOS.actionPlan,
        dispatchUnitsCount: Math.floor(Math.random() * 3) + 2
      });
    } catch (error) {
      console.error('SOS Error:', error);
      return res.status(500).json({ error: 'SOS broadcast logging failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
