import os
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from dotenv import load_dotenv
from predict import predict_and_save
# Initialize FastAPI app
app = FastAPI()

# Configure CORS to allow requests from your React frontend
# In a production environment, restrict this to your specific frontend domain.
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173/",
    "http://localhost:5173",
    "https://falcon-vision-ai.vercel.app"
    "https://falcon-vision-ai.vercel.app/"
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
        image_array = np.frombuffer(image_bytes, dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        # Ensure the image is in RGB format for YOLO
        # if image.mode != "RGB":
        #     image = image.convert("RGB")
            
        # Perform inference on the image
        print("Performing inference...")
        model = YOLO("runs/detect/train3/weights/best.pt")
        results = predict_and_save(model,image)
        # print("Inference completed.",results)
       #read results from output/label
       

        # Process the detection results
        detections = []
        for r in results:
            print(r)

            # confidence = box.conf[0].item()
            class_name = model.names[r[0]]
            
            # Append to the list of detections
            
            # detections.append({
            #     "x": r[2]*100,
            #     "y": r[3]*100,
            #     "h": r[4]*100,
            #     "w": r[5]*100,
            #     "confidence": r[1],
            #     "class_name": class_name
            # })
            detections.append({
                "x": r[2],
                "y": r[3],
                "w": r[4],
                "h": r[5],
                "confidence": r[1],
                "class_name": class_name,
                "class_id": r[0]
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
    uvicorn.run(app, host="https://falcon-visionai.onrender.com", port=os.getenv("PORT") or 8000)