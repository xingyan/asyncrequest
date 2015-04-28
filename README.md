# [pc-game-asyncrequest]

a async-request between javascript &amp; (flash/client/etc.)

##guideline
TODO

## Examples
可以直接这样调用
```js
var request = require('asyncrequest');
request.setHost(document.getElementById(flashId), 'call2As');
```
上面代码初始化了一个asyncrequest的实例

## API DOC
####注册javascript与其他端的接口
```js
request.registerApi(cmds);
```
###### options
- `cmds`
{Array | String} 注册的接口名，可以传入一个接口数组批量注册。

####注册一个javascript开给其他端的函数监听（由于所有的事件监听模型都可以改造为javascript发起的异步请求模型 因此不推荐定义这样的接口）
```js
request.on(cmd, func)
```
###### options
- `cmd`
{String} 监听的接口名。
- `func`
{Function} 监听函数的回调函数

####注册一个一次性的javascript开给其他端的函数监听（不推荐，理由同上）
```js
request.once(cmd, func)
```
###### options
- `cmd`
{String} 监听的接口名。
- `func`
{Function} 监听函数的回调函数