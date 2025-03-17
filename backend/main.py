from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from dotenv import load_dotenv

# Import routers
from routers import blood_types

# Load environment variables
load_dotenv()

app = FastAPI(title="Blood Donation Awareness API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Blood Donation Awareness API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(blood_types.router, prefix="/api/blood-types", tags=["Blood Types"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 