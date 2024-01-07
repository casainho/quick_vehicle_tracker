import time
from pinpong.board import Board,Pin

pin_number = Pin.P0

print("Setting the pin as GPIO")
output = os.system('duo-pinmux -w GP0/GP0')
print(output)

try:
    Board().begin()

    pin = Pin(pin_number, Pin.OUT)

    while True:
        pin.value(1)
        print("1")
        time.sleep(1)

        pin.value(0)
        print("0")
        time.sleep(1)
except KeyboardInterrupt:
    print("Exiting...")
