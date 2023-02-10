FROM node:16.17.1 as build-env

WORKDIR /app

ADD tsconfig.json /app/tsconfig.json
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
ADD tsconfig.build.json /app/tsconfig.build.json
ADD nest-cli.json /app/nest-cli.json
ADD src /app/src
RUN yarn install

RUN yarn build

FROM node:16.17.1

WORKDIR /app

COPY --from=build-env /app/package.json /app/package.json
COPY --from=build-env /app/yarn.lock /app/yarn.lock

RUN NOYARNPOSTINSTALL=1 yarn install --production

COPY --from=build-env /app/dist /app/dist

CMD [ "yarn", "start:prod" ]


