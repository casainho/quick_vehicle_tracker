import spidev

# Create an spidev object
spi = spidev.SpiDev()

# Open the SPI device with the specified bus and device
spi.open(0, 0)

# Set the SPI mode (optional)
spi.mode = 0b01 # You can set the mode according to your device's requirements

# Set the clock frequency in Hz
desired_speed_hz = 100000
spi.max_speed_hz = desired_speed_hz

for i in range(256):
    list_data = [i]
    # Using xfer2 instead of xfer for better performance and flexibility
    response = spi.xfer2(list_data)
    if response != [0]:
        print(response)

# Close the SPI device when done
spi.close()
