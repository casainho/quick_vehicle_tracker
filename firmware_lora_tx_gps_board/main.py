import time
import gps as _gps
import lora as _lora

import supervisor
supervisor.runtime.autoreload = False

gps = _gps.GPS()
lora = _lora.LORA()

processing_interval = 1.0
data_string = ''
counter = 0
while True:

    # Let's put the code inside a try because GPS data may fail...
    try:

        # Make sure to call gps.update() every loop iteration and at least twice
        # as fast as data comes from the GPS unit (usually every second).
        # This returns a bool that's true if it parsed new data (you can ignore it
        # though if you don't care and instead look at the has_fix property).
        gps.update()

        time_now = time.monotonic()
        if time_now - processing_interval >= 1.0:
            processing_interval = time_now
            if not gps.has_fix:
                # Try again if we don't have a fix yet.
                print("Waiting for fix...")
                continue

            # we got GPS fix, so process the data
            counter = (counter + 1) % 1_000_000

            data_string = f'##! {counter} {gps.timestamp_utc.tm_mon}/{gps.timestamp_utc.tm_mday}/{gps.timestamp_utc.tm_year} ' + \
                f'{gps.timestamp_utc.tm_hour:02}:{gps.timestamp_utc.tm_min:02}:{gps.timestamp_utc.tm_sec:02} ' + \
                f'{gps.latitude:.6f} {gps.longitude:.6f} {gps.altitude_m:.2f} {gps.speed_knots * 1.852:.2f} **!'

            lora.send(data_string)
            print('Sent message by LoRa:')
            print(data_string)
            print()
    
    except Exception as e:
        # let's restart again the GPS
        print("Restarting GPS...")
        del gps
        gps = _gps.GPS()