FROM node:16.15-alpine

WORKDIR /app

# add app
COPY . ./

WORKDIR /app
RUN npm install
# start app
CMD ["node", "urlcronjob.js"]

# docker build -t tonip57/urlcronjob --no-cache .
# docker push tonip57/urlcronjob
