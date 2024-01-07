#!/bin/sh

# Check for user input
if [ $# -eq 0 ]; then
  echo "Usage: ./set_pin_state.sh <pin_number> <state>"
  echo "Example: ./set_pin_state.sh 440 on"
  exit 1
fi

# Set pin number based on 1st parameter input
PIN=`echo $1`

# Enable GPIO
if [ ! -e /sys/class/gpio/gpio${PIN} ]; then
  echo ${PIN} > /sys/class/gpio/export
fi

# Setup GPIO
echo out > /sys/class/gpio/gpio${PIN}/direction

# Set pin state based on 2nd parameter input
is_on=false

if [ "$2" == "on" ]; then
  is_on=true
fi

if $is_on; then
  echo 1 > /sys/class/gpio/gpio${PIN}/value
else
  echo 0 > /sys/class/gpio/gpio${PIN}/value
fi
