import os

# milkv_duo setup the pin as GPIO
print("Setting the pin as GPIO")
output = os.system('duo-pinmux -w GP0/GP0')
print(output)

import time
import board
import digitalio

PIN = board.GP0

print("hello blinky!")

pin = digitalio.DigitalInOut(PIN)
pin.direction = digitalio.Direction.OUTPUT

while True:
    pin.value = True
    time.sleep(0.5)
    pin.value = False
    time.sleep(0.5)