# Base image
FROM node:lts-alpine

# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn install --frozen-lockfile

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]