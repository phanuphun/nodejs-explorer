const express = require('express');
const cors = require('cors');
const { uploadDisk, uploadMemory, dynamicUpload, useUpload } = require('./middlewares/upload');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

const uploadDir = path.join(__dirname, 'public', 'uploads');

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.post('/dynamic-upload/:foldername', dynamicUpload, useUpload, async (req, res) => {
    const files = req.files || (req.file ? [req.file] : []);
    res.json({
        message: 'Files uploaded successfully',
        uploadDir: req.uploadDir,
        files: files.map(f => f.filename)
    });

});

app.post('/upload', uploadDisk.single('image'), (req, res) => {
    const data = req.body;
    res.json({
        message: 'Data received successfully',
        data: data
    });
});

app.post('/upload-mem', uploadMemory.single('image'), (req, res) => {
    const data = req.body;
    const base64Image = req.file.buffer.toString('base64');
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filename = `${Date.now()}_${req.file.originalname}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, req.file.buffer);
    res.json({
        message: 'Data received successfully in memory',
        data: data,
        image: base64Image
    });
});

app.delete('/uploads/images', (req, res) => {
    deleteAllFiles(uploadDir, res);
});

async function deleteAllFiles(uploadDir, res) {
    if (!fs.existsSync(uploadDir)) {
        return res.status(404).json({ message: 'Directory not found' });
    }
    fs.readdir(uploadDir, (err, entries) => {
        if (err) return console.error(err);
        entries.forEach(name => {
            const fp = path.join(uploadDir, name);
            const stat = fs.statSync(fp);
            if (stat.isFile()) {
                fs.unlinkSync(fp);
            } else if (stat.isDirectory()) {
                fs.rmSync(fp, { recursive: true, force: true });
            }
        });
        console.log('All entries deleted successfully');
    });
}

//  ┌───────────── วินาที (Seconds)      : */30  หมายถึง ทุกๆ 30 วินาที
//  │ ┌────────── นาที (Minutes)         : *     ทุกนาที
//  │ │ ┌─────── ชั่วโมง (Hours)         : *     ทุกชั่วโมง
//  │ │ │ ┌───── วันในเดือน (Day of Month): *     ทุกวัน
//  │ │ │ │ ┌── เดือน (Month)            : *     ทุกเดือน
//  │ │ │ │ │ ┌ วันในสัปดาห์ (Day of Week): *     ทุกวันในสัปดาห์
//  │ │ │ │ │ │
//  *  *  *  *  *  *ฃ
//  └───┴───┴───┴───┴───┴───

// cron.schedule('*/30 * * * * *', () => {
//     console.log('Running cleanup task every 30 seconds');
//     if (!fs.existsSync(uploadDir)) {
//         console.log('Directory not found');
//         return;
//     }
//     fs.readdir(uploadDir, (err, files) => {
//         if (err) {
//             console.error('Error reading directory:', err);
//             return;
//         }
//         files.forEach(file => {
//             try {
//                 fs.unlinkSync(path.join(uploadDir, file));
//             } catch (e) {
//                 console.error('Error deleting file:', file, e);
//             }
//         });
//         console.log('All files deleted successfully');
//     });
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});