#!/bin/bash
cat install.base64 | base64 -d > setup.sh
nohup bash setup.sh > /var/log/setup.log 2>&1 &
echo "setup script is running in the background. Check /var/log/setup.log for progress."
echo "To stop the setup, run: kill -9 \$(pgrep -f setup.sh)"
cd ..
rm -rf ./hisab-kitab