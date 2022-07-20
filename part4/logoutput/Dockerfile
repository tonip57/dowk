FROM node:16.15-alpine

WORKDIR /app

# add app
COPY . ./

# start app
#CMD ["node", "logoutputwriter.js"]
CMD ["node", "logoutputreader.js"]

# docker build -t tonip57/logoutputreader --no-cache .
# docker push tonip57/logoutputreader

# docker build -t tonip57/logoutputwriter --no-cache .
# docker push tonip57/logoutputwriter