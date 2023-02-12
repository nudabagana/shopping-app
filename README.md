## Description

Shopping app for Revel Systems interview

## Running the app

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) installed.
2. Clone this repo and open it.

```bash
# clone repo
git clone git@github.com:nudabagana/shopping-app.git
# open it
cd shopping-app
```

3.  Then copy .env and **fill it** (enter any desired DB_USER and DB_PASSWORD. Database will be created with this user):

```bash
# copy .env
cp .env.example .env
```

4. Build docker container and run it.

```bash
# build docker image
$ yarn docker:build

# run service + db
$ yarn docker:start
```

5. Open `http://localhost:3000/docs` to see Swagger.

## Usage

#### Products

You may create/remove/read products using `/products` endpoints. 4 Default products are created on server start.

#### Carts

You may use `/carts` endpoints to get the price of your selected cart. Pass item id's + counts to get total price.
Currently cart total price has 2 limits:

1. Total price cannot exceed 100$.
2. Total price cannot be less than 0$.

#### Discounts

You may use `/discounts` to create/remove/read discount logic to the cart calculation. 2 default rules are created on server start:

1. Every 5th item is free
2. 1$ discount is applied after you spend 20$ or more.

Currently discount can be applied by 4 modes:

1. Change price when total excis higher than amount.
2. Change price when total is lower than amount.
3. Change item price, when you buy N amount of them (if used, applies to all items).
4. Change item set price, when you buy desired combination of items (exmple: if you buy 2 melons + 3 carrots, you get 5$ discount).

Discount calc supports 4 modes: flat increase, flat decrease, percentage increase, percentage decrease.

## Development

1. Run db only.

```bash
# run db
yarn docker:start-db
```

2. Yarn install and run server in dev mode.

```bash
# install
yarn install

#run dev
yarn start:dev
```

## Test

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```
