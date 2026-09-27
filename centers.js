// ==========================================
// SMART WASTE - SMART COLLECTION CENTERS
// Google Places API (New)
// ==========================================

let centersMap = null;
let userMarker = null;
let centerMarkers = [];
let AdvancedMarkerElement = null;
async function createMap(latitude, longitude) {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } =
        await google.maps.importLibrary("marker");

    centersMap = new Map(
        document.getElementById("centersMap"),
        {
            center: {
                lat: latitude,
                lng: longitude
            },
            zoom: 13,
            mapId: "DEMO_MAP_ID"
        }
    );

    // Save marker class for later
    window.AdvancedMarkerElement = AdvancedMarkerElement;

    // User's location marker
    const userPin = new google.maps.marker.PinElement({
    background: "#1976D2",
    borderColor: "#0D47A1",
    glyphColor: "white",
    glyphText: "●"
});

userMarker = new AdvancedMarkerElement({
    map: centersMap,
    position: {
        lat: latitude,
        lng: longitude
    },
    title: "Your current location",
    content: userPin.element
});
}
const locationBtn = document.getElementById("locationBtn");
const locationMessage = document.getElementById("locationMessage");
const centerList = document.getElementById("centerList");
const resultCount = document.getElementById("resultCount");

const params = new URLSearchParams(window.location.search);
const wasteType = params.get("waste") || "Recyclable / Dry Waste";

document.getElementById("wasteType").textContent = wasteType;


// ==========================================
// DISTANCE CALCULATION
// ==========================================

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}


// ==========================================
// WASTE-SPECIFIC SEARCHES
// ==========================================

function getSearchQueries() {

    const type = wasteType.toLowerCase();

    if (type.includes("e-waste")) {
        return [
            "e-waste recycling center",
            "electronic waste recycling center",
            "electronics recycling"
        ];
    }

    if (type.includes("organic") || type.includes("wet")) {
        return [
            "organic waste collection center",
            "composting center",
            "organic waste recycling"
        ];
    }

    if (type.includes("special")) {
        return [
            "hazardous waste collection center",
            "special waste collection center",
            "battery recycling center"
        ];
    }

    return [
        "recycling center",
        "plastic recycling center",
        "dry waste collection center",
        "waste collection center"
    ];
}


// ==========================================
// WORDS WE DON'T WANT TO DISPLAY
// ==========================================

const excludedWords = [
    "landfill",
    "sanitary landfill",
    "dumping ground",
    "dump yard",
    "dumpyard",
    "garbage dump",
    "waste dump"
];


// ==========================================
// CHECK WHETHER A PLACE IS RELEVANT
// ==========================================

function isRelevantPlace(place) {

    const name =
        (place.displayName || "").toLowerCase();

    const address =
        (place.formattedAddress || "").toLowerCase();

    const combined = name + " " + address;

    // Never show obvious landfill/dump results
    if (
        excludedWords.some(word =>
            combined.includes(word)
        )
    ) {
        return false;
    }

    const type = wasteType.toLowerCase();

    // E-WASTE
    if (type.includes("e-waste")) {
        return (
            combined.includes("e-waste") ||
            combined.includes("electronic") ||
            combined.includes("electronics") ||
            combined.includes("recycling") ||
            combined.includes("recycle") ||
            combined.includes("computer")
        );
    }

    // ORGANIC / WET
    if (
        type.includes("organic") ||
        type.includes("wet")
    ) {
        return (
            combined.includes("organic") ||
            combined.includes("compost") ||
            combined.includes("waste") ||
            combined.includes("recycling")
        );
    }

    // SPECIAL CARE
    if (type.includes("special")) {
        return (
            combined.includes("waste") ||
            combined.includes("recycling") ||
            combined.includes("battery") ||
            combined.includes("hazardous")
        );
    }

    // RECYCLABLE / DRY
    return (
        combined.includes("recycling") ||
        combined.includes("recycle") ||
        combined.includes("waste") ||
        combined.includes("collection") ||
        combined.includes("plastic") ||
        combined.includes("paper")
    );
}


// ==========================================
// SEARCH GOOGLE PLACES
// ==========================================

async function searchRealCenters(
    userLatitude,
    userLongitude
) {

    try {

        locationMessage.textContent =
            "Searching suitable collection centers near you...";

        const { Place } =
            await google.maps.importLibrary("places");

        const queries = getSearchQueries();

        let allPlaces = [];

        for (const query of queries) {

            console.log("Searching:", query);

            const request = {

                textQuery: query,

                fields: [
                    "id",
                    "displayName",
                    "location",
                    "formattedAddress",
                    "googleMapsURI",
                    "businessStatus",
                    "types"
                ],

                locationBias: {
                    center: {
                        lat: userLatitude,
                        lng: userLongitude
                    },
                    radius: 15000
                },

                maxResultCount: 10,

                language: "en",

                region: "IN"
            };

            const response =
                await Place.searchByText(request);

            if (
                response &&
                response.places &&
                response.places.length > 0
            ) {

                allPlaces =
                    allPlaces.concat(response.places);
            }
        }


        // ==========================================
        // REMOVE DUPLICATES
        // ==========================================

        const uniquePlaces = [];
        const seen = new Set();

        allPlaces.forEach(place => {

            if (!place.location) return;

            const id =
                place.id ||
                place.displayName;

            if (!seen.has(id)) {

                seen.add(id);

                uniquePlaces.push(place);
            }
        });


        // ==========================================
        // CALCULATE DISTANCE
        // ==========================================

        const centers =
            uniquePlaces
                .map(place => {

                    const latitude =
                        typeof place.location.lat === "function"
                            ? place.location.lat()
                            : place.location.lat;

                    const longitude =
                        typeof place.location.lng === "function"
                            ? place.location.lng()
                            : place.location.lng;

                    const distance =
                        calculateDistance(
                            userLatitude,
                            userLongitude,
                            latitude,
                            longitude
                        );

                    return {
                        place,
                        distance
                    };
                })

                // Only show relevant places
                .filter(center =>
                    isRelevantPlace(center.place)
                )

                // Only within 15 km
                .filter(center =>
                    center.distance <= 15
                );


        // ==========================================
        // SORT BY DISTANCE
        // ==========================================

        centers.sort(
            (a, b) =>
                a.distance - b.distance
        );


        console.log(
            "Suitable centers:",
            centers
        );

        showRealCenters(centers);


    } catch (error) {

        console.error(
            "GOOGLE PLACES ERROR:",
            error
        );

        resultCount.textContent =
            "0 found";

        centerList.innerHTML = `
            <div class="empty-state">
                <div>⚠️</div>

                <h3>
                    Could not find nearby places
                </h3>

                <p>
                    Please check your Google Maps
                    API and Places settings.
                </p>
            </div>
        `;

        locationMessage.textContent =
            "Unable to search nearby places. Please try again.";
    }
}


// ==========================================
// ESCAPE HTML
// Prevents unsafe text from being inserted
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// DISPLAY RESULTS
// ==========================================

function showRealCenters(centers) {
    centerMarkers.forEach(marker => {
        marker.map = null;
    });

    centerMarkers = [];

    centerList.innerHTML = "";

    if (centers.length === 0) {

        resultCount.textContent =
            "0 found";

        centerList.innerHTML = `
            <div class="empty-state">

                <div>🔎</div>

                <h3>
                    No suitable centers found
                </h3>

                <p>
                    We couldn't find a suitable
                    collection option within 15 km.
                    Try again from another location.
                </p>

            </div>
        `;

        locationMessage.textContent =
            "No suitable collection centers were found nearby.";

        return;
    }


    // Show maximum 10
    const displayCenters =
        centers.slice(0, 10);

    resultCount.textContent =
        displayCenters.length + " found";


    displayCenters.forEach(
        centerData => {

            const place =
                centerData.place;

            const distance =
                centerData.distance;
                const latitude =
                typeof place.location.lat === "function"
                    ? place.location.lat()
                    : place.location.lat;

            const longitude =
                typeof place.location.lng === "function"
                    ? place.location.lng()
                    : place.location.lng;

            const centerPin = new google.maps.marker.PinElement({
    background: "#16A36F",
    borderColor: "#087F5B",
    glyphColor: "white",
    glyphText: "♻"
});

const marker =
    new window.AdvancedMarkerElement({
        map: centersMap,
        position: {
            lat: latitude,
            lng: longitude
        },
        title:
            place.displayName || "Collection Center",
        gmpClickable: true,
        content: centerPin.element
    });

marker.addEventListener("gmp-click", () => {

    const infoWindow =
        new google.maps.InfoWindow({
            content: `
                <div style="padding:8px; max-width:220px;">
                    <strong>${escapeHTML(
                        place.displayName || "Collection Center"
                    )}</strong>
                    <br>
                    <span>${escapeHTML(
                        place.formattedAddress || "Address unavailable"
                    )}</span>
                    <br><br>
                    📍 ${distance.toFixed(1)} km away
                </div>
            `
        });

    infoWindow.open({
        map: centersMap,
        anchor: marker
    });

});
            centerMarkers.push(marker);


            const name =
                place.displayName ||
                "Collection Center";

            const address =
                place.formattedAddress ||
                "Address unavailable";


            const mapsURL =
                place.googleMapsURI ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;


            const card =
                document.createElement("div");

            card.className =
                "center-card";


            card.innerHTML = `

                <div class="center-icon">
                    ♻️
                </div>

                <div class="center-info">

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    <p>
                        ${escapeHTML(address)}
                    </p>

                    <div class="distance">
                        📍 ${distance.toFixed(1)} km away
                    </div>

                </div>

                <a
                    href="${mapsURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="directions-btn"
                >
                    Directions →
                </a>

            `;

            centerList.appendChild(card);
        }
    );


    locationMessage.textContent =
        "Suitable real places found near your current location.";
}


// ==========================================
// GET USER LOCATION
// ==========================================

function getCurrentLocation() {

    if (!navigator.geolocation) {

        locationMessage.textContent =
            "Location services are not supported by this browser.";

        return;
    }


    locationBtn.disabled = true;

    locationBtn.textContent =
        "Finding location...";

    locationMessage.textContent =
        "Please allow location access when your browser asks.";


    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "User latitude:",
                latitude
            );

            console.log(
                "User longitude:",
                longitude
            );


            locationMessage.textContent =
                "Location found. Searching nearby places...";

            locationBtn.textContent =
                "Location Enabled";
            await createMap(latitude, longitude);


            await searchRealCenters(
                latitude,
                longitude
            );


            locationBtn.disabled =
                false;
        },


        function(error) {

            console.error(
                "Location error:",
                error
            );


            locationBtn.disabled =
                false;

            locationBtn.textContent =
                "Allow Location";


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                locationMessage.textContent =
                    "Location permission was denied. Please allow location access in your browser settings.";

            } else if (
                error.code ===
                error.POSITION_UNAVAILABLE
            ) {

                locationMessage.textContent =
                    "Your location could not be determined. Please try again.";

            } else if (
                error.code ===
                error.TIMEOUT
            ) {

                locationMessage.textContent =
                    "Location request timed out. Please try again.";

            } else {

                locationMessage.textContent =
                    "We could not get your location. Please try again.";
            }
        },


        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}


// ==========================================
// BUTTON
// ==========================================

locationBtn.addEventListener(
    "click",
    getCurrentLocation
);