from pinpong.board import Board,Pin

pin_number = Pin.P0

Board().begin()
pin = Pin(pin_number, Pin.OUT)
pin.value(1)