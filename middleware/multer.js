const multer = require("multer");
const fs = require("fs");

const uploadDir = "uploads/blogs";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }

    cb(new Error("Only image file allowed"));
};

module.exports = multer({ storage, fileFilter });
