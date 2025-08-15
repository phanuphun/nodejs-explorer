import usb from 'usb';

const dev = usb.findByIds(0xFFFF, 0x0035);
if (!dev) {
    console.log('Device not found');
    process.exit(1);
}
dev.open();

const cfg = dev.configDescriptor || dev.allConfigDescriptors?.[0];
for (const ifarr of cfg.interfaces) {
    for (const alt of ifarr) {
        console.log(`Interface ${alt.bInterfaceNumber}: Class=0x${alt.bInterfaceClass.toString(16)}`);
    }
}
dev.close();
