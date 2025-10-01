const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./auth/authRoutes')
const heroRoute = require('./Routes/heroRooutes')
const projectRoute = require('./Routes/projectRoutes')
const techStackRoute = require('./Routes/techStackRoutes')
const aboutMeRoute = require('./Routes/aboutMeRoutes')
const contactRoute = require('./Routes/contactRoutes')
const themeRoute = require('./Routes/themeRoutes')
const clientRoute = require('./clientAPI/clientRoute')
const cookieParser = require('cookie-parser')
const { isLoggedIn } = require('./middlewere/authMiddleware')

const app = express()

// ✅ CORS setup (update with your frontend’s deployed URL later)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://isfolio-resume.netlify.app",
  "https://ismartfolio.netlify.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ API Routes
app.use('/api/auth', authRoutes)
app.use('/api/hero', isLoggedIn, heroRoute)
app.use('/api/tech', isLoggedIn, techStackRoute)
app.use('/api/project', isLoggedIn, projectRoute)
app.use('/api/about', isLoggedIn, aboutMeRoute)
app.use('/api/contact', isLoggedIn, contactRoute)
app.use('/api/theme', isLoggedIn, themeRoute)
app.use('/api/client', clientRoute)


app.get('/', (req, res) => {
    res.send({ status: "success", message: "now connected to server..." })
})

// ✅ Server + DB connection
let PORT = process.env.PORT || 3000
let URL = process.env.URL

mongoose.connect(URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err.message)
    })
