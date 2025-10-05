# 📝 Model Training & Evaluation Report

## ⚙️ How to Run

- **Training:** `python train.py`
- **Testing:** `python predict.py`

---

## 📂 Directory Structure

- **`train/images`** → Training images
  - _(If this path is changed, please also update it inside `yolo_params.yaml`.)_

---

## 🔎 Problem Analysis & Insights

### **1️⃣ Low Mean Pixel Accuracy (mPA)**

- **Observation:** Our model’s average **mPA ≈ 0.7** across both training and test datasets.
- **Inference:** This indicates **underfitting** — the model has not fully captured feature representations.
- **Action Taken:** We are **increasing the number of epochs** to allow deeper learning during training.

---

### **2️⃣ Low-Light Detection Failure**

- **Observation:** The model struggles to detect **Nitrogen Tanks**, **Tanks**, and **Safety Switches** in **`_dark_unclutter`** and **`_vdark_unclutter`** scenarios.
- **Inference:** The model lacks **robustness** to lighting variations, and feature extraction weakens under darkness.
- **Our Solution:**
  - **Low-light augmentation:** Generate **synthetic data** under varied dark conditions (shadows, glare, multiple darkness levels).
  - **Increased dark data ratio:** Add a higher proportion of **low-light samples** to train the model for **better generalization** in such environments.

---

### **3️⃣ Class Confusion & Misclassification**

- **Observation:** The model confuses **visually similar objects**, such as:
  - **Nitrogen Tank ↔ Fire Extinguisher**
  - **O₂ Tank ↔ N₂ Tank**
  - **Fire Alarm ↔ Safety Switch Panel ↔ Emergency Phone**
- **Inference:** This highlights a **class discrimination problem**. The confusion matrix shows repeated **false positives/negatives**.
- **Our Solution:**
  - **Targeted dataset generation:** Create synthetic datasets focusing **only on confusing pairs**.
  - **Visual variations:** Modify **angles, scales, and backgrounds** to highlight subtle differences.
  - **Future refinement:** Explore **YOLO architecture tweaks** later; for now, improving **data quality** is our top priority.

---

### **4️⃣ Occlusion Challenges**

- **Observation:** Detection fails when objects like **Nitrogen Tanks** and **Fire Extinguishers** are **partially occluded** in cluttered scenes.
- **Inference:** The model struggles with **occlusion**, as it cannot detect objects when only **partial features** are visible.
- **APPLIED SOLUTION:**
  - **Increase the Moscaic Value:** This Increase the amount of Occulsion Occurs and hence creating a much resilent model against Occulsion.

---

✅ With these improvements, we aim to make our model **more robust, discriminative, and adaptable** to real-world scenarios.
