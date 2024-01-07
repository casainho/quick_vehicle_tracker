import board
import busio
import digitalio
import adafruit_rfm9x

class LORA(adafruit_rfm9x.RFM9x):

    def __init__(self):
        # Define radio parameters.
        RADIO_FREQ_MHZ = 915.0  # Frequency of the radio in Mhz. Must match your
        # module! Can be a value like 915.0, 433.0, etc.

        # Initialize SPI bus.
        spi = busio.SPI(board.SCLK, board.MOSI, board.MISO)
        while not spi.try_lock():
            pass
        spi.configure(baudrate=500000)
        spi.unlock()

        # GP0 pin is connected to the RESET of the LoRa module
        reset_pin = board.GP0
        RESET = digitalio.DigitalInOut(reset_pin)
        RESET.direction = digitalio.Direction.OUTPUT

        CS = digitalio.DigitalInOut(board.CS)

        while True:
            # Initialze RFM radio
            super().__init__(spi, CS, RESET, RADIO_FREQ_MHZ, baudrate=100000)
            print("while True")

        # You can however adjust the transmit power (in dB).  The default is 13 dB but
        # high power radios like the RFM95 can go up to 23 dB:
        self.tx_power = 13
