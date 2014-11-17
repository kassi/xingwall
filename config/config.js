var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'xingwall'
    },
    port: 3000,
    db: 'mongodb://localhost/xingwall-development'
    
  },

  test: {
    root: rootPath,
    app: {
      name: 'xingwall'
    },
    port: 3000,
    db: 'mongodb://localhost/xingwall-test'
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'xingwall'
    },
    port: 3000,
    db: 'mongodb://localhost/xingwall-production'
    
  }
};

module.exports = config[env];
