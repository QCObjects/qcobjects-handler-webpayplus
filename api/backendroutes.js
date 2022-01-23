(function loadWebpayPlusRoutes(){
    if (!loadWebpayPlusRoutes.loaded){
      let backend = CONFIG.get("backend");
      if (typeof backend === "undefined"){
        backend = {};
      }
      if (typeof backend.routes === "undefined"){
        backend.routes = [];
      }
      backend.routes = backend.routes.concat([{
        "name":"WebPay Init Transaction",
        "description":"WebPay Init Transaction",
        "path":"^/checkout/webpay/init$",
        "microservice":"qcobjects-handler-webpayplus/api/com.qcobjects.webpayplus.inittransaction",
        "responseHeaders":{},
        "cors":{
          "allow_origins":"*"
        }
      },
      {
        "name":"WebPay Result Transaction",
        "description":"WebPay Result Transaction",
        "path":"^/checkout/webpay/result$",
        "microservice":"qcobjects-handler-webpayplus/api/com.qcobjects.webpayplus.result",
        "responseHeaders":{},
        "cors":{
          "allow_origins":"*"
        }
      }]);
      CONFIG.set("backend", backend);
      loadWebpayPlusRoutes.loaded = true;
    }
  })();
  