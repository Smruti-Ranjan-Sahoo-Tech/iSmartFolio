const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
    nanoid: {
        type: String,
        required: true,
        unique: true
    },
    project: [
        {
            p_imgUrl: {
                type: String,
                required: true
            },
            p_title: {
                type: String,
                required: true
            },
            p_description: {
                type: String,
                required: true
            },
            p_technologies: {
                type: Array,
                required: true
            },
            p_livePreview: {
                type: String,
                required: true
            },
            p_viewCoads: {
                type: String,
                required: true
            }

        }
    ]
},{timestamps: true});

module.exports = mongoose.model('Project', projectsSchema);