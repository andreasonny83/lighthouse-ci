FROM node:alpine

# Installs latest Chromium package.
RUN apk update && apk upgrade \
    && echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories \
    && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories \
    && apk add --no-cache \
    nss-tools \
    udev \
    ttf-freefont \
    chromium@edge \
    nss@edge \
    grep \
    && rm -rf /var/lib/apt/lists/* \
    /var/cache/apk/* \
    /usr/share/man \
    /tmp/*

# Add Chrome as a user
RUN mkdir -p /usr/src/app \
    && adduser -D chrome \
    && chown -R chrome:chrome /usr/src/app

# Install Lighthouse CI
RUN npm install -g lighthouse-ci \
    && npm cache clean --force

# Run Chrome as non-privileged
USER chrome
WORKDIR /usr/src/app

ENV CHROME_PATH=/usr/bin/chromium-browser

# Add Lighthouse CI entrypoint
ENTRYPOINT ["/usr/local/bin/lighthouse-ci"]
