FROM node:10.9.0-alpine

ENV NODE_VERSION 10.9.0

RUN apk add --no-cache nginx

# Create app directory..
COPY package.json /webapp/package.json
ADD package.json /webapp/package.json
# now most commands run from within there.

ENV HOMEDIR=/webapp
ENV PROJECTDIR=/webapp
ENV FRONTENDDIR=/webapp

# Copy frontend files
WORKDIR $FRONTENDDIR
COPY . .

COPY dist /webapp/dist
COPY package*.json ./
RUN npm install -qy
COPY . ./

#ENV PORT 8080

EXPOSE "8080:8080"

CMD ["npm", "start"]




