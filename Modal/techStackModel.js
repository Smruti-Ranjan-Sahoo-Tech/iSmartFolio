const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
    nanoid: {
        type: String,
        required: true,
        unique: true
    },
    tStack: [
        {
            imgUrl: {
                type: String,
                required: true
            },
            stackName: {
                type: String,
                required: true,
                trim: true
            }
        }
    ]
}, { timestamps: true }); // adds createdAt & updatedAt automatically

module.exports = mongoose.model('TechStack', techStackSchema);




