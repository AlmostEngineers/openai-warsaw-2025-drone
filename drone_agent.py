import os
from agents import Agent, Runner, function_tool
from typing import Dict, Any, Tuple
import asyncio
import random

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
            name="Emergency Situation Drone Operator",
            instructions="""You are an emergency response drone operator. Your responsibilities:
            1. Immediately assess the emergency situation
            2. Call appropriate emergency services
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
            name="Drone Operator",
            instructions="""You are an expert in drone control and navigation with advanced emergency detection capabilities. You can do:
            1. Flight planning and execution
            2. Obstacle avoidance
            3. Mission planning
            4. Emergency detection and response
            5. Image-based navigation
            
            Emergency Detection Protocol:
            - Continuously analyze the visual feed for potential emergencies
            - Look for signs of:
              * Car crashes (collisions, smoke, debris)
              * Fires (flames, smoke, people evacuating)
              * Medical emergencies (unconscious people, injuries)
              * Natural disasters (structural damage, people in distress)
            - Assess the severity of any detected emergency (1-5 scale)
            - If emergency detected, immediately hand off control to emergency agent
            
            Always ensure safety first. When given a command:
            1. Break it down into safe, executable steps
            2. Verify each step is within safe parameters
            3. Execute commands one at a time
            4. Confirm successful execution before proceeding
            
            For image-based navigation:
            - Use coordinates between 0 and 1
            - 0,0 is the top-left corner of the image
            - 1,1 is the bottom-right corner of the image
            - Always validate coordinates before movement""",
            tools=[move_to_image_coordinates],
            handoffs=[self.emergency_agent]  # Specify that this agent can hand off to emergency_agent
        )
    
    async def send_command(self, command: str) -> str:
        """Send a command to the drone agent"""
        # First check for emergencies using the main agent's analysis capabilities
        emergency_check = await Runner.run(
            self.main_agent,
            input="""Analyze the current visual feed and determine if there is an emergency situation.
            If an emergency is detected, provide the following information in JSON format:
            {
                "is_emergency": true/false,
                "type": "car_crash/fire/medical_emergency/natural_disaster",
                "location": {"x": float, "y": float},
                "severity": 1-5
            }
            If no emergency is detected, return {"is_emergency": false}"""
        )
        
        try:
            emergency_data = eval(emergency_check.final_output)
        except:
            emergency_data = {"is_emergency": False}
        
        if emergency_data.get("is_emergency", False):
            print(f"\nEMERGENCY DETECTED: {emergency_data['type']}")
            # The main agent will automatically hand off to emergency_agent
            # when it detects an emergency due to the handoffs configuration
            result = await Runner.run(
                self.main_agent,
                input=f"Emergency situation detected: {emergency_data['type']} at {emergency_data['location']} with severity {emergency_data['severity']}. Take control and handle the emergency."
            )
            return result.final_output
        
        # If no emergency, proceed with normal command
        result = await Runner.run(self.main_agent, input=command)
        return result.final_output

async def main():
    # Initialize the agent
    agent = DroneAgent()
    
    # Example commands
    commands = [
        "Take off and hover at 10 meters",
        "Move to the center of the image (0.5, 0.5)",
        "Move to the top-right corner of the image (0.9, 0.1)",
        "Move to the bottom-left corner of the image (0.1, 0.9)",
        "Land safely"
    ]
    
    for command in commands:
        print(f"\nSending command: {command}")
        response = await agent.send_command(command)
        print(f"Response: {response}")

if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main()) 