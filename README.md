# QCObjects Handler for Transbank WebPay Plus 

QCObjects Handler for Transbank WebPay Plus  requests. This handler will allow to handle Transbank WebPay Plus  urls
like 
- https://example.com/checkout/webpay/init
- https://example.com/checkout/webpay/result

and interacts with the Transbank WebPay Plus API to generate the response.

## Instructions

1. Install this dependency in your project using npm

```shell
npm i --save qcobjects-handler-webpayplus
```


The contents of *response* is a dynamic object, you can specify any property here
or even use a meta processor.

2. Start the QCObjects HTTP2 Server

```shell
qcobjects-server
```

3. Peer Dependencies needed

- [qcobjects](https://www.npmjs.com/package/qcobjects)
- [qcobjects-cli](https://www.npmjs.com/package/qcobjects-cli)
- [qcobjects-sdk](https://www.npmjs.com/package/qcobjects-sdk)