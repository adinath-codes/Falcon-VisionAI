import io
import os
import numpy as np
from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow requests from your React frontend
# In a production environment, restrict this to your specific frontend domain.
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173/",
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained YOLOv8 model
try:
    model = YOLO("yolov8s.pt")
except Exception as e:
    raise RuntimeError(f"Failed to load YOLO model: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Object Detection API"}

@app.post("/detect/")
async def detect_objects(file: UploadFile = File(...)):
    """
    Detect objects in an uploaded image and return a JSON list of
    bounding box coordinates (x, y, width, height) and class labels.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload an image."
        )

    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Ensure the image is in RGB format for YOLO
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        # Perform inference on the image
        results = model.predict(image)

        # Process the detection results
        detections = []
        detections.append({
                    "x": 10,
                    "y": 10,
                    "h": 10,
                    "w": 10,
                    "confidence": 1,
                    "class_name": "dummy"
                })
        for r in results:
            for box in r.boxes:
                # Get coordinates in xyxy format (x1, y1, x2, y2)
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                # Convert to xywh format (x, y, width, height)
                x = x1
                y = y1
                width = x2 - x1
                height = y2 - y1

                confidence = box.conf[0].item()
                class_id = int(box.cls[0].item())
                class_name = model.names[class_id]
                
                # Append to the list of detections
                
                detections.append({
                    "x": x,
                    "y": y,
                    "h": height,
                    "w": width,
                    "confidence": confidence,
                    "class_name": class_name
                })
        
        return {"detections": detections}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred during object detection."
        )

# Run the API with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)