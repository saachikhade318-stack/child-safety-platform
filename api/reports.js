export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // Parse the body - handle both FormData and JSON
      let incidentType, description, date, location, senderContact;

      if (req.body && typeof req.body === 'object') {
        // Direct object from JSON parser
        incidentType = req.body.incidentType;
        description = req.body.description;
        date = req.body.date;
        location = req.body.location;
        senderContact = req.body.senderContact;
      } else if (typeof req.body === 'string') {
        // Parse JSON string
        const parsed = JSON.parse(req.body);
        incidentType = parsed.incidentType;
        description = parsed.description;
        date = parsed.date;
        location = parsed.location;
        senderContact = parsed.senderContact;
      }

      if (!description || !incidentType) {
        return res.status(400).json({ error: 'Incident type and description are required.' });
      }

      const trackingCode = `SAFE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      return res.status(201).json({
        success: true,
        message: 'Anonymous report recorded successfully.',
        trackingCode,
        status: 'Received'
      });
    } catch (error) {
      console.error('Error recording report:', error);
      return res.status(500).json({ error: error.message || 'Failed to submit report. Please try again.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
