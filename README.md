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

Add your xing api consumer key and secret to a loacl .env file

```
XING_CONSUMER_KEY="xxxxxxxxxx"
XING_CONSUMER_SECRET="yyyyyyyyyyyyyy"
```

Use `grunt` for development. Make sure mongodb is runnig.

```
$ grunt
```

## Usage

Run it in production mode

```
$ npm start
```

## Authors

* Jan Ahrens
* Karsten Silkenbäumer
* Blake Simpson
* Volker Tietz
