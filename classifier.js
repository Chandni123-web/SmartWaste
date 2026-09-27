// ==========================================
// SMART WASTE - AI WASTE SCANNER
// ==========================================

const wasteImage = document.getElementById("wasteImage");
const preview = document.getElementById("preview");
const resultImage = document.getElementById("resultImage");
const scanStatus = document.getElementById("scanStatus");
const resultCard = document.getElementById("resultCard");

const detectedWaste =
    document.querySelector(".result-details h3");

const confidenceValue =
    document.querySelector(".confidence-text strong");

const progressBar =
    document.querySelector(".progress div");

const recommendedCategory =
    document.querySelector(".category div strong");

const disposalTip =
    document.querySelector(".disposal-tip p");

const categoryIcon =
    document.querySelector(".category-icon");

const findCentersBtn =
    document.getElementById("findCentersBtn");

let model = null;


// ==========================================
// UPDATE SCANNER STATUS
// ==========================================

function updateStatus(message) {

    const statusText =
        scanStatus.querySelector("span:nth-child(2)");

    if (statusText) {
        statusText.textContent = message;
    }
}


// ==========================================
// LOAD AI MODEL
// ==========================================

async function loadAIModel() {

    try {

        updateStatus("Loading AI Vision Model...");

        console.log("Loading Teachable Machine model...");

        const MODEL_URL = "./my-model/model.json";
        const METADATA_URL = "./my-model/metadata.json";

model = await tmImage.load(
    MODEL_URL,
    METADATA_URL
);

console.log("Custom waste model loaded successfully.");

updateStatus(
    "AI Waste Model Ready"
);
} catch (error) {

    console.error(
        "MODEL LOAD ERROR:",
        error
    );

    updateStatus(
        "AI model failed to load"
    );
}
}


// ==========================================
// CONVERT AI RESULT INTO WASTE CATEGORY
// ==========================================

function getWasteCategory(label) {

    const name = label
        .toLowerCase()
        .replace(/[_-]/g, " ")
        .trim();


    // ORGANIC / WET WASTE
    if (
        name.includes("organic") ||
        name.includes("wet")
    ) {

        return {
            category: "Organic / Wet Waste",
            icon: "🍎",
            advice:
                "Place this biodegradable waste in the appropriate wet or organic waste stream."
        };
    }


    // RECYCLABLE / DRY WASTE
    if (
        name.includes("recyclable") ||
        name.includes("dry")
    ) {

        return {
            category: "Recyclable / Dry Waste",
            icon: "♻️",
            advice:
                "Keep this item clean and dry and place it in the appropriate recyclable or dry waste stream."
        };
    }


    // E-WASTE
    if (
        name.includes("e waste") ||
        name.includes("ewaste") ||
        name.includes("electronic")
    ) {

        return {
            category: "E-Waste",
            icon: "📱",
            advice:
                "Keep electronic waste separate from ordinary waste and use an appropriate authorized e-waste collection option."
        };
    }


    // SPECIAL CARE
    if (
        name.includes("special care")
    ) {

        return {
            category: "Special Care",
            icon: "⚠️",
            advice:
                "Keep this waste separate from ordinary waste and follow appropriate authorized disposal guidance."
        };
    }


    // OTHER
    if (
        name.includes("other")
    ) {

        return {
            category: "Other / Needs Manual Sorting",
            icon: "🔎",
            advice:
                "This item does not clearly belong to the main waste categories. Please verify it and follow local waste-sorting guidance."
        };
    }


    // FALLBACK
    return {
        category: "Needs Manual Sorting",
        icon: "🔎",
        advice:
            "The AI could not confidently map this object to a waste category. Please verify the item and follow local waste-sorting guidance."
    };
}


// ==========================================
// CONFIDENCE LEVEL
// ==========================================

function getConfidenceLevel(confidence) {

    const percent = confidence * 100;


    if (percent >= 85) {

        return {
            text: "High Confidence",
            icon: "✅"
        };
    }


    if (percent >= 60) {

        return {
            text: "Moderate Confidence",
            icon: "⚠️"
        };
    }


    return {

        text: "Low Confidence",

        icon: "🔎"
    };
}


// ==========================================
// ANALYZE IMAGE
// ==========================================

async function analyzeImage(image) {

    try {

        updateStatus(
            "AI is analyzing your waste..."
        );

        console.log(
            "Starting classification..."
        );

        // Make sure the AI model is ready
        if (!model) {
            throw new Error(
                "AI model is not loaded."
            );
        }

        // Run Teachable Machine prediction
        const predictions =
            await model.predict(image);

        console.log(
            "AI Predictions:",
            predictions
        );

        if (
            !predictions ||
            predictions.length === 0
        ) {
            throw new Error(
                "No predictions returned by AI model."
            );
        }

        // Find the prediction with highest confidence
        let maxIndex = 0;

        for (
            let i = 1;
            i < predictions.length;
            i++
        ) {

            if (
                predictions[i].probability >
                predictions[maxIndex].probability
            ) {

                maxIndex = i;
            }
        }

        const predictedClass =
            predictions[maxIndex].className;

        const confidence =
            predictions[maxIndex].probability;

        const percentage =
            Math.round(
                confidence * 100
            );

        console.log(
            "Predicted class:",
            predictedClass
        );

        console.log(
            "Confidence:",
            percentage + "%"
        );

        // Convert AI class into waste category
        const wasteInfo =
            getWasteCategory(
                predictedClass
            );

        const confidenceInfo =
            getConfidenceLevel(
                confidence
            );

        // Update result card
        detectedWaste.textContent =
            predictedClass;

        confidenceValue.textContent =
            percentage + "%";

        progressBar.style.width =
            percentage + "%";

        recommendedCategory.textContent =
            wasteInfo.category;

        categoryIcon.textContent =
            wasteInfo.icon;

        disposalTip.textContent =
            wasteInfo.advice;

        updateStatus(
            confidenceInfo.icon +
            " " +
            confidenceInfo.text +
            " • Analysis complete"
        );

        // Connect to collection centres
        if (findCentersBtn) {

            findCentersBtn.onclick =
                function () {

                    const category =
                        encodeURIComponent(
                            wasteInfo.category
                        );

                    window.location.href =
                        "centers.html?waste=" +
                        category;
                };
        }

    } catch (error) {

        console.error(
            "CLASSIFICATION ERROR:",
            error
        );

        updateStatus(
            "AI analysis failed — check browser console"
        );
    }
}


// ==========================================
// IMAGE UPLOAD
// ==========================================

wasteImage.addEventListener(
    "change",
    async function () {

        const file =
            this.files[0];


        if (!file) {
            return;
        }


        // Check image type

        if (
            !file.type.startsWith("image/")
        ) {

            updateStatus(
                "Please select an image."
            );

            return;
        }


        // Check image size

        if (
            file.size >
            10 * 1024 * 1024
        ) {

            updateStatus(
                "Image must be below 10 MB."
            );

            return;
        }


        const imageURL =
            URL.createObjectURL(
                file
            );


        // ==================================
        // SHOW IMAGE PREVIEW
        // ==================================

        preview.innerHTML = `
            <img
                src="${imageURL}"
                alt="Uploaded waste"
            >
        `;


        resultImage.innerHTML = `
            <img
                src="${imageURL}"
                alt="Waste preview"
            >
        `;


        resultCard.style.display =
            "block";


        updateStatus(
            "Preparing image for AI..."
        );


        try {

            // ==================================
            // LOAD MODEL IF NOT LOADED
            // ==================================

            if (!model) {

                updateStatus(
                    "Loading AI model..."
                );


                const MODEL_URL = "./my-model/model.json";
const METADATA_URL = "./my-model/metadata.json";

model = await tmImage.load(MODEL_URL, METADATA_URL);
            }


            // ==================================
            // CREATE IMAGE FOR AI
            // ==================================

            const image =
                new Image();


            image.src =
                imageURL;


            await new Promise(
                (resolve, reject) => {

                    image.onload =
                        resolve;

                    image.onerror =
                        reject;
                }
            );


            console.log(
                "Image loaded:",
                image.width,
                "x",
                image.height
            );


            // ==================================
            // RUN AI
            // ==================================

            await analyzeImage(
                image
            );

        }

        catch (error) {

            console.error(
                "SCANNER ERROR:",
                error
            );


            updateStatus(
                "Could not analyze this image"
            );
        }
    }
);


// ==========================================
// START AI
// ==========================================

loadAIModel();