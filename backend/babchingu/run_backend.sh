
# backend/run_backend.sh
#!/bin/bash
# TODO: Write automation script for launching BE app
python3 manage.py makemigrations 
python3 manage.py migrate
sudo mkdir -p /log # for `uwsgi` logging 
sudo uwsgi --ini uwsgi.ini