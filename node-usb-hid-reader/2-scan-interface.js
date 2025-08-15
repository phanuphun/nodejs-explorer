import usb from 'usb';

const VID = 0xFFFF;
const PID = 0x0035;

const dev = usb.findByIds(VID, PID);
if (!dev) {
    console.error('Device not found');
    process.exit(1);
}
dev.open();

// ตรวจสอบว่าอุปกรณ์เชื่อมต่ออยู่หรือไม่
const cfg = dev.configDescriptor || dev.allConfigDescriptors?.[0];
console.log('Configurations:', dev.allConfigDescriptors?.length ?? 1);
console.log('Using config:', cfg?.bConfigurationValue);

for (const ifarr of (cfg?.interfaces || [])) {
    for (const alt of ifarr) {
        const d = alt;
        const eps = d.endpoints || [];
        console.log(`Interface ${d.bInterfaceNumber} (alt ${d.bAlternateSetting}) class=0x${d.bInterfaceClass.toString(16)} numEP=${eps.length}`);
        for (const ep of eps) {

            // ตรวจสอบว่า bEndpointAddress เป็น IN หรือ OUT
            // 0x80 = In , 0x00 = Out
            const isIn = (ep.bEndpointAddress & 0x80) !== 0;      // <-- ใช้ 0x80 โดยตรง
            const dir = isIn ? 'IN' : 'OUT';

            // Mode
            // interrupt : ส่งข้อมูลขนาดเล็กเป็นรอบๆ (polling) เพื่อตอบสนองเร็ว เช่น คีย์บอร์ด/เมาส์
            // control   : ส่งคำสั่งหรืออ่านค่าการตั้งค่า (EP0) เช่น ขอ descriptor, สั่งงานอุปกรณ์
            // iso       : ส่งข้อมูลแบบตามเวลาจริง (real-time) ยอมเสียบางเฟรมได้ เช่น เสียง/วิดีโอ
            // bulk      : ส่งข้อมูลก้อนใหญ่ เน้นความถูกต้องครบถ้วน เช่น โอนไฟล์, เฟิร์มแวร์
            const type = ['Control', 'Iso', 'Bulk', 'Interrupt'][ep.bmAttributes & 0x03];
            const addr = '0x' + ep.bEndpointAddress.toString(16);
            const maxPk = ep.wMaxPacketSize;
            console.log(`  EP ${addr}  ${dir}  ${type}  maxPkt=${maxPk}`);
        }
    }
}
dev.close();