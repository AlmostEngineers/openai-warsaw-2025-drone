import os
from agents import Agent, Runner, function_tool
from typing import Dict, Any, Tuple
import asyncio
import random
from PIL import Image
import base64
from io import BytesIO


@function_tool
def call_emergency_services(emergency_type: str, location: Dict[str, float], severity: int) -> str:
    """
    Call emergency services with details about the situation.
    
    Args:
        emergency_type: Type of emergency (car_crash, fire, etc.)
        location: Dictionary with x,y coordinates
        severity: Severity level (1-5)
    """
    # Mock emergency service call
    print(f"Calling emergency services for {emergency_type} at coordinates {location}")
    print(f"Severity level: {severity}")
    return f"Emergency services have been notified about {emergency_type} at location {location}"

@function_tool
def observe_emergency(emergency_type: str) -> str:
    """
    Observe and report on the emergency situation.
    
    Args:
        emergency_type: Type of emergency being observed
    """
    # Mock observation
    observations = {
        "car_crash": [
            "Two vehicles involved in collision",
            "One vehicle appears to be smoking",
            "No visible movement from inside vehicles",
            "Debris scattered across the road"
        ],
        "fire": [
            "Large flames visible from building",
            "Smoke billowing from multiple windows",
            "People evacuating the area",
            "Fire spreading to adjacent structures"
        ],
        "medical_emergency": [
            "Person appears unconscious on the ground",
            "Bystanders attempting to provide assistance",
            "No visible injuries from current position",
            "Emergency medical equipment being prepared"
        ],
        "natural_disaster": [
            "Significant structural damage visible",
            "People seeking shelter",
            "Emergency response teams mobilizing",
            "Infrastructure damage in multiple locations"
        ]
    }
    
    observation = random.choice(observations.get(emergency_type, ["Situation appears stable"]))
    return f"Observation: {observation}"

@function_tool
def move_to_image_coordinates(x: float, y: float) -> str:
    """
    Move the drone to specified coordinates on the camera image.
    
    Args:
        x (float): X coordinate between 0 and 1 (0 = left edge, 1 = right edge)
        y (float): Y coordinate between 0 and 1 (0 = top edge, 1 = bottom edge)
    
    Returns:
        str: Status of the movement
    """
    # Validate coordinates
    if not (0 <= x <= 1 and 0 <= y <= 1):
        return "Error: Coordinates must be between 0 and 1"
    
    # Mock movement calculations
    actual_x = x + random.uniform(-0.05, 0.05)
    actual_y = y + random.uniform(-0.05, 0.05)
    
    # Clamp values to ensure they stay within bounds
    actual_x = max(0, min(1, actual_x))
    actual_y = max(0, min(1, actual_y))
    
    print(f"Moving drone to image coordinates: x={actual_x:.2f}, y={actual_y:.2f}")
    return f"Successfully moved to coordinates: x={actual_x:.2f}, y={actual_y:.2f}"

class DroneAgent:
    def __init__(self):
        self.emergency_agent = Agent(
            name="Emergency Response Agent",
            instructions="""You are an emergency response drone operator. Your sole responsibility is to handle emergency situations.

            When you receive control:
            1. Immediately assess the emergency situation
            2. Call appropriate emergency services with location and severity
            3. Maintain safe observation of the scene
            4. Provide real-time updates to emergency services
            5. Avoid interfering with emergency response efforts
            
            Emergency Response Protocol:
            1. First, call emergency services with location and details
            2. Then, observe and report on the situation
            3. Maintain safe distance from the scene
            4. Provide updates every 30 seconds
            5. Continue until emergency services arrive or situation is resolved""",
            tools=[call_emergency_services, observe_emergency, move_to_image_coordinates]
        )

        self.main_agent = Agent(
            name="Surveillance and Detection Agent",
            instructions="""You are a surveillance drone operator focused on detecting unusual or dangerous situations. Your primary responsibilities are:

            1. Continuous Monitoring:
               - Analyze the visual feed for any unusual or dangerous situations
               - Look for patterns that indicate potential emergencies
               - Monitor for sudden changes in the environment

            2. Emergency Detection:
               Look for signs of:
               * Car crashes (collisions, smoke, debris)
               * Fires (flames, smoke, people evacuating)
               * Medical emergencies (unconscious people, injuries)
               * Natural disasters (structural damage, people in distress)
               * Suspicious activities or dangerous situations
               * Unusual crowd behavior
               * Structural hazards
               * Environmental dangers

            3. Assessment Protocol:
               - Evaluate the severity of any detected situation (1-5 scale)
               - Determine if immediate action is required
               - If situation requires emergency response, immediately hand off to emergency agent

            4. Handoff Protocol:
               When detecting an emergency:
               - Immediately stop current operations
               - Prepare emergency details (type, location, severity)
               - Hand off control to emergency agent
               - Provide clear context about the situation

            Your primary goal is to detect and identify potential emergencies, then hand off control to the emergency response agent.""",
            tools=[move_to_image_coordinates],
            handoffs=[self.emergency_agent]  # Specify that this agent can hand off to emergency_agent
        )
    
    async def send_command(self, command: str, image_path: str = None) -> str:
        """Send a command to the drone agent with optional image analysis
        
        Args:
            command: The command to execute
            image_path: Optional path to an image file to analyze
        """
        if image_path:
            # Read the image file
            with open(image_path, 'rb') as f:
                image_data = f.read()
            
            # Create a message with the image attachment and context
            result = await Runner.run(
                self.main_agent,
                input=f"""Analyze the attached image for any unusual or dangerous situations.
                Look specifically for:
                - Car crashes (collisions, smoke, debris)
                - Fires (flames, smoke, evacuations)
                - Medical emergencies (unconscious people, injuries)
                - Natural disasters (structural damage, distress)
                - Suspicious activities
                - Unusual crowd behavior
                - Structural hazards
                - Environmental dangers

                If you detect an emergency:
                1. Note the type of emergency
                2. Assess the severity (1-5 scale)
                3. Note the location in the image
                4. Immediately hand off control to the emergency agent

                If no emergency is detected, proceed with the command: "{command}".""",
                attachments=[image_path],
                context={"image": image_data}
            )
        else:
            result = await Runner.run(
                self.main_agent,
                input=f"""While executing the command: "{command}", continuously monitor for any unusual or dangerous situations.
                If you detect anything that requires emergency response, immediately hand off control to the emergency agent.
                Otherwise, proceed with the command."""
            )
        
        return result.final_output

async def main():
    # Initialize the agent
    agent = DroneAgent()
    
    # Example commands with image analysis
    commands = [
        ("Take off and hover at 10 meters", "/home/bwisniewski/image6.jpg"),  # Replace with actual image path
        # ("Move to the center of the image (0.5, 0.5)", None),
        # ("Move to the top-right corner of the image (0.9, 0.1)", None),
        # ("Move to the bottom-left corner of the image (0.1, 0.9)", None),
        ("Land safely", None)
    ]
    
    for command, image_path in commands:
        print(f"\nSending command: {command}")
        if image_path:
            print(f"With image analysis: {image_path}")
        response = await agent.send_command(command, image_path)
        print(f"Response: {response}")

if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main()) 