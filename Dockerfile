# to build Cocker image:
# docker build -t xx-rest-api .

# to run Docker container:
# docker run -p 3000:3000 xx-rest-api

FROM node:18

WORKDIR /backend

COPY ./package.json .
COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]