import supervisor
supervisor.runtime.autoreload = False

import time
import random
import socketpool
import wifi
import adafruit_minimqtt.adafruit_minimqtt as MQTT

# wifi access data is on secrets.py
from secrets import secrets

# connect to AP
if not wifi.radio.connected:
    print("Connecting to %s" % secrets["ssid"])
    wifi.radio.connect(secrets["ssid"], secrets["password"])
    print("Connected to %s!" % secrets["ssid"])

# MQTT topic
mqtt_topic = "scooter1/battery_soc"

# Define callback functions which will be called when certain events happen.
# pylint: disable=unused-argument
def connected(client):
    # Connected function will be called when the client is connected to the broker.
    # This is a good place to subscribe to feed changes. The client parameter
    # passed to this function is the broker MQTT client so you can make
    # calls against it easily.
    print("Connected to the broker!")

# pylint: disable=unused-argument
def disconnected(client):
    # Disconnected function will be called when the client disconnects.
    print("Disconnected from the broker")

# pylint: disable=unused-argument
def publish(client, user_data, topic):
    print(f"Published on {topic} the data: {user_data}")

# Create a socket pool
pool = socketpool.SocketPool(wifi.radio)

# Initialize a new MQTT Client object
mqtt_client = MQTT.MQTT(
    broker="localhost",
    port=1883,
    socket_pool=pool,
    is_ssl=False,
    client_id="1"
)

# Setup the callback methods above
mqtt_client.on_connect = connected
mqtt_client.on_disconnect = disconnected
mqtt_client.on_publish = publish

# Connect the client to the MQTT broker.
print("Connecting to the broker...")
mqtt_client.connect()

# Below is an example of manually publishing a new value to the broker.
last = 0
print("Publishing a new message every 10 seconds...")
while True:
    # Send a new message every 10 seconds.
    if (time.monotonic() - last) >= 10:
        value = random.randint(0, 100)
        print(f"Publishing {value} to {mqtt_topic}")
        mqtt_client.publish(mqtt_topic, value)
        last = time.monotonic()