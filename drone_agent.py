import os
from agents import Agent, Runner, function_tool, trace, Handoff, FileSearchTool
from typing import Dict, Any, Tuple, TypedDict, Literal
from PIL import Image
import asyncio
import random
import base64
from io import BytesIO
from dotenv import load_dotenv
import signal
import sys

# Load environment variables from .env file
load_dotenv()

# Verify API key is set
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY environment variable is not set. Please set it in your .env file.")

class Location(TypedDict):
    x: float
    y: float


import base64
from openai import OpenAI


client = OpenAI()

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def encode_image_to_base64(image: Image.Image) -> str:
    """Convert PIL Image to base64 string
    
    Args:
        image: PIL Image object to encode
        
    Returns:
        str: Base64 encoded image string
    """
    # Convert image to bytes
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
    return img_str

@function_tool
def follow_path(path_description: str) -> str:
    """Follow a specified path with the drone
    
    Args:
        path_description: Description of the path to follow
        
    Returns:
        str: Status of the path following operation
    """
    # Mock implementation
    print(f"Following path: {path_description}")
    return f"Successfully followed path: {path_description}"

def analyze_image(image_encoded: str) -> str:
    """Analyze an image using OpenAI's API
    
    Args:
        image_encoded: Base64 encoded image string
        
    Returns:
        str: Analysis result from OpenAI
    """
    try:
        response = client.responses.create(
            model="gpt-4.1",
            input=[
                {
                    "role": "system",
                    "content": """
                    You are a drone operator analyzing images for both normal operations and emergency situations.
                    Your task is to:
                    1. Analyze the image content
                    2. Identify objects and situations
                    3. Describe what you see and give coordinates (x, y) for every object/situation. x and y must be normalized by image width and height so it is between 0 and 1

                    Emergency situations include:
                    - Car crashes
                    - Unconscious or injured people
                    - Fires
                    - Natural disasters
                    - Suspicious activities
                    - Other dangerous situations
                    """

                    # Provide your response in JSON format:
                    # [
                    # {
                    #     "observation_name": observation_name,
                    #     "description": "Detailed description of what you see",
                    # }
                    # ]
                    # {
                    #     "is_emergency": true/false,
                    #     "description": "Detailed description of what you see",
                    #     "path_description": "Description of path to follow (if no emergency)",
                    #     "emergency_type": "Type of emergency if detected (car_crash, medical, fire, etc.)"
                    # }
                    # """
                },
                {
                    "role": "user",
                    "content": [
                        { "type": "input_text", "text": "Analyze this image and determine if there's an emergency or what path to follow." },
                        {
                            "type": "input_image",
                            "image_url": f"data:image/jpeg;base64,{image_encoded}",
                        },
                    ],
                }
            ],
        )
    except e:
        print(e)

    # print("response", response)
    return response.output_text

@function_tool
def call_emergency_services(
    emergency_type: Literal["car_crash", "fire", "medical_emergency", "natural_disaster", "suspicious_activity"],
    location: Location,
    severity: int
) -> str:
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
def observe_emergency(
    emergency_type: Literal["car_crash", "fire", "medical_emergency", "natural_disaster", "suspicious_activity"]
) -> str:
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
            4. Continue until emergency services arrive or situation is resolved
            
            IMPORTANT: After 5 turns, you must conclude your operation and hand control back to the main agent.""",
            tools=[call_emergency_services, observe_emergency, move_to_image_coordinates],
            handoff_description='This agent should be called when an emergency is detected. It handles emergency situations.'
        )

        self.drone_operator_agent = Agent(
            name="Drone Operator Agent",
            instructions="""You are a drone operator responsible for both normal operations and emergency detection.

            Your responsibilities are:
            1. Analyze images from the drone's camera
            2. Determine if there is an emergency situation
            3. If no emergency:
               - Describe the path the drone should follow
               - Use the follow_path function to execute the path
            4. If emergency detected:
               - Hand off control to the emergency response agent
               - Provide details about the emergency situation

            Emergency situations include:
            - Car crashes
            - Unconscious or injured people
            - Fires
            - Natural disasters
            - Suspicious activities
            - Other dangerous situations

            Normal operations:
            - Follow predefined paths
            - Monitor the area
            - Maintain safe altitude and distance
            - Avoid obstacles

            IMPORTANT: After 10 turns, you must conclude your operation.""",
            tools=[follow_path, move_to_image_coordinates],
            handoffs=[self.emergency_agent],
            handoff_description='This agent handles normal drone operations and detects emergencies.'
        )
    
    async def step(self, image: Image.Image | None = None) -> str:
        """Process a single step of the drone agent with optional image analysis
        
        Args:
            image: Optional PIL Image object to analyze
            
        Returns:
            str: Response from the agent
        """
        if image is None:
            raise ValueError("Image must be provided")

        try:
            # Ensure image is in RGB mode
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Encode image to base64
            image_encoded = encode_image_to_base64(image)
            
            # Analyze image
            with trace("drone_operation"):
                img_desc = analyze_image(image_encoded)
                print("Image description", img_desc)
                
                result = await Runner.run(
                    self.drone_operator_agent,
                    input=f"""Analyze the image and determine the next action. If there's an emergency, hand off to the emergency agent.
                    Image analysis: {img_desc}""",
                )
            
            return result.final_output
        except Exception as e:
            return f"Error during operation: {str(e)}"

async def main():
    try:
        # Initialize the agent
        agent = DroneAgent()
        
        # Load image
        image = Image.open("./image6.png")
        response = await agent.step(image)
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error in main: {str(e)}")
    finally:
        print("Cleaning up and exiting...")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nProgram interrupted by user")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
    finally:
        sys.exit(0) 