export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const query = message.toLowerCase();
    let responseText = "";
    let suggestionChips = [];
    let priority = "normal";

    if (query.includes('help') || query.includes('scared') || query.includes('hurt') || query.includes('danger') || query.includes('police')) {
      responseText = "I hear you, and you are not alone. Please click the red SOS button at the bottom of the page or call 911 (or child helplines like 1-800-422-4453 immediately). If you are in immediate physical danger, try to move to a public place or lock yourself in a safe room. I can help guide you through an anonymous report here right now.";
      suggestionChips = ["Start Anonymous Report", "Find local shelter", "View safety tips"];
      priority = "emergency";
    } else if (query.includes('report') || query.includes('anonymous') || query.includes('submit')) {
      responseText = "Creating an anonymous report is simple and safe. Click the 'Report Anonymously' button on the navbar, or scroll to the reporter section. You do not need to share your name, and you can upload pictures, text, or audio notes. Once submitted, you'll receive a tracking code to check status.";
      suggestionChips = ["Go to Report Portal", "How is my identity hidden?"];
      priority = "high";
    } else if (query.includes('touch') || query.includes('body') || query.includes('safe touch')) {
      responseText = "Your body belongs to you. No one has the right to touch you in a way that makes you feel uncomfortable, confused, or scared (unsafe touches). Even if that person is a family member, teacher, or adult you know. It is NEVER your fault. Tell a trusted adult immediately.";
      suggestionChips = ["Safe vs Unsafe touch guide", "Who can I tell?"];
    } else if (query.includes('track') || query.includes('check status') || query.includes('code')) {
      responseText = "If you have already submitted a report, enter your alphanumeric tracking code (e.g., SAFE-XXXX-XXXX) in the 'Track Report' tab of the Reporting Portal to see status updates in real-time.";
      suggestionChips = ["Track Report Now"];
    } else {
      responseText = "Hello, I am SafeNest, your secure digital safety assistant. You can speak to me freely about safety guidelines, how anonymous reporting works, or where to find help. Everything you share here is encrypted locally in your browser session. How can I help you feel safe today?";
      suggestionChips = ["What is an unsafe touch?", "How do I report abuse?", "Helpline numbers"];
    }

    return res.status(200).json({
      reply: responseText,
      suggestions: suggestionChips,
      priority,
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
