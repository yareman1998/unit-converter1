from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- Imported CORS
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import Document, init_beanie
import os
from dotenv import load_dotenv

load_dotenv() # Loads the variables from .env

# ==========================================
# 1. Define the Beanie Document
# ==========================================
class ConversionLog(Document):
    category: str
    input_value: float
    from_unit: str
    to_unit: str
    result_value: float
    
    class Settings:
        name = "history"

# ==========================================
# 2. Server Startup / Initialization
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    MONGO_URI = os.getenv("MONGO_URI")
    client = AsyncIOMotorClient(MONGO_URI)
    
    await init_beanie(database=client.converter_db, document_models=[ConversionLog])
    yield

# Initialize the FastAPI app and attach the lifespan
app = FastAPI(title="Unit Converter API", lifespan=lifespan)

# ==========================================
# 3. CORS Middleware Setup (Crucial for Angular)
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your Angular frontend to connect
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# ==========================================
# 4. The Routes
# ==========================================
@app.get("/")
def read_root():
    return {"status": "Server is up and connected to MongoDB via Beanie!"}

@app.post("/api/history")
async def save_conversion(conversion: ConversionLog):
    await conversion.insert()
    
    return {
        "message": "Conversion saved successfully", 
        "id": str(conversion.id)
    }

@app.get("/api/history")
async def get_history():
    # Sorts by newest first, limited to the last 10 entries
    history_list = await ConversionLog.find_all().sort(-ConversionLog.id).limit(10).to_list()
    
    return {"history": history_list}