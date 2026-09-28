[README.md](https://github.com/user-attachments/files/32775708/README.md)
# SmartWaste — AI-Powered Waste Management

> **Identify. Segregate. Manage.**

SmartWaste is a web-based waste management platform designed to help users identify waste, understand proper segregation, find suitable collection centres, and learn responsible waste-management practices.

🌐 **Live Demo:** https://smartwaste-mocha.vercel.app

---

## 🚨 Problem

Improper waste segregation and disposal can create challenges for recycling, waste processing, and environmental management.

People may be unsure about:

- Which category a waste item belongs to
- Whether an item can be recycled
- How different types of waste should be handled
- Where suitable collection centres are located
- How proper segregation can contribute to better waste management

SmartWaste addresses these challenges through a single, easy-to-use digital platform.

---

## 💡 Our Solution

SmartWaste combines an **AI-powered waste classifier**, **waste-management information**, **collection-centre discovery**, and **interactive dashboards** into one platform.

### How it works

1. **Identify** — Upload or capture an image of a waste item.
2. **Classify** — The AI model predicts the waste category.
3. **Understand** — Users can view guidance related to the identified waste.
4. **Locate** — Users can explore suitable collection centres using the map.
5. **Learn** — Waste guides, awareness content, and FAQs help users understand responsible disposal.

---

## ✨ Key Features

### 🤖 AI Waste Classifier

The AI Waste Scanner allows users to upload an image and receive a predicted waste category.

Supported categories:

- `Organic_Wet`
- `Recyclable_Dry`
- `E_Waste`
- `Special_Care`
- `Other`

The classifier uses a custom image-classification model created with **Google Teachable Machine** and runs through **TensorFlow.js** in the browser.

### 📊 Smart Dashboard

The dashboard presents waste-management information in an accessible format and helps users understand waste categories and their broader impact.

### 📍 Collection Centre Finder

Users can explore collection centres through an interactive map and get directions to suitable locations.

### 🗺️ Interactive Map & Pegman

SmartWaste includes an interactive map experience that helps users explore locations and navigate around collection-centre areas.

### 📚 Waste Guide & Awareness

Educational content helps users understand:

- Waste categories
- Proper segregation
- Responsible disposal
- Recycling awareness
- Environmental impact

### ❓ FAQ Section

Frequently asked questions provide quick answers to common doubts about the platform and waste management.

### ⭐ Feedback & Rating

Users can provide feedback and ratings to share their experience and help improve the platform.

---

## 🧠 AI Model

The SmartWaste classifier is based on a custom image-classification model.

### Model

- **Google Teachable Machine**
- **TensorFlow.js**
- Client-side image classification

### Model Files

```text
my-model/
├── model.json
├── weights.bin
└── metadata.json
```

### Classification Categories

```text
Organic_Wet
Recyclable_Dry
E_Waste
Special_Care
Other
```

> **Note:** The displayed confidence represents the model's prediction confidence. It should not be interpreted as a guarantee of real-world classification accuracy.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling, layout and animations |
| JavaScript | Interactivity and application logic |
| TensorFlow.js | Browser-based AI inference |
| Google Teachable Machine | Custom image classification model |
| Interactive Maps | Collection-centre discovery and navigation |
| Vercel | Deployment |

---

## 📁 Project Structure

```text
prototype/
│
├── .vscode/
│   └── launch.json
│
├── my-model/
│   ├── model.json
│   ├── weights.bin
│   └── metadata.json
│
├── index.html
├── style.css
│
├── classifier.html
├── classifier.css
├── classifier.js
│
├── dashboard.html
├── dashboard.css
│
├── centers.html
├── centers.css
└── centers.js
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Open the project

Open the project folder in **VS Code**.

### 3. Run the website

You can use a local development extension such as **Live Server** in VS Code.

Open:

```text
index.html
```

### 4. Test the AI Scanner

Navigate to the AI Scanner and upload an image of a waste item.

---

## 🔍 Testing

The prototype can be tested by checking:

- Homepage navigation
- AI waste image classification
- Waste-category output
- Dashboard functionality
- Collection-centre map
- Directions/navigation
- Waste guide
- FAQ section
- Feedback and rating functionality
- Responsive behaviour across screen sizes

---

## 🎯 Project Objectives

SmartWaste aims to:

- Encourage proper waste segregation
- Make waste identification easier
- Improve awareness about responsible disposal
- Help users discover suitable collection centres
- Use AI to simplify waste classification
- Provide waste-management information through one accessible platform

---

## 🌱 Expected Impact

SmartWaste is designed to contribute toward:

- Better waste segregation awareness
- More informed disposal decisions
- Improved recycling awareness
- Easier discovery of collection facilities
- Increased public participation in responsible waste management
- Greater environmental awareness

---

## 🔮 Future Scope

Possible future improvements include:

- Improved AI classification accuracy with larger datasets
- More detailed disposal recommendations
- Real-time collection-centre information
- Additional waste categories
- Multilingual support
- User accounts and personalised waste history
- Gamification and reward systems
- Analytics based on user feedback and usage
- Integration with municipal waste-management systems
- Mobile application support

---

## 👥 Team

### Team Void Coders

**Project:** SmartWaste — AI-Powered Waste Management

Built as a collaborative SIH prototype using web technologies and AI-based image classification.

---

## 📌 Project Status

**Status:** Working Prototype

The current version demonstrates the core SmartWaste workflow, including AI-based waste classification, waste-management information, collection-centre discovery, mapping, FAQs, and user feedback.

---

## 🌍 Vision

> **A smarter approach to waste management starts with better identification, better segregation, and better awareness.**

SmartWaste aims to make responsible waste management simpler, more accessible, and more technology-driven.

---

## 📄 License

This project is licensed under the MIT License.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of the software, subject to the terms of the MIT License.

---

**SmartWaste ♻️ — Identify. Segregate. Manage.**
