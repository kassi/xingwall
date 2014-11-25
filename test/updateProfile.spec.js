var testHelper  = require('./testHelper'),
    root        = require('path').normalize(__dirname + '/..'),
    sinon       = require('sinon'),
    assert      = require('assert'),
    EventEmitter = require('events').EventEmitter;
    XINGApi  = require('xing-api'),
    xingApi  = new XINGApi({
      consumerKey:    process.env.XING_CONSUMER_KEY,
      consumerSecret: process.env.XING_CONSUMER_SECRET,
      oauthCallback:  process.env.OAUTH_CALLBACK
    });

var io = {
  emit: function(name) {
    console.log(name);
  }
}
var sess = {
  session: {
    user: {
    }
  }
}

describe('updateProfile', function(){
  var emitter = null,
      xingApiMock = null,
      responseStub = JSON.stringify({
        users: [{
          id: '12_abcdef',
          wants: null,
          haves: null,
          interests: null,
          photo_urls: {
            size_128x128: 'photo_128',
            size_256x256: 'photo_256'
          },
          web_profiles: {
          }
        }]
      });

  beforeEach(function(){
    emitter = new EventEmitter;
    xingApiMock = {client: function () { return {get: function(){} }; }};
    require(root + '/app/processors/updateProfile.js')(io, emitter, xingApiMock);
  })

  it('should react on the updateProfile signal', function(){
    var spy = sinon.spy();

    emitter.on('updateProfile:started', spy);
    emitter.emit('updateProfile', sess, 23);

    sinon.assert.calledOnce(spy);
    sinon.assert.calledWith(spy, sess, 23);
  })
})
