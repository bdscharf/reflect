# mentalmindfulness
EECS330 Human-Computer Interaction project.

## Purpose:
Help users develop healthy patterns of thought.

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

3) *[redis instructions will go here once fully implemented]*

4) Start up the server

```
# Use ^C to exit.
npm start
```

Once the server is running, navigate to http://localhost:3000 in your browser to access the app.