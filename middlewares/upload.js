const multer  = require('multer');
const path = require('path');
const HttpError = require("../Helpers/HttpError");

const destination = path.resolve('tmp');

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}__${file.originalname}`;
        cb(null, fileName);
    }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype !== 'image/jpeg' || file.mimetype !== 'image/png') {
        cb(HttpError(400, 'Unsupported file type'), false);
    }
    cb(null, true);
}
const upload = multer({
    storage
})

module.exports = upload;