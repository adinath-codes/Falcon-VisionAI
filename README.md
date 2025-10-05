# 🧠 YOLO FALCON VISIONAI OBJECT DETECTION — Local Setup & Execution Guide
## **FRONTEND**
```bash
npm run dev
```
## **BACKEND**

This guide provides detailed instructions to **set up**, **train**, and **test** your YOLO-based object detection model locally.

---

## 🧩 1. Environment Setup

Before starting, ensure you have **[Miniconda](https://docs.conda.io/en/latest/miniconda.html)** installed.

### 🛠️ Steps

1. **Initialize Conda**

   ```bash
   conda init
   ```

2. **Activate Conda**

   ```bash
   conda activate
   ```

3. **Navigate to the Environment Setup Folder**

   ```bash
   cd ENV_SETUP
   ```

4. **Run the Setup Script**
   ```bash
   setup_env.bat
   ```

> ⚡ This script will automatically create and configure your environment with all required dependencies.

---

## ⚙️ 2. How to Run

### 🏋️ Training

To train your YOLO model:

```bash
python train.py
```

### 🔍 Testing / Prediction

To test or make predictions:

```bash
python predict.py
```

> 💡 **Tip:** If prompted to select a training folder, choose:
>
> - The **most recently created** folder, or
> - The one named **`train{number}`** with the **highest number** (e.g., `train23`).

---

## 🗂️ 3. Directory Structure

| Path                   | Description                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **`train/images`**     | Folder containing training images. _(If this path is modified, make sure to update it in `yolo_params.yaml`.)_                  |
| **`runs/`**            | Stores all experiment results such as training logs and validation outputs.                                                     |
| **`runs/val{number}`** | Folder containing validation/output results for each training session. Check the **latest folder** for the most recent results. |

---

## 📊 4. Output Interpretation

After training, results and model weights will be saved under the **`runs/`** directory.

- **Detection Results:**  
  Inside `runs/val{some_number}`, you’ll find:
  - Model weights (e.g., `best.pt`, `last.pt`)
  - Validation images with bounding boxes
  - Metrics summary (Precision, Recall, mAP, etc.)

> ✅ Always verify results from the **newest** `val{number}` folder to get the most updated performance metrics.

---

## 🧾 5. Notes

- Ensure your dataset follows YOLO directory standards.
- Modify configuration files (like `yolo_params.yaml`) carefully before training.
- Always use the same environment for both training and prediction to avoid dependency mismatches.

---

**Author:** _Your Name or Team Name_  
**Framework:** YOLOv5 / YOLOv8 (Update accordingly)  
**License:** MIT (or your preferred license)
