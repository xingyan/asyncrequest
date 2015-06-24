var
  /**
   * @desc 工具方法
   */
  util = require('pc-game-util').util,

  /**
   * @desc 请求对象 可以是flash也可以是window.external这种客户端开放给js的对象
   */
  request = null,

  /**
   * @desc 请求对象的请求方法api
   */
  requestMethod = 'sendRequest',

  /**
   * @desc 异步请求回调表
   * @type {exports.util|*}
   */
  syncRequestCallbackMap = {},

  /**
   * @desc 空函数
   */
  emptyFun = function() {};

/**
 * @desc 判断一个对象是不是数组
 * @param source
 * @returns {boolean}
 */
var isArray = function(source) {
  return ('[object Array]' == Object.prototype.toString.call(source));
}

/**
 * @desc 判断一个对象是不是字符串
 * @param source
 * @returns {boolean}
 */
var isString = function(source) {
  return '[object String]' == Object.prototype.toString.call(source)
    || (typeof source).toLowerCase() == 'string';
}

/**
 * @desc 绑定用户注册的函数
 * @param cmd
 * @param func
 */
function bindFunc(cmd, _cmd, func) {
  asyncRequest[_cmd] = (function(__cmd) {
    return function() {
      var args = [__cmd],
        i = 0,
        len = arguments.length;
      for ( ; i < len; i++) {
        args.push(arguments[i]);
      }
      return func.apply(this, args);
    }
  })(cmd);
}

/**
 * @desc 发送异步请求给客户端
 * @param cmd
 * @param opts
 * @param func
 */
function doRequest(cmd, opts, func) {
  var id = util.createUniqueID('');
  syncRequestCallbackMap[id] = func;
  try {
    if(isString(request)) {
      request = document.getElementById(request);
    }
    request && request[requestMethod] && request[requestMethod](id, cmd, util.jsonEncode(opts));
  } catch(e) {
    throw new Error("The client doesn't support request method!");
  }
}

/**
 * @desc 注册异步请求函数
 * @param cmd
 * @param opts
 * @param func
 */
function getSyncFun(cmd, opts, func) {
  var ars = Array.prototype.slice.apply(arguments, [1, 3]);
  if(!ars || !ars.length) {
    opts = {};
    func = emptyFun;
  }
  func = (ars.length == 1) ? opts : (func || emptyFun);
  opts = (ars.length == 1) ? {} : opts;
  doRequest(cmd, opts, func);
}

/**
 * @desc 接受异步回调
 * @param result {String}
 */
function asyncDispatch(id, result) {
  var handler,
    _result;
  if(isString(result)) {
    try {
      _result = eval("(" + result + ")");
    } catch (e) {
      _result = result;
    }
  } else {
    _result = result
  }
  id = (id != undefined && id != null) ? id : (_result ? _result.id : null);
  handler = syncRequestCallbackMap[id];
  if(!handler)   return;
  if(handler && typeof(handler) == "function") {
    handler(_result);
  }
}

var asyncRequest = {
  onSync: asyncDispatch
};

/**
 * @desc 注册通信的cmd
 * @param cmd {String | Array}
 */
asyncRequest.registerApi = function(cmds) {
  if(isArray(cmds)) {
    var len = cmds.length;
    for(; len--; ) {
      asyncRequest.registerApi(cmds[len]);
    }
  } else if(isString(cmds)) {
    return asyncRequest._registerApi(cmds);
  } else {
    return null;
  }
}

/**
 * @desc 注册普通的事件监听 理论上所有的事件监听都可以转化为异步请求 因此此api不推荐使用
 * @param cmd
 * @param func
 */
asyncRequest.on = function(cmd, func) {
  var cmd = util.camelCase(cmd);
  asyncRequest[cmd] = func;
}

/**
 * @desc 注册一次性的事件监听 不建议使用 理由同上
 * @param cmd
 * @param func
 */
asyncRequest.once = function(cmd, func) {
  var cmd = util.camelCase(cmd);
  var old = asyncRequest[cmd] || emptyFun;
  asyncRequest[cmd] = function() {
    asyncRequest[cmd] = old;
    var args = Array.prototype.slice.call(arguments);
    return func.apply(asyncRequest, args);
  }
}

/**
 * @desc 注册通信cmd
 * @param cmd
 * @private
 */
asyncRequest._registerApi = function(cmd) {
  if(!request) {
    throw new Error('You need to initialize the request constant by use setHost');
  }
  var _cmd = util.camelCase(cmd);
  bindFunc(cmd, _cmd, getSyncFun);
}

/**
 * @desc 更新客户端请求对象
 * @param host
 * @param method
 */
asyncRequest.setHost = function(host, method) {
  request = host;
  requestMethod = method;
}

/**
 * @desc 获取当前客户端请求对象
 * @returns {*}
 */
asyncRequest.getHost = function() {
  return request;
}

module.exports = asyncRequest;