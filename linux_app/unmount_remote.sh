#!/bin/bash

echo "Unmounting sshfs..."
sudo fusermount -u ./ssh_remote_mount 2>&1
