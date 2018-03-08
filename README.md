# reflect
Dive deep into patterns of thought and emotion with ['reflect.'](https://reflect365.herokuapp.com/)

EECS 330 HCI Project.

## Purpose:
Help users develop healthy patterns of thought and emotion.

## Components:
1) User Profiles

2) Data Collection Forms

3) Gamification

## Usage:
Note that you must have [Node.js](https://nodejs.org/en/) installed to use ```npm``` and to run the app.

1) Download and install dependencies

```
# Clone directory
git clone https://github.com/bdscharf/mentalmindfulness.git
# Enter directory
cd mentalmindfulness
# Install dependencies
npm install
```
2) Now, configure a local Postgres server and add to ```.env``` file

i) Download [PostgresApp](https://postgresapp.com/)

ii) Follow instructions as listed on the site to initialize a server. Note the host and port so you can create the connection url.

iii) Add the connection url to the ```.env``` file in the project.

iv) Start the Postgres server you just created.

3) Install [redis](https://redis.io/) and start a server in the application folder using ```redis-server```

4) Start up the application server

```
# Use ^C to exit.
npm start
```

Once the server is running, navigate to http://localhost:3000 in your browser to access the app.