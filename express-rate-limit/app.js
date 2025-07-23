const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // จำกัด 100 requests ต่อ IP ต่อ windowMs
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  },
  skipSuccessfulRequests: true, // ไม่นับ request ที่สำเร็จ
  skipFailedRequests: false, // ไม่นับ request ที่ล้มเหลว
  standardHeaders: true, // ส่ง X-RateLimit-* headers
  legacyHeaders: false,  // ปิดการส่ง X-RateLimit-Limit header แบบเก่า
  redis: { // ใช้ Redis เป็น store
    host: 'redis', 
    port: 6379,
    keyPrefix: 'rate-limit:'
  }
});

app.get('/api/v1/resource', limiter ,(req, res) => {
  console.log(`${req.ip} accessed /api/v1/resource`);
  res.json({ message: 'This is a rate-limited resource.' });
});

app.get('/api/v2/resource', (req, res) => {
  res.json({ message: 'yoyoo.' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
