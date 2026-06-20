const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches the list of active NGOs and helplines.
 */
export async function fetchNGOs() {
  try {
    const res = await fetch(`${API_BASE_URL}/ngos`);
    if (!res.ok) throw new Error('Failed to fetch NGOs');
    return await res.json();
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    // Fallback static list in case server is not running yet
    return [
      { id: 1, name: "Global Shield Foundation", contact: "1-800-422-4453", email: "support@globalshield.org", address: "Metropolis Safe Haven, NY", coords: { x: 35, y: 42 }, description: "24/7 immediate trauma intervention and legal advocacy.", status: "Active Nodes: 14" },
      { id: 2, name: "Beacon Youth Protection", contact: "+44 800 1111", email: "helpline@beaconyouth.org", address: "London Community Center, UK", coords: { x: 48, y: 32 }, description: "Safe spaces, counseling networks, and school education outreach programs.", status: "Active Nodes: 8" },
      { id: 3, name: "Lotus Guardian Initiative", contact: "+91 1098", email: "rescue@lotusguardians.in", address: "New Delhi Emergency Desk, India", coords: { x: 68, y: 48 }, description: "Nationwide response units working directly with child welfare committees.", status: "Active Nodes: 22" }
    ];
  }
}

/**
 * Submits an anonymous report containing text and file attachments.
 * @param {FormData} formData
 */
export async function submitReport(formData) {
  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    body: formData, // Automatic Content-Type header configuration for multipart/form-data
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to submit report');
  }
  return await res.json();
}

/**
 * Tracks a report status via tracking code.
 * @param {string} trackingCode
 */
export async function trackReport(trackingCode) {
  const res = await fetch(`${API_BASE_URL}/reports/${encodeURIComponent(trackingCode)}`);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Report not found');
  }
  return await res.json();
}

/**
 * Triggers an SOS emergency alert.
 * @param {number} lat
 * @param {number} lng
 */
export async function triggerSOS(lat, lng) {
  const res = await fetch(`${API_BASE_URL}/sos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng, deviceType: 'Web Client App' })
  });
  if (!res.ok) throw new Error('SOS signal failed to broadcast');
  return await res.json();
}

/**
 * Sends a message to the AI safety chatbot and gets a response.
 * @param {string} message
 */
export async function sendMessageToSafeNest(message) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Chat assistant connection issue');
  return await res.json();
}
