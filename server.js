// server.js
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require('body-parser')

const authRoutes = require("./routes/auth.route");
const usersRoutes = require("./routes/users.route");
const rolesRoutes = require("./routes/roles.route");
const gatesRoutes = require("./routes/gates.route");
const terminalsRoutes = require("./routes/terminals.route");
const beltsRoutes = require("./routes/belts.route");
const countersRoutes = require("./routes/counters.route");
const directionsRoutes = require("./routes/directions.route");
const flightCategoriesRoutes = require("./routes/flight_categories.route");
const flightStatusRoutes = require("./routes/flight_status.route");
const uploadsRoutes = require("./routes/uploads.route");
const airlinesRoutes = require("./routes/airlines.route");
const airportsRoutes = require("./routes/airports.route");
const aircraftTypesRoutes = require("./routes/aircraft_types.route");
const seasonFlightsRoutes = require("./routes/season_flights.route");
const dailyFlightsRoutes = require("./routes/daily_flights.route");
const filtersRoutes = require("./routes/filters.route");




// Load environment variables
dotenv.config();

const allowlist = (process.env.URL_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // allow requests with no origin (Postman, curl)
    if (!origin) return cb(null, true);

    if (allowlist.includes(origin)) return cb(null, true);

    const error = new Error(`CORS blocked for origin: ${origin}`);
    error.status = 403;
    return cb(error);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));

app.options("*", cors(corsOptions)); // รองรับ preflight
// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(bodyParser.json());
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const routePath = "/api/v1";
// Routes
app.use(routePath + "/auth", authRoutes);
app.use(routePath + "/users", usersRoutes);
app.use(routePath + "/roles", rolesRoutes);
app.use(routePath + "/gates", gatesRoutes);
app.use(routePath + "/terminals", terminalsRoutes);
app.use(routePath + "/belts", beltsRoutes);
app.use(routePath + "/counters", countersRoutes);
app.use(routePath + "/directions", directionsRoutes);
app.use(routePath + "/flight-categories", flightCategoriesRoutes);
app.use(routePath + "/flight-status", flightStatusRoutes);
app.use(routePath + "/uploads", uploadsRoutes);
app.use(routePath + "/airlines", airlinesRoutes);
app.use(routePath + "/airports", airportsRoutes);
app.use(routePath + "/aircraft-types", aircraftTypesRoutes);
app.use(routePath + "/season-flights", seasonFlightsRoutes);
app.use(routePath + "/daily-flights", dailyFlightsRoutes);
app.use(routePath + "/filters", filtersRoutes);

// Root route
app.get(routePath + "/", (req, res) => {
  res.send("Welcome to the AIODB API!");
});

app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith("CORS blocked")) {
    return res.status(err.status || 403).json({ message: err.message });
  }

  return next(err);
});

// Start the server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
