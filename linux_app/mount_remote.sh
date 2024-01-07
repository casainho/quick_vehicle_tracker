#!/bin/bash

if [ ! -d "./ssh_remote_mount" ]; then
  sudo mkdir ./ssh_remote_mount
fi

echo "Mounting sshfs..."
sudo sshfs -v -o allow_other,user=root 192.168.42.1:/ ./ssh_remote_mount 2>&1
