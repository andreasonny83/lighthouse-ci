FROM node:carbon

WORKDIR /demo

# Install Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

ENV CHROME_BIN=/usr/bin/google-chrome-stable

COPY package*.json /demo/

# RUN npm install

# Bundle app source
# COPY . .

# EXPOSE 8080
