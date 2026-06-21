export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { trackingCode } = req.query;
    
    if (!trackingCode) {
      return res.status(400).json({ error: 'Tracking code is required.' });
    }

    // Create a demo report for any valid tracking code
    const demoReport = {
      id: Date.now().toString(),
      trackingCode: trackingCode.toUpperCase(),
      incidentType: 'Sample Report',
      description: 'This is a demo report for testing purposes.',
      date: new Date().toISOString().split('T')[0],
      location: 'Anonymous',
      senderContact: 'Anonymous',
      attachments: [],
      status: 'NGO Assigned',
      createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
      updates: [
        {
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          message: 'Report submitted securely through automated cryptographic routing.',
          status: 'Received'
        },
        {
          timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
          message: 'Secure agency screening completed. Case marked high priority.',
          status: 'Reviewed'
        },
        {
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          message: 'Assigned to nearest child protection officer and local shelter advocate.',
          status: 'NGO Assigned'
        }
      ]
    };

    return res.status(200).json(demoReport);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
