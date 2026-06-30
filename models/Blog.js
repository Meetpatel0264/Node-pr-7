const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        desc: {
            type: String,
            required: true,
            trim: true
        },
        authername: {
            type: String,
            required: true,
            trim: true
        }
    }
);

module.exports = mongoose.model("Blog", blogSchema);
