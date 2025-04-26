from fastapi import FastAPI
from typing import List, Dict, Any, Literal
from pydantic import BaseModel
import datetime


# Define the data models
class Location(BaseModel):
    x: float
    y: float


class Emergency(BaseModel):
    id: int
    emergency_type: Literal[
        "car_crash",
        "fire",
        "medical_emergency",
        "natural_disaster",
        "suspicious_activity",
        "other",
    ]
    location: Location
    status: str
    severity: int
    timestamp: datetime.datetime
    description: str = ""
    image: str = ""  # Base64 encoded image
    changelog: list[tuple[datetime.datetime, str]]


# In-memory storage for emergencies
emergencies: List[Emergency] = [
    Emergency(
        id=1,
        emergency_type="car_crash",
        location=Location(x=10.0, y=20.0),
        severity=5,
        timestamp=datetime.datetime.now(),
    )
]

# Create FastAPI app
app = FastAPI(title="Drone Emergency API")


@app.get("/emergencies", response_model=List[Emergency])
async def get_emergencies():
    """Get all historical emergencies"""
    return emergencies


def add_emergency(
    intervention_id: int,
    emergency_type: str,
    location: Dict[str, float],
    severity: int,
    description: str = "",
    image: str = "",
) -> Emergency:
    """Add a new emergency to the list"""
    emergency = Emergency(
        id=intervention_id,
        emergency_type=emergency_type,
        location=Location(**location),
        status="IN_PROGRESS",
        severity=severity,
        timestamp=datetime.datetime.now(),
        description=description,
        image=image,
        changelog=[],
    )
    emergencies.append(emergency)
    return emergency

def resolve_emergency(intervention_id: int):
    for em in emergencies:
        if em.intervention_id != intervention_id:
            continue

        em.status = 'RESOLVED'
        em.changelog.append((datetime.datetime.now(), 'RESOLVED'))


# Run the server
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
