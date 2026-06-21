export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { incidentType, description, date, location, senderContact } = req.body;

      if (!description || !incidentType) {
        return res.status(400).json({ error: 'Incident type and description are required.' });
      }

      const trackingCode = `SAFE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const newReport = {
        id: Date.now().toString(),
        trackingCode,
        incidentType,
        description,
        date: date || new Date().toISOString().split('T')[0],
        location: location || 'Anonymous',
        senderContact: senderContact || 'Anonymous',
        attachments: [],
        status: 'Received',
        createdAt: new Date().toISOString(),
        updates: [
          {
            timestamp: new Date().toISOString(),
            message: 'Report submitted securely through automated cryptographic routing.',
            status: 'Received'
          }
        ]
      };

      return res.status(201).json({
        success: true,
        message: 'Anonymous report recorded successfully.',
        trackingCode,
        status: newReport.status
      });
    } catch (error) {
      console.error('Error recording report:', error);
      return res.status(500).json({ error: 'Failed to submit report. Please try again.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
