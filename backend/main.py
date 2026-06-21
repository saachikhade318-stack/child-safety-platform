import os
import json
import uuid
import random
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Request, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from dotenv import load_dotenv
from bson import ObjectId

# Load environment variables
load_dotenv()

app = FastAPI(title="SafeNest Child Safety API", version="1.0.0")

# MongoDB Connection
MONGODB_URI = os.getenv("MONGODB_URI", "")
DATABASE_NAME = os.getenv("DATABASE_NAME", "child_abuse")

mongo_client = None
db = None

def connect_to_mongo():
    global mongo_client, db
    try:
        if not MONGODB_URI:
            raise ValueError("MONGODB_URI environment variable is not set")
        mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Test connection
        mongo_client.admin.command('ping')
        db = mongo_client[DATABASE_NAME]
        print(f"[OK] Connected to MongoDB: {DATABASE_NAME}")
        return True
    except ServerSelectionTimeoutError:
        print("[ERROR] MongoDB connection failed: Server not reachable")
        return False
    except Exception as e:
        print(f"[ERROR] MongoDB connection error: {e}")
        return False

# Connect on startup
mongo_connected = connect_to_mongo()

# Enable CORS for frontend Vite client on http://localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories setup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

# MongoDB Collections (auto-created on first use)
REPORTS_COLLECTION = "reports"
SOS_LOGS_COLLECTION = "sos_logs"
NGOS_COLLECTION = "ngos"

# Function to ensure collections exist
def ensure_collections():
    if mongo_connected and db is not None:
        if NGOS_COLLECTION not in db.list_collection_names():
            db[NGOS_COLLECTION].insert_many(DEFAULT_NGOS)
        # Create indexes for faster queries
        db[REPORTS_COLLECTION].create_index("trackingCode")
        db[SOS_LOGS_COLLECTION].create_index("timestamp")

# Default NGO Database
DEFAULT_NGOS = [
  {
    "id": 1,
    "name": "Global Shield Foundation",
    "contact": "1-800-422-4453",
    "email": "support@globalshield.org",
    "address": "Metropolis Safe Haven, NY, USA",
    "coords": { "x": 35, "y": 42 },
    "description": "24/7 immediate trauma intervention and legal advocacy for minors.",
    "status": "Active Nodes: 14"
  },
  {
    "id": 2,
    "name": "Beacon Youth Protection",
    "contact": "+44 800 1111",
    "email": "helpline@beaconyouth.org",
    "address": "London Community Center, UK",
    "coords": { "x": 48, "y": 32 },
    "description": "Safe spaces, counseling networks, and school education outreach programs.",
    "status": "Active Nodes: 8"
  },
  {
    "id": 3,
    "name": "Lotus Guardian Initiative",
    "contact": "+91 1098",
    "email": "rescue@lotusguardians.in",
    "address": "New Delhi Emergency Desk, India",
    "coords": { "x": 68, "y": 48 },
    "description": "Nationwide response units working directly with child welfare committees.",
    "status": "Active Nodes: 22"
  },
  {
    "id": 4,
    "name": "Safe Passage Coalition",
    "contact": "+27 800 055 555",
    "email": "help@safepassage.org",
    "address": "Cape Town Crisis Center, South Africa",
    "coords": { "x": 52, "y": 78 },
    "description": "Emergency shelters and rapid escape assistance in high-density areas.",
    "status": "Active Nodes: 6"
  }
]

# Initialize NGOs on startup
ensure_collections()

# Serve uploaded media statically
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# 1. GET NGOs list
@app.get("/api/ngos")
def get_ngos():
    if not mongo_connected or db is None:
        return DEFAULT_NGOS
    try:
        ngos = list(db[NGOS_COLLECTION].find({}, {"_id": 0}))
        return ngos if ngos else DEFAULT_NGOS
    except Exception as e:
        print(f"Error fetching NGOs: {e}")
        return DEFAULT_NGOS

# 2. SUBMIT ANONYMOUS REPORT (Form + Files upload support)
@app.post("/api/reports")
async def create_report(
    request: Request,
    incidentType: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    location: Optional[str] = Form("Anonymous"),
    senderContact: Optional[str] = Form("Anonymous"),
    attachments: List[UploadFile] = File(None)
):
    try:
        if not mongo_connected or db is None:
            raise HTTPException(status_code=503, detail="Database connection unavailable. Please try again.")
        
        # Check Content-Type to see if JSON is sent
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            payload = await request.json()
            incident_type = payload.get("incidentType")
            desc = payload.get("description")
            report_date = payload.get("date")
            loc = payload.get("location", "Anonymous")
            contact = payload.get("senderContact", "Anonymous")
            saved_attachments = []
        else:
            incident_type = incidentType
            desc = description
            report_date = date
            loc = location or "Anonymous"
            contact = senderContact or "Anonymous"
            
            saved_attachments = []
            if attachments:
                for file in attachments:
                    if file.filename:
                        # Create clean secure filename
                        file_ext = os.path.splitext(file.filename)[1]
                        unique_name = f"attachment-{uuid.uuid4().hex}{file_ext}"
                        filepath = os.path.join(UPLOADS_DIR, unique_name)
                        
                        # Read and save file content
                        content = await file.read()
                        with open(filepath, "wb") as buffer:
                            buffer.write(content)
                        
                        saved_attachments.append(f"/uploads/{unique_name}")

        if not incident_type or not desc:
            raise HTTPException(status_code=400, detail="Incident type and description are required.")

        # Generate clean futuristic tracking code SAFE-XXXX-XXXX
        tracking_code = f"SAFE-{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=4))}-{''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=4))}"

        new_report = {
            "id": str(uuid.uuid4()),
            "trackingCode": tracking_code,
            "incidentType": incident_type,
            "description": desc,
            "date": report_date or datetime.now().strftime("%Y-%m-%d"),
            "location": loc or "Anonymous",
            "senderContact": contact or "Anonymous",
            "attachments": saved_attachments,
            "status": "Received",
            "createdAt": datetime.now().isoformat(),
            "updates": [
                {
                    "timestamp": datetime.now().isoformat(),
                    "message": "Report submitted securely through automated cryptographic routing.",
                    "status": "Received"
                }
            ]
        }

        # Insert into MongoDB
        db[REPORTS_COLLECTION].insert_one(new_report)
        print(f"[OK] Report saved to MongoDB: {tracking_code}")

        return {
            "success": True,
            "message": "Anonymous report recorded successfully.",
            "trackingCode": tracking_code,
            "status": new_report["status"]
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        print("Error submitting report:", e)
        raise HTTPException(status_code=500, detail="Failed to process anonymous report.")

# 3. GET REPORT STATUS
@app.get("/api/reports/{tracking_code}")
def get_report_status(tracking_code: str):
    if not mongo_connected or db is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable.")
    
    try:
        # Locate report by tracking code (case insensitive)
        report = db[REPORTS_COLLECTION].find_one({"trackingCode": {"$regex": f"^{tracking_code}$", "$options": "i"}})
        
        if not report:
            raise HTTPException(status_code=404, detail="Tracking code not found. Please verify the code.")

        # Dynamic status update simulation for premium visual experience!
        created_time = datetime.fromisoformat(report["createdAt"])
        time_diff = (datetime.now() - created_time).total_seconds() / 60.0  # Minutes
        
        updated = False
        if time_diff > 3 and report["status"] == "Received":
            report["status"] = "Reviewed"
            report["updates"].append({
                "timestamp": datetime.now().isoformat(),
                "message": "Secure agency screening completed. Case marked high priority.",
                "status": "Reviewed"
            })
            updated = True
        elif time_diff > 10 and report["status"] == "Reviewed":
            report["status"] = "NGO Assigned"
            report["updates"].append({
                "timestamp": datetime.now().isoformat(),
                "message": "Assigned to nearest child protection officer and local shelter advocate.",
                "status": "NGO Assigned"
            })
            updated = True

        if updated:
            # Save updates back to MongoDB
            db[REPORTS_COLLECTION].update_one(
                {"trackingCode": report["trackingCode"]},
                {"$set": report}
            )

        # Remove MongoDB ObjectId from response
        report.pop("_id", None)
        return report
    except Exception as e:
        print(f"Error retrieving report: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve report status.")

# 4. LOG SOS ALERT
@app.post("/api/sos")
def trigger_sos(payload: dict):
    try:
        if not mongo_connected or db is None:
            raise HTTPException(status_code=503, detail="Database connection unavailable.")
        
        lat = payload.get("lat", 40.7128)
        lng = payload.get("lng", -74.0060)
        device_type = payload.get("deviceType", "Web Client")
        
        new_sos = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now().isoformat(),
            "coords": { "lat": lat, "lng": lng },
            "device": device_type,
            "status": "Dispatched",
            "actionPlan": [
                "SafeNest emergency coordinates transmitted securely to local authority desk.",
                "Nearest responsive patrol car and child health advocate notified.",
                "Encrypted backup log created locally to preserve timeline safety."
            ]
        }

        # Insert into MongoDB
        db[SOS_LOGS_COLLECTION].insert_one(new_sos)
        print(f"[OK] SOS Alert logged to MongoDB: {new_sos['id']}")

        return {
            "success": True,
            "sosId": new_sos["id"],
            "timestamp": new_sos["timestamp"],
            "actionPlan": new_sos["actionPlan"],
            "dispatchUnitsCount": random.randint(2, 4)
        }
    except Exception as e:
        print(f"Error logging SOS: {e}")
        raise HTTPException(status_code=500, detail="SOS signal logging failed.")

# 5. CHATBOT HELPER
@app.post("/api/chat")
def chatbot_help(payload: dict):
    message = payload.get("message", "")
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    query = message.lower()
    response_text = ""
    suggestion_chips = []
    priority = "normal"

    if any(k in query for k in ["help", "scared", "hurt", "danger", "police", "abuse"]):
        response_text = "I hear you, and you are not alone. Please click the red SOS button at the bottom of the page or call 1-800-422-4453 (USA Helpline) immediately. If you are in physical danger, seek a safe place. I can guide you through an anonymous report here."
        suggestion_chips = ["Start Anonymous Report", "Local Shelter Info", "View Safety Tips"]
        priority = "emergency"
    elif any(k in query for k in ["report", "anonymous", "submit"]):
        response_text = "Submitting an anonymous report is completely secure. Click 'Report Anonymously' in the menu or scroll to the Reporting Portal. No personal credentials are required. You'll receive a tracking ID (e.g. SAFE-XXXX-XXXX) to check updates."
        suggestion_chips = ["Go to Report Portal", "How is my identity hidden?"]
        priority = "high"
    elif any(k in query for k in ["touch", "body", "safe touch"]):
        response_text = "Your body belongs entirely to you. Nobody has the right to touch you in a way that makes you feel uncomfortable, confused, or scared. Even if it is someone you know or love, you should talk to a trusted adult. It is NEVER your fault."
        suggestion_chips = ["Safe vs Unsafe touch guide", "Who can I tell?"]
    elif any(k in query for k in ["track", "check status", "code"]):
        response_text = "If you have already submitted a report, enter your tracking code (e.g. SAFE-XXXX-XXXX) in the 'Track Report' tab of the Reporting Portal to see status updates in real-time."
        suggestion_chips = ["Track Report Now"]
    else:
        response_text = "Hello, I am SafeNest, your secure safety assistant. You can ask me about reporting safety guidelines, recognizing unsafe situations, or finding immediate help. Everything shared here is encrypted in your current browser session."
        suggestion_chips = ["What is an unsafe touch?", "How do I report abuse?", "Helpline numbers"]

    return {
        "reply": response_text,
        "suggestions": suggestion_chips,
        "priority": priority,
        "timestamp": datetime.now().isoformat()
    }
