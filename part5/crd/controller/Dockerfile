FROM node:16.15-alpine

WORKDIR /app

# add app
COPY . ./

RUN npm install

# start app
CMD ["node", "controller.js"]

# docker build -t tonip57/controller --no-cache .
# docker push tonip57/controller