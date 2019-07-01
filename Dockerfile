# Use following version of Node as the base image
FROM node:12-slim

# Set work directory for run/cmd
WORKDIR /app

RUN apt-get update && apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Copy package.json into work directory and install dependencies
# We do not copy package-lock.json here as we do want the specific binary stuff (canvas) for the specific plattform of the docker container
COPY package.json /app/package.json
RUN npm install --production

# Copy everthing else in work directory
COPY . /app

# Expose server port
EXPOSE 3000

# Run node
CMD node index.js
