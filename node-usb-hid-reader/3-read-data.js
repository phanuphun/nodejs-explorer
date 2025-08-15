import usb from 'usb';

const VID = 0xFFFF, PID = 0x0035;
const IFACE = 0;         // <- ใช้ Interface 0 แทน
const IN_ADDR = 0x81;    // Interrupt IN ของคีย์บอร์ด

const dev = usb.findByIds(VID, PID);
if (!dev) throw new Error('Device not found');
dev.open();

const iface = dev.interface(IFACE);
iface.claim();

const inEp = iface.endpoints.find(e => e.address === IN_ADDR);
if (!inEp) throw new Error('IN endpoint 0x81 not found');

const keyMap = {
    // แถวตัวเลข
    0x1E: '1', 0x1F: '2', 0x20: '3', 0x21: '4', 0x22: '5',
    0x23: '6', 0x24: '7', 0x25: '8', 0x26: '9', 0x27: '0',
    // แถวตัวอักษร a..z
    ...Object.fromEntries([...Array(26)].map((_, i) => [0x04 + i, String.fromCharCode(97 + i)])),
    // ปุ่มควบคุม
    0x28: '\n', // Enter
    0x2C: ' ',  // Space
    0x2A: '\b', // Backspace
    0x2B: '\t', // Tab
    // Numpad
    0x59: '1', 0x5A: '2', 0x5B: '3', 0x5C: '4', 0x5D: '5',
    0x5E: '6', 0x5F: '7', 0x60: '8', 0x61: '9', 0x62: '0',
    0x58: '\n'  // Numpad Enter
};

let bufferString = '';

inEp.on('data', buf => {
    // console.log(buf);
    const keys = [...buf.slice(2)]; // ตำแหน่ง k1..k6
    for (const k of keys) {
        if (!k) continue; // 0 หมายถึงไม่มีปุ่มกด
        const char = keyMap[k];
        if (!char) continue; // keycode ไม่อยู่ในแมป ข้าม

        if (char === '\n') {
            // จบการอ่านรหัสการ์ด
            if (bufferString.length > 0) {
                console.log('Card Code:', bufferString);
                bufferString = ''; // รีเซ็ตเพื่ออ่านรหัสใหม่
            }
        } else if (char === '\b') {
            bufferString = bufferString.slice(0, -1);
        } else {
            bufferString += char;
        }
    }
});
inEp.on('error', console.error);
inEp.startPoll(); // interrupt IN
