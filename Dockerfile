# Use following version of Node as the base image
FROM node:10.6-slim

# Set work directory for run/cmd
WORKDIR /app

RUN apt-key update && apt-get update && apt-get -y install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++

# Copy package.json into work directory and install dependencies
COPY package.json /app/package.json
RUN npm install

# Copy everthing else in work directory
COPY . /app

# Expose server port
EXPOSE 3000

# Run node
CMD node index.js
