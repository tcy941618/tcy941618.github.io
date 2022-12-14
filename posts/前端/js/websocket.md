## 介绍

**WebSockets** 是一种先进的技术。它可以在用户的浏览器和服务器之间打开交互式通信会话。使用此API，您可以向服务器发送消息并接收事件驱动的响应，而无需通过轮询服务器的方式以获得响应。

## web api

[`WebSocket`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)

用于连接WebSocket服务器的主要接口，之后可以在这个连接上发送 和接受数据。

[`CloseEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/CloseEvent)

连接关闭时WebSocket对象发送的事件。

[`MessageEvent`](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageEvent)

当从服务器获取到消息的时候WebSocket对象触发的事件。

WebSocket 不应当用于混合的上下文环境；也就是说，不应该在用HTTPS加载的页面中打开非安全版本的WebSocket，反之亦然。而实际上一些浏览器也明确禁止这一行为，包括 Firefox 8 及更高版本。

使用示例：

```javascript
const ws = new WebSocket('ws://xxx.com/xxx')
ws.addEventListener('open',e=>{})
ws.addEventListener('message',e=>{
    cosnole.log(e.data)
})
ws.addEventListener('error',e=>{})
ws.addEventListener('close',e=>{})
ws.send('hello')
```

## websocket协议主要内容(参考[RFC 6455](https://tools.ietf.org/html/rfc6455#page-4))

websocket协议基于TCP协议，通过HTTP进行握手。

> The WebSocket Protocol is an independent TCP-based protocol.  Its
> only relationship to HTTP is that its handshake is interpreted by
> HTTP servers as an Upgrade request.
>
> By default, the WebSocket Protocol uses port 80 for regular WebSocket
> connections and port 443 for WebSocket connections tunneled over
> Transport Layer Security (TLS)

The protocol has two parts: a handshake and the data transfer.

### 握手

The handshake from the client looks as follows:

        GET /chat HTTP/1.1
        Host: server.example.com
        Upgrade: websocket  // 将协议升级为websocket
        Connection: Upgrade // 升级协议
        Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ== // 
        Origin: http://example.com
        Sec-WebSocket-Protocol: chat, superchat // 期望使用的子协议
        Sec-WebSocket-Version: 13 // websocket版本
        // ...其他http请求头

The handshake from the server looks as follows:

        HTTP/1.1 101 Switching Protocols
        Upgrade: websocket
        Connection: Upgrade
        Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo= // base64(SHA1(Sec-WebSocket-Key + GUID))
        Sec-WebSocket-Protocol: chat // 确定使用的子协议
        Sec-WebSocket-Version: 13 // 如果不支持请求头中的版本，则发回支持的websocket版本
        // ...其他http响应头
其中`Sec-WebSocket-Accept`的值是由`Sec-WebSocket-Key`和`GUID`拼接，拼接后进行SHA1编码，然后再编码为base64格式的字符串。GUID是一个常量字符串。

> Globally Unique Identifier (GUID, [[RFC4122]](https://tools.ietf.org/html/rfc4122)) "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

### 数据

数据是通过一个或多个数据帧来传送，单个数据帧的格式如下：

```
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
```

FIN：1 bit，是否为最后一个数据帧。

RSV1, RSV2, RSV3：1 bit each，一般都为0，当需要拓展协议时供拓展使用。

opcode：4 bits，用于解释"Payload data"的作用，如果接收到无法识别的opcode则接收失败

1. 0x0：连续帧

 	2. 0x1：文本帧
 	3. 0x2：二进制帧
 	4. 0x3-0x7：保留用于其他非控制帧
 	5. 0x8：关闭连接
 	6. 0x9：ping
 	7. 0xA：pong
 	8. 0xB-0xF：保留用于其他控制帧

Mask：1 bit，"Payload data"是否经过掩码处理，值为1时需要设置“Masking-key”。客户端发送数据时必须为1。

Payload length:  7 bits, 7+16 bits, or 7+64 bits，

Masking-key:  0 or 4 bytes，掩码

Payload data：实际数据内容



编码/解码

随机生成一个32位的掩码，然后通过以下算法计算编码/解码后的数据：

```
j = i MOD 4
transformed-octet-i = original-octet-i XOR masking-key-octet-j
即
掩码的第1个字节与数据的第1个字节进行按位异或运算，得到编码/解码后的第1个字节
掩码的第2个字节与数据的第2个字节进行按位异或运算，得到编码/解码/解码后的第2个字节
掩码的第3个字节与数据的第3个字节进行按位异或运算，得到编码/解码后的第3个字节
掩码的第4个字节与数据的第4个字节进行按位异或运算，得到编码/解码后的第4个字节
掩码的第1个字节与数据的第5个字节进行按位异或运算，得到编码/解码后的第5个字节
掩码的第2个字节与数据的第6个字节进行按位异或运算，得到编码/解码后的第6个字节
直到全部编码/解码完成
```

## websocket协议简单实现(nodejs)

server.js

```javascript

'use strict';

const http = require('http')
const fs = require('fs')
const crypto = require('crypto')

const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
const hostname = 'localhost'
const port = 8080

const server = http.createServer((req,res)=>{
    const {url} = req
    res.setHeader('Content-Type','utf8')
    
    if(url === '/'){
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile(__dirname + "/index.html", "utf-8", function (error, data){
            if(error)
                res.end("404");
            else
                res.end(data.toString());
        });
    }else {
        res.end('404')
    }
}).on('upgrade',(req, socket,head)=>{
    
    const {headers} = req
    const key = crypto.createHash('sha1').update(headers["sec-websocket-key"]+GUID).digest('base64')
    // 握手
    socket.write([
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `sec-websocket-accept: ${key}`
    ].join('\r\n')+'\r\n\r\n')
    
    // 接收数据
    socket.on('data', function (buf) {
        let values = ''
        for(let value of buf.values()){
            values += value.toString(2)
        }
        console.log(values) 
        // 10000001 10000111 10010001 01011010 11010011 01010100 11111001 00111111 10111111 00111000 11111110 01110100 11111101
        console.log(decodeFrame(buf)) // hello..
    });
    
    // 发送数据
    socket.send(encodeFrame('hi'))
}).listen(port,hostname,()=>{
    console.log('server started, click http://'+hostname+':'+port+' to view the page')
})

// 解码
function decodeFrame(buf) {
    const length = buf.readUInt8(1) & 0x7f
    const mask = buf.slice(2,6)
    const payload = buf.slice(6)
    let formattedBuf = Buffer.alloc(payload.length)
    for(let i=0;i<payload.length;i++) {
        formattedBuf[i] = mask[i%4] ^ payload[i]
    }
    return formattedBuf
}

// 编码
function encodeFrame(str) {
    const payload = Buffer.from(str)
    const frame = Buffer.alloc(payload.length+2)
    frame.writeUInt8(0b10000001)
    frame.writeUInt8(0b00000010,1)
    payload.copy(frame,2)
    return frame
}
```

index.html

```html
<html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <div id="container"></div>
    <script type="text/babel">
    const client = new WebSocket('ws://localhost:8080')
    client.addEventListener('message', e=>{
      console.log(e)
    })
    client.addEventListener('open', e=>{
      client.send('hello..')
    })
    </script>
  </body>
</html>
```

