import os
import lora as _lora

# milkv_duo setup the pin as GPIO
print("Setting the pin as GPIO")
output = os.system('duo-pinmux -w GP0/GP0')
print(output)

lora = _lora.LORA()

while True:

    # Look for a new packet - wait up to 0.5 seconds:
    packet = lora.receive(timeout=0.5)
    # If no packet was received during the timeout then None is returned.
    if packet is not None:
        # Received a packet!
        # Print out the raw bytes of the packet:
        print("[RX board] Received (raw bytes): {0}".format(packet))