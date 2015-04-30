
var request = require('./');

describe('测试api完整性', function(){
  describe('#asyncrequest.setHost()', function(){
    it('asyncrequest.setHost worked', function(){
      request.setHost(global, 'call2As');
    });
  });
  describe('#asyncrequest.registerApi()', function(){
    it('asyncrequest.registerApi worked', function(){
      request.registerApi('flash.getData');
      request.flashGetData({a: 1}, function(data) {
        console.log(data);
      });
    });
  });
  describe('#asyncrequest.on()', function(){
    it('asyncrequest.on worked', function(){
      request.on('onFlashCompleted', function(data) {
        console.log(data);
      });
    });
    after(function(){
      request.onFlashCompleted({msg: 'onFlashCompleted'});
    });
  });
  describe('#asyncrequest.once()', function(){
    it('asyncrequest.once worked', function(){
      request.once('onFlashCompleted', function(data) {
        console.log(data);
      });
    });
    after(function(){
      request.onFlashCompleted({msg: 'onFlashCompleted'});
    })
  });
})
