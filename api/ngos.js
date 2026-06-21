const ngosData = [
  { id: 1, name: "Global Shield Foundation", contact: "1-800-422-4453", email: "support@globalshield.org", address: "Metropolis Safe Haven, NY", coords: { x: 35, y: 42 }, description: "24/7 immediate trauma intervention and legal advocacy.", status: "Active Nodes: 14" },
  { id: 2, name: "Beacon Youth Protection", contact: "+44 800 1111", email: "helpline@beaconyouth.org", address: "London Community Center, UK", coords: { x: 48, y: 32 }, description: "Safe spaces, counseling networks, and school education outreach programs.", status: "Active Nodes: 8" },
  { id: 3, name: "Lotus Guardian Initiative", contact: "+91 1098", email: "rescue@lotusguardians.in", address: "New Delhi Emergency Desk, India", coords: { x: 68, y: 48 }, description: "Nationwide response units working directly with child welfare committees.", status: "Active Nodes: 22" }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(ngosData);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
