### Related Tools

- **Zadig**: A free tool to change or install USB drivers (for example, to switch a device to WinUSB or libusb). Useful if your device is not detected or you need to change its driver. Download: https://zadig.akeo.ie/
- **USBTreeView**: A tool to see all USB devices and their details on your computer. Helps you check device info, VID, PID, and interface class. Download: https://www.uwe-sieber.de/usbtreeview_e.html

### About Endpoint Types

USB devices use different types of connections, called endpoints. Here are the main types:

- **Interrupt**: Sends small data quickly, often used for keyboards or mice.
- **Control**: Used to send commands or settings, like asking for device info.
- **Isochronous (Iso)**: Sends real-time data, like audio or video. Some data might be lost, but it's fast.
- **Bulk**: Sends large amounts of data, like files. It makes sure all data is correct.

Each endpoint can be IN (data goes to the computer) or OUT (data goes to the device).

## USB RFID Reader (Node.js)

This project shows how to read RFID data from a USB device (like a card reader) using Node.js. It uses the `usb` and `node-hid` libraries. You can use this code with any USB device that works like a keyboard or HID.

### How to Install

```bash
npm install usb
```

### File Overview

- `0-list-all-device.js` — Show all USB devices
- `1-detect-usb.js` — Show when a USB device is plugged in or taken out, and show device ID
- `1.5-check-interface-class.js` — Check and show the class type of each USB interface (for example, HID, storage, etc.)
- `2-scan-interface.js` — Show details about device connections (like IN/OUT, type)
- `3-read-data.js` — Read RFID data and change it to numbers or letters

### How to Use

1. Make sure your device is set up as WinUSB or HID (depends on your device)
2. Install the needed packages with the command above
3. Run the script you want, for example:
   - Show devices:
     ```bash
     node 0-list-all-device.js
     ```
   - Read RFID:
     ```bash
     node 3-read-data.js
     ```

### Example Output (RFID)

```
Card Code: 1234567890
Card Code: 9876543210
```

Or if you want to see the raw buffer:

```
<Buffer 00 00 27 00 00 00 00 00>
<Buffer 00 00 00 00 00 00 00 00>
...
```

# USB Interface Class Codes

This table lists **bInterfaceClass** values from the USB specification, which define the major category of a USB interface.

| Class Code | Class Name                     | Description                                                           | Example Devices                 |
| ---------- | ------------------------------ | --------------------------------------------------------------------- | ------------------------------- |
| `0x00`     | Defined at Interface level     | Class is defined in the Interface Descriptor, not at the device level | Multi-function devices          |
| `0x01`     | Audio                          | Audio devices                                                         | USB speakers, microphones       |
| `0x02`     | Communications and CDC Control | Communication devices, modems, virtual COM ports                      | CDC-ACM, USB modems             |
| `0x03`     | Human Interface Device (HID)   | Human input devices                                                   | Keyboard, mouse, gamepad        |
| `0x05`     | Physical                       | Physical descriptors                                                  | Joystick (rare)                 |
| `0x06`     | Image                          | Imaging devices                                                       | Webcam, scanner                 |
| `0x07`     | Printer                        | Printing devices                                                      | USB printers                    |
| `0x08`     | Mass Storage                   | Storage devices                                                       | Flash drives, external HDDs     |
| `0x09`     | Hub                            | USB hubs                                                              | Root hubs, external hubs        |
| `0x0A`     | CDC Data                       | Data interface for CDC class                                          | Bulk IN/OUT for serial data     |
| `0x0B`     | Smart Card                     | Smart card readers                                                    | Smart card terminal             |
| `0x0D`     | Content Security               | Content protection devices                                            | Secure dongles                  |
| `0x0E`     | Video                          | Video devices                                                         | USB cameras, HDMI capture cards |
| `0x0F`     | Personal Healthcare            | Health-related devices                                                | Glucose meters                  |
| `0x10`     | Audio/Video Devices            | AV devices                                                            | Webcam + microphone combo       |
| `0xDC`     | Diagnostic Device              | Diagnostic and test devices                                           | Debug tools                     |
| `0xE0`     | Wireless Controller            | Wireless communication controllers                                    | Bluetooth adapters              |
| `0xEF`     | Miscellaneous                  | Miscellaneous (IAD, composite)                                        | Composite devices               |
| `0xFE`     | Application Specific           | Application-specific devices                                          | DFU, MIDI                       |
| `0xFF`     | Vendor Specific                | Vendor-defined protocols                                              | Custom USB devices              |

---

## CDC SubClass Codes (When `bInterfaceClass = 0x02`)

The following **bInterfaceSubClass** values are defined for the Communications and CDC Control Class.

| SubClass Code | Description                       | Example                             |
| ------------- | --------------------------------- | ----------------------------------- |
| `0x01`        | Direct Line Control Model         | ISDN, telephone modems              |
| `0x02`        | Abstract Control Model (ACM)      | Virtual COM Port / RS-232           |
| `0x03`        | Telephone Control Model           | Digital telephony                   |
| `0x04`        | Multi-Channel Control Model       | Multi-channel communication devices |
| `0x05`        | CAPI Control Model                | ISDN CAPI devices                   |
| `0x06`        | Ethernet Networking Control Model | USB Ethernet dongles                |
| `0x07`        | ATM Networking Control Model      | ATM devices                         |
| `0x08`        | Wireless Handset Control Model    | Wireless handsets                   |
| `0x09`        | Device Management                 | Device management interfaces        |
| `0x0A`        | Mobile Direct Line Model          | Mobile devices                      |
| `0x0B`        | OBEX                              | Bluetooth/IrDA OBEX over USB        |
| `0x0C`        | Ethernet Emulation Model (EEM)    | USB Ethernet (EEM)                  |
| `0x0D`        | Network Control Model (NCM)       | USB networking devices              |

---

### Notes

- The **first table** applies to any USB interface (major category).
- The **second table** only applies when the class is `0x02` (Communications and CDC Control).
- For **CDC-ACM Virtual COM Ports**, you will typically see:
