var _            = require('lodash');
var cleankill    = require('cleankill');
var sauceConnect = require('sauce-connect-launcher');
var uuid         = require('uuid');

function Sauce() {
  var _tunnel;

  function stop(done) {
    console.log('Closing Sauce Connect.');
    if(_tunnel) {
      _tunnel.close(function() {
        done();
      });
    } else {
      sauceConnect.kill.bind(sauceConnect);
      done();
    }
  };

  return {
    start: function(opts, done) {
      if(_tunnel) {
        throw Error('Tunnel already opened.');
      };

      var connectOptions = {
        tunnelIdentifier: uuid.v4()
      };

      _.defaults(connectOptions, opts);

      var gridUrl = 'http://' + connectOptions.username + ':' + connectOptions.accessKey + '@ondemand.saucelabs.com:80/wd/hub';

      console.log('Sauce Connect opening tunnel.')
      sauceConnect(connectOptions, function(err, tunnel) {
        if(err) throw err;
        console.log('Sauce Connect ready.');
        _tunnel = tunnel;
        done({gridUrl: gridUrl, tunnelId: connectOptions.tunnelIdentifier});
      });

      cleankill.onInterrupt(stop);
    },

    stop: stop
  };
}

module.exports = Sauce;