const Environment = require("transbank-sdk").Environment;
const WebpayPlus = require("transbank-sdk").WebpayPlus;

WebpayPlus.commerceCode = 597055555532;
WebpayPlus.apiKey = "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
WebpayPlus.environment = Environment.Integration;

var payload = {
  orderId: 1,
  sessionId: 1234,
  amount: 1000,
  returnUrl: "https://localhost/success"
};

function submitIntermediateForm ({token, url}){
  return `<!doctype html>
  <html class="no-js" lang="en">

  <head>
    <meta charset="utf-8" />
     <!-- This is a wide open CSP declaration. To lock this down for production, see below. -->
     <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: gap: https://ssl.gstatic.com; img-src * 'self' data:; child-src *; style-src * 'self' 'unsafe-inline' 'unsafe-eval'; script-src * 'self' 'unsafe-inline' 'unsafe-eval'; connect-src * 'self' 'unsafe-inline' 'unsafe-eval';media-src *">
    <title>Payment</title>
    <link rel="stylesheet" type="text/css" href="https://sdk.qcobjects.dev/css/basic-layout.css"/>
    <link rel="stylesheet" type="text/css" href="css/index.css"/>
    <!-- <link rel="stylesheet" type="text/css" href="css/theme/cyan/style.css"/>-->
    <script type="text/javascript" src="https://cdn.qcobjects.dev/QCObjects.js"></script>
  </head>

  <body  >
    <noscript>
      <!-- anchor linking to external file -->
      <p>This page needs JavaScript because it uses QCObjects (https://qcobjects.com)</p>
    </noscript>

    <form method="post" action="${url}">
      <input name="token" type="hidden" value="${token}" />
    </form>
    <script>
      document.forms[0].submit();
    </script>
  </body>

  </html>
  `;
}

function initTransaction (payload){
  return (async function () {
      const response = await WebpayPlus.Transaction.create(payload.orderId, payload.sessionId, payload.amount, payload.returnUrl);
      return response;
  })();
}

function confirmTransaction(token){
  return (async function () {
    const response = await WebpayPlus.Transaction.commit(token);
    return response;
  })();
}

function saveTxConfirmation ({vci,
                              amount,
                              status,
                              buy_order,
                              session_id,
                              card_detail,
                              accounting_date,
                              transaction_date,
                              authorization_code,
                              payment_type_code,
                              response_code,
                              installments_amount,
                              installments_number,
                              balance
}) {
  const events = {
    "INITIALIZED": () => {},
    "AUTHORIZED": () => {
      // save the tx in db
    },
    "REVERSED": () => {},
    "FAILED": () => {},
    "NULLIFIED": () => {},
    "PARTIALLY_NULLIFIED": () => {},
    "CAPTURED": () => {}
  };

  if (status in Object.keys(events)){
    events[status].call(this, {vci,
                                  amount,
                                  status,
                                  buy_order,
                                  session_id,
                                  card_detail,
                                  accounting_date,
                                  transaction_date,
                                  authorization_code,
                                  payment_type_code,
                                  response_code,
                                  installments_amount,
                                  installments_number,
                                  balance
    });
  }
}

function resultURL_route(){
  confirmTransaction(token).then((response)=> {
    saveTxConfirmation(response);
  });
}


initTransaction(payload).then((response)=>{console.log(submitIntermediateForm(response));});
