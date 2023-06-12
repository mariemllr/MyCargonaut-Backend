## MyCargonaut

MyCargonaut is a NestJS application with a PostgreSQL database managed by TypeORM.

# Prerequisites

- Node.js (v14+ recommended)
- npm (v7+ recommended)
- Docker
- Docker Compose

# Setup

Follow these steps to get the project running on your local machine:

# Clone the repository

`git clone git@github.com:tillkwl/MyCargonaut-Backend.git`
`cd mycargonaut`

# Install dependencies

From within the project directory:

`npm install`

# Run PostgreSQL with Docker

`docker run --name MyCargonaut-db -p 5432:5432 -e POSTGRES_PASSWORD=cargomaus69 -d postgres`

# Start the NestJS Server

`npm run start:dev`

Now, your server should be running on http://localhost:3000.

# Testing

To run tests:

`npm run test`
