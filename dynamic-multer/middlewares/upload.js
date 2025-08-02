const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storageRealDisk = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const storageMemory = multer.memoryStorage();

const uploadDisk = multer({ storage: storageRealDisk });
const uploadMemory = multer({ storage: storageMemory });

function dynamicUpload(req, res, next) {
    const foldername = req.params.foldername;
    const rootDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir, { recursive: true });
    }
    const uploadDir = path.join(rootDir, foldername);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    req.uploadDir = uploadDir;
    next();
}
// 2) อ่าน req.uploadDir แล้วตั้ง storage ให้ multer ใช้อัปโหลด
function useUpload(req, res, next) {
    const uploadDir = req.uploadDir;
    const isArr = req.query.isArr === 'true';
    const isSingle = req.query.isSingle === 'true';
    if (!uploadDir) {
        return res.status(400).json({ message: 'Upload directory not specified' });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
        }
    });

    const upload = multer({ storage });

    if (isArr)    return upload.array('image')(req, res, next);
    if (isSingle) return upload.single('image')(req, res, next);

    // ถ้าไม่ระบุ isArr/isSingle ก็ข้ามไป
    next();
}
module.exports = { uploadDisk, uploadMemory, dynamicUpload, useUpload };
