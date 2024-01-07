import time
import lora as _lora

import supervisor
supervisor.runtime.autoreload = False

lora = _lora.LORA()

while True:

    # Look for a new packet - wait up to 0.5 seconds:
    packet = lora.receive(timeout=0.5)
    # If no packet was received during the timeout then None is returned.
    if packet is not None:
        # Received a packet!
        # Print out the raw bytes of the packet:
        print("[RX board] Received (raw bytes): {0}".format(packet))
