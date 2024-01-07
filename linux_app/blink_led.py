import os

# milkv_duo setup the pin as GPIO
print("Setting the pin as GPIO")
output = os.system('duo-pinmux -w GP0/GP0')
print(output)

import time
import board
import digitalio

pin = digitalio.DigitalInOut(board.GP0)
pin.direction = digitalio.Direction.OUTPUT
 
print("Start blinking the pin")
while True:
    pin.value = True
    print("pin ON")
    time.sleep(0.5)
    pin.value = False
    print("pin OFF")
    time.sleep(0.5)
