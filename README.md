xingwall
========

Amazing Wall of Xing members logged in to a service.

This is currently work in progress!

## Prerequisites

### MongoDB

#### Mac OS X

```
$ brew install mongodb
$ mongod
```

### Node

### Mac OS X

```
$ brew install node
```

### xing-api-nodejs

The current work-in-progress state makes use of [xing-api-nodejs](https://github.com/volkert/xing-api-nodejs).
As long as this is also work-in-progress and not pushed to npm, you need to install it manually

```
$ git clone https://github.com/volkert/xing-api-nodejs
$ cd xing-api-nodejs
$ npm link
```

## Installation

```
$ git clone https://github.com/kassi/xingwall.git
$ cd xingwall
$ npm link xing-xpi
$ npm install
```

## Development

Add your xing api consumer key and secret to a local .env file

```
XING_CONSUMER_KEY="xxxxxxxxxx"
XING_CONSUMER_SECRET="yyyyyyyyyyyyyy"
```

Best you install grunt globally to avoid having to run `grunt` by specifying the whole path.

```
$ npm install -g grunt-cli
```

Make sure mongodb is runnig and run `grunt`

```
$ grunt
```

## Usage

Run it in production mode

```
$ npm start
```

# Deployment

You can deploy this application to Heroku.

Before you can start using Heroku you have to install the [heroku toolbelt](https://toolbelt.heroku.com/).

## Setup a new Heroku app

If you create a new Heroku application you have to add the [Compose MongoDB](https://addons.heroku.com/mongohq) addon
and add the necessary config variables.

```
heroku config:set NODE_ENV=production
heroku config:set COOKIE_SECRET=aRandomCookieSecret
heroku config:set XING_CONSUMER_KEY=yourConsumerKey
heroku config:set XING_CONSUMER_SECRET=yourConsumerSecret
```

## Deploy to Heroku

If you're deploying for the first time you have to remember to login and setup the `heroku` remote:

1. `heroku login`
2. `heroku git:remote -a YOUR_APP_NAME`

After that you can deploy using the usual git push:

```
git push heroku master
```

## Authors

* Jan Ahrens
* Karsten Silkenbäumer
* Blake Simpson
* Volker Tietz
