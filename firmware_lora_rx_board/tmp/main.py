import time
# import usb_cdc
import lora as _lora

import supervisor
supervisor.runtime.autoreload = False

# if usb_cdc.data is None:
#     print("Need to enable USB CDC serial data in boot.py!")
#     while True:
#         pass

# serial = usb_cdc.data


# print(serial.read())

lora = _lora.LORA()

while True:

    # serial.write(bytes([1,2,3]))
    # print("sent serial bytes")

    # Look for a new packet - wait up to 5 seconds:
    packet = lora.receive(timeout=0.5)
    # If no packet was received during the timeout then None is returned.
    if packet is not None:
        # Received a packet!
        # Print out the raw bytes of the packet:
        print("[RX board] Received (raw bytes): {0}".format(packet))