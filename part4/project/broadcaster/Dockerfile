FROM node:16.15-alpine

WORKDIR /app

# add app
COPY . ./

# start app
CMD ["node", "broadcaster.js"]

# docker build -t tonip57/broadcaster --no-cache .
# docker push tonip57/broadcaster