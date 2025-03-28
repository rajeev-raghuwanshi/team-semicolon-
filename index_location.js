const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// 🏠 Serve the home page
app.get("/", (req, res) => {
    res.render("location_page.ejs");
});

// 📍 Fetch user’s location address
app.get("/get-address", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.json({ error: "Invalid location" });
    }

    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const address = response.data.display_name;
        res.json({ address });
    } catch (error) {
        console.error(error);
        res.json({ error: "Failed to fetch address" });
    }
});

// 🏥 Fetch community centers near user (40 km range)
app.get("/get-community-centers", async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.json({ error: "Invalid location" });
    }

    try {
        const overpassQuery = `
            [out:json];
            (
                node["amenity"="social_facility"](around:40000, ${lat}, ${lng});
                node["leisure"="fitness_centre"](around:40000, ${lat}, ${lng});
                node["leisure"="yoga"](around:40000, ${lat}, ${lng});
                node["healthcare"="therapy"](around:40000, ${lat}, ${lng});
            );
            out body;
        `;

        const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        const centers = response.data.elements.map((place) => ({
            name: place.tags.name || "Unnamed Center",
            lat: place.lat,
            lon: place.lon,
            type: place.tags.amenity || place.tags.leisure || place.tags.healthcare || "Community Center",
        }));

        res.json({ centers });
    } catch (error) {
        console.error(error);
        res.json({ error: "Failed to fetch community centers" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
