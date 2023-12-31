import board
import busio
import digitalio
import adafruit_rfm9x

class LORA(adafruit_rfm9x.RFM9x):

    def __init__(self):
        # Define radio parameters.
        RADIO_FREQ_MHZ = 915.0  # Frequency of the radio in Mhz. Must match your
        # module! Can be a value like 915.0, 433.0, etc.

        # Define pins connected to the chip, use these if wiring up the breakout according to the guide:
        CS = digitalio.DigitalInOut(board.IO7)
        RESET = digitalio.DigitalInOut(board.IO5)

        # Initialize SPI bus.
        spi = busio.SPI(board.IO9, MOSI=board.IO11, MISO=board.IO12)

        # Initialze RFM radio
        self.rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)

        # You can however adjust the transmit power (in dB).  The default is 13 dB but
        # high power radios like the RFM95 can go up to 23 dB:
        self.rfm9x.tx_power = 13