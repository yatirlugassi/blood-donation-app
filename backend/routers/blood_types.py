from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
import os
from dotenv import load_dotenv
import json
from pydantic import BaseModel

# Load environment variables
load_dotenv()

router = APIRouter()

# Mock data for blood types
BLOOD_TYPES = [
    {"id": 1, "type": "A+", "can_donate_to": ["A+", "AB+"], "can_receive_from": ["A+", "A-", "O+", "O-"]},
    {"id": 2, "type": "A-", "can_donate_to": ["A+", "A-", "AB+", "AB-"], "can_receive_from": ["A-", "O-"]},
    {"id": 3, "type": "B+", "can_donate_to": ["B+", "AB+"], "can_receive_from": ["B+", "B-", "O+", "O-"]},
    {"id": 4, "type": "B-", "can_donate_to": ["B+", "B-", "AB+", "AB-"], "can_receive_from": ["B-", "O-"]},
    {"id": 5, "type": "AB+", "can_donate_to": ["AB+"], "can_receive_from": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]},
    {"id": 6, "type": "AB-", "can_donate_to": ["AB+", "AB-"], "can_receive_from": ["A-", "B-", "AB-", "O-"]},
    {"id": 7, "type": "O+", "can_donate_to": ["A+", "B+", "AB+", "O+"], "can_receive_from": ["O+", "O-"]},
    {"id": 8, "type": "O-", "can_donate_to": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], "can_receive_from": ["O-"]}
]

# Mock data for regional blood type distribution
REGIONAL_DATA = {
    "israel": {
        "region": "Israel",
        "population": 8323659,
        "distribution": {
            "A+": 34.0,
            "A-": 4.0,
            "B+": 17.0,
            "B-": 2.0,
            "AB+": 7.0,
            "AB-": 1.0,
            "O+": 32.0,
            "O-": 3.0
        }
    }
}

# Pydantic models
class BloodType(BaseModel):
    id: int
    type: str
    can_donate_to: List[str]
    can_receive_from: List[str]

class RegionalDistribution(BaseModel):
    region: str
    population: int
    distribution: Dict[str, float]

@router.get("/", response_model=List[BloodType])
async def get_blood_types():
    """
    Get all blood types and their compatibility information.
    """
    return BLOOD_TYPES

@router.get("/{blood_type}", response_model=BloodType)
async def get_blood_type(blood_type: str):
    """
    Get information about a specific blood type.
    """
    for bt in BLOOD_TYPES:
        if bt["type"] == blood_type:
            return bt
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Blood type '{blood_type}' not found"
    )

@router.get("/regional/{region}", response_model=RegionalDistribution)
async def get_regional_distribution(region: str):
    """
    Get blood type distribution for a specific region.
    """
    region_lower = region.lower()
    if region_lower in REGIONAL_DATA:
        return REGIONAL_DATA[region_lower]
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Regional data for '{region}' not found"
    )

@router.get("/compatibility", response_model=Dict[str, Any])
async def get_compatibility_matrix():
    """
    Get the full compatibility matrix for all blood types.
    """
    compatibility_matrix = {}
    for bt in BLOOD_TYPES:
        compatibility_matrix[bt["type"]] = {
            "can_donate_to": bt["can_donate_to"],
            "can_receive_from": bt["can_receive_from"]
        }
    return compatibility_matrix 