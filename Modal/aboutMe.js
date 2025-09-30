const mongoose = require('mongoose');

const aboutMeSchema = new mongoose.Schema({
    nanoid: {
        type: String, // storing nanoID here
        required: true
    },
    about_me: {
        type: String,
        required: true
    },

    w_experience: [
        {
            role: { type: String, required: true },
            location: { type: String, required: true },
            companyName: { type: String, required: true },
            job_type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract"], required: true },
            job_start: { type: Date, required: true },
            job_end: { type: Date } // optional (in case job is ongoing)
        }
    ],
    education: [
        {
            cource_type: { type: String, required: true },
            location: { type: String, required: true },
            cource_roll: { type: String, enum: ["Full-time", "Part-time"], required: true },
            cource_start: { type: Date, required: true },
            cource_end: { type: Date },
            cource_name: { type: String, required: true },
            percentage: { type: Number }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('AboutMe', aboutMeSchema);
