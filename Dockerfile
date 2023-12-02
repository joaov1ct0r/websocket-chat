# Stage 1 Development
FROM node as development

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

ADD . /usr/src/app

RUN npm i

RUN npm run build

# Stage 2 Production
FROM node as production

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/package.json /usr/src/app

COPY --from=development /usr/src/app/package-lock.json /usr/src/app

COPY --from=development /usr/src/app/build /usr/src/app/build

RUN npm i --omit=dev
