import * as usb from 'usb';

usb.usb.on('attach', dev => {
  const { idVendor, idProduct } = dev.deviceDescriptor;
  console.log(`[attach] VID=0x${idVendor.toString(16)} PID=0x${idProduct.toString(16)}`);
});

usb.usb.on('detach', dev => {
  const { idVendor, idProduct } = dev.deviceDescriptor;
  console.log(`[detach] VID=0x${idVendor.toString(16)} PID=0x${idProduct.toString(16)}`);
});
