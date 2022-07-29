FROM node:16.15-alpine

WORKDIR /app

# add app
COPY . ./

RUN npm install

# start app
CMD ["node", "website.js"]

# docker build -t tonip57/website --no-cache .
# docker push tonip57/website