#!/bin/bash

# Check if Firefox is running
if "pgrep -l firefox" > /dev/null
then
    echo "Firefox is already running."
    exit 0
else
    echo "Firefox is not running."
    exit 1
fi
