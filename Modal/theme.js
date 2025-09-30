const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    nanoid: {
        type: String,
        required: true,
        unique: true
    },
    theme:{
        type:String,
        require:true,

    }
}, { timestamps: true }); // adds createdAt & updatedAt automatically

module.exports = mongoose.model('theme', themeSchema);



