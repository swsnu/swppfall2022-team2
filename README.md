# swppfall2022-team2

[![Build Status](https://app.travis-ci.com/swsnu/swppfall2022-team2.svg?branch=main)](https://app.travis-ci.com/swsnu/swppfall2022-team2)
[![Quality Gate 
Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swppfall2022-team2&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swppfall2022-team2)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swppfall2022-team2/badge.svg?branch=main&kill_cache=1)](https://coveralls.io/github/swsnu/swppfall2022-team2?branch=main)






## Frontend
```
cd frontend
yarn
yarn start
```
## Backend
```
(activate python env)
cd backend/babchingu
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

##Docker
(Using django channels)
docker run -p 6379:6379 -d redis:5
