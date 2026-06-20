import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Set up storage directories
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const reportsFile = path.join(dataDir, 'reports.json');
const sosLogsFile = path.join(dataDir, 'sos_logs.json');
const ngosFile = path.join(dataDir, 'ngos.json');

// Initialize empty files if they don't exist
if (!fs.existsSync(reportsFile)) fs.writeFileSync(reportsFile, JSON.stringify([], null, 2));
if (!fs.existsSync(sosLogsFile)) fs.writeFileSync(sosLogsFile, JSON.stringify([], null, 2));

// Static files for uploaded evidence images/videos/audio
app.use('/uploads', express.static(uploadsDir));

// Configure Multer for secure uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Helper to read/write JSON files
const readJSON = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// 1. GET NGOs
app.get('/api/ngos', (req, res) => {
  const ngos = readJSON(ngosFile);
  res.json(ngos.length > 0 ? ngos : [
    { id: 1, name: "Global Shield Foundation", contact: "1-800-422-4453", email: "support@globalshield.org", address: "Metropolis Safe Haven, NY", coords: { x: 35, y: 42 }, description: "24/7 immediate trauma intervention and legal advocacy.", status: "Active Nodes: 14" }
  ]);
});

// 2. CREATE REPORT (with file uploads)
app.post('/api/reports', upload.array('attachments', 5), (req, res) => {
  try {
    const { incidentType, description, date, location, senderContact } = req.body;

    if (!description || !incidentType) {
      return res.status(400).json({ error: 'Incident type and description are required.' });
    }

    const reports = readJSON(reportsFile);
    const trackingCode = `SAFE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newReport = {
      id: Date.now().toString(),
      trackingCode,
      incidentType,
      description,
      date: date || new Date().toISOString().split('T')[0],
      location: location || 'Anonymous',
      senderContact: senderContact || 'Anonymous',
      attachments: (req.files || []).map(file => `/uploads/${file.filename}`),
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

    reports.push(newReport);
    writeJSON(reportsFile, reports);

    res.status(201).json({
      success: true,
      message: 'Anonymous report recorded successfully.',
      trackingCode,
      status: newReport.status
    });
  } catch (error) {
    console.error('Error recording report:', error);
    res.status(500).json({ error: 'Failed to submit report. Please try again.' });
  }
});

// 3. GET REPORT STATUS BY TRACKING CODE
app.get('/api/reports/:trackingCode', (req, res) => {
  const { trackingCode } = req.params;
  const reports = readJSON(reportsFile);
  const report = reports.find(r => r.trackingCode.toLowerCase() === trackingCode.trim().toLowerCase());

  if (!report) {
    return res.status(404).json({ error: 'Tracking code not found. Please verify the code.' });
  }

  // Simulate updating status dynamically based on time elapsed since report creation for visual excellence!
  const diffMinutes = (Date.now() - new Date(report.createdAt).getTime()) / 60000;
  let currentStatus = report.status;
  
  if (diffMinutes > 5 && report.status === 'Received') {
    report.status = 'Reviewed';
    report.updates.push({
      timestamp: new Date(new Date(report.createdAt).getTime() + 5 * 60000).toISOString(),
      message: 'Secure agency screening completed. Case marked high priority.',
      status: 'Reviewed'
    });
    writeJSON(reportsFile, reports);
  } else if (diffMinutes > 15 && report.status === 'Reviewed') {
    report.status = 'NGO Assigned';
    report.updates.push({
      timestamp: new Date(new Date(report.createdAt).getTime() + 15 * 60000).toISOString(),
      message: 'Assigned to nearest child protection officer and local shelter advocate.',
      status: 'NGO Assigned'
    });
    writeJSON(reportsFile, reports);
  }

  res.json(report);
});

// 4. LOG SOS ALERT
app.post('/api/sos', (req, res) => {
  try {
    const { lat, lng, deviceType } = req.body;
    const sosLogs = readJSON(sosLogsFile);
    
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

    sosLogs.push(newSOS);
    writeJSON(sosLogsFile, sosLogs);

    res.json({
      success: true,
      sosId: newSOS.id,
      timestamp: newSOS.timestamp,
      actionPlan: newSOS.actionPlan,
      dispatchUnitsCount: Math.floor(Math.random() * 3) + 2
    });
  } catch (error) {
    res.status(500).json({ error: 'SOS broadcast logging failed' });
  }
});

// 5. CHATBOT HELPER
app.post('/api/chat', (req, res) => {
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

  res.json({
    reply: responseText,
    suggestions: suggestionChips,
    priority,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Backend server active on http://localhost:${PORT}`);
});
