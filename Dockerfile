# Use following version of Node as the base image
FROM node:9.2

# Set work directory for run/cmd
WORKDIR /app

RUN apt-key update && apt-get update && apt-get -y install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

# Copy package.json into work directory and install dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g jspm

COPY jspm.config.js /app/jspm.config.js
RUN jspm install

# Copy everthing else in work directory
COPY . /app

# Expose server port
EXPOSE 3000

# Run node
CMD node index.js
