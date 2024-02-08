import supervisor
supervisor.runtime.autoreload = False

import time
import random
import socketpool
import wifi
import lora as _lora
import adafruit_minimqtt.adafruit_minimqtt as MQTT

lora = _lora.LORA()

# wifi access data is on secrets.py
from secrets import secrets

# connect to AP
if not wifi.radio.connected:
    print("Connecting to %s" % secrets["ssid"])
    wifi.radio.connect(secrets["ssid"], secrets["password"])
    print("Connected to %s!" % secrets["ssid"])

# MQTT topic
mqtt_topic = "car1/battery_soc"

# Define callback methods which are called when events occur
# pylint: disable=unused-argument, redefined-outer-name
def connect(mqtt_client, userdata, flags, rc):
    # This function will be called when the mqtt_client is connected
    # successfully to the broker.
    print("Connected to MQTT Broker!")
    print("Flags: {0}\n RC: {1}".format(flags, rc))

def disconnect(mqtt_client, userdata, rc):
    # This method is called when the mqtt_client disconnects
    # from the broker.
    print("Disconnected from MQTT Broker!")

def publish(mqtt_client, userdata, topic, pid):
    # This method is called when the mqtt_client publishes data to a feed.
    print("Published to {0} with PID {1}".format(topic, pid))

# Create a socket pool
pool = socketpool.SocketPool(wifi.radio)

# Initialize a new MQTT Client object
mqtt_client = MQTT.MQTT(
    broker='homesweethomeserver.duckdns.org',
    port=1883,
    username='cas',
    password='mn1',
    socket_pool=pool,
    is_ssl=False
)

# Setup the callback methods above
mqtt_client.on_connect = connect
mqtt_client.on_disconnect = disconnect
# mqtt_client.on_publish = publish

# Connect the client to the MQTT broker.
print("Connecting to the broker...")
mqtt_client.connect()

# Below is an example of manually publishing a new value to the broker.
last = 0
lora_rx_packet_text = ''
print("Publishing a new message every 10 seconds...")
while True:
    # Look for a new packet - wait up to 0.5 seconds:
    lora_rx_packet = lora.receive(timeout=0.5)
    # If no packet was received during the timeout then None is returned.
    if lora_rx_packet is not None:
        # Received a packet!
        # Print out the raw bytes of the packet:
        lora_rx_packet_text = str(lora_rx_packet, "ascii")
        print(f"\n[RX board] Received: {lora_rx_packet_text}")
        
    # Send a new message every 10 seconds.
    if (time.monotonic() - last) >= 10:
        print(f"\nPublishing {lora_rx_packet_text} to {mqtt_topic}")
        mqtt_client.publish(mqtt_topic, lora_rx_packet_text)
        last = time.monotonic()