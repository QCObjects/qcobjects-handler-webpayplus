/**
 * QCObjects Transbank WebPay Plus Integration
 * ________________
 *
 * Author: Jean Machuca <correojean@gmail.com>
 *
 * Cross Browser Javascript Framework for MVC Patterns
 * QuickCorp/QCObjects is licensed under the
 * GNU Lesser General Public License v3.0
 * [LICENSE] (https://github.com/QuickCorp/QCObjects/blob/master/LICENSE.txt)
 *
 * Permissions of this copyleft license are conditioned on making available
 * complete source code of licensed works and modifications under the same
 * license or the GNU GPLv3. Copyright and license notices must be preserved.
 * Contributors provide an express grant of patent rights. However, a larger
 * work using the licensed work through interfaces provided by the licensed
 * work may be distributed under different terms and without source code for
 * the larger work.
 *
 * Copyright (C) 2015 Jean Machuca,<correojean@gmail.com>
 *
 * Everyone is permitted to copy and distribute verbatim copies of this
 * license document, but changing it is not allowed.
 */
/*eslint no-unused-vars: "off"*/
/*eslint no-redeclare: "off"*/
/*eslint no-empty: "off"*/
/*eslint strict: "off"*/
/*eslint no-mixed-operators: "off"*/
/*eslint no-undef: "off"*/
/*eslint no-useless-escape: "off"*/
"use strict";

var payload = {
  orderId: 1,
  sessionId: 1234,
  amount: 1000,
  returnUrl: "https://localhost/success"
};

Class("WebPayPlusGateway", {
  STATUS_AUTHORIZED: "AUTHORIZED",
  submitIntermediateForm({
    token,
    url
  }) {
    return `
    <form method="post" action="${url}">
      <input name="token_ws" type="hidden" value="${token}" />
    </form>
    `;
  },

  initTransaction({
    orderId,
    sessionId,
    amount,
    returnUrl
  }) {
    return (async function() {
      const webpayClient = New(WebpayPlusClient).client;
      const response = await webpayClient.Transaction.create(orderId, sessionId, amount, returnUrl);
      return response;
    })();
  },

  confirmTransaction(token) {
    return (async function() {
      const webpayClient = New(WebpayPlusClient).client;
      const response = await webpayClient.Transaction.commit(token);
      return response;
    })();
  },

  saveTxConfirmation({
    vci,
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
    return new Promise ((resolve, reject) => {
        resolve({
          vci,
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
    });
  },

  result_data(formData) {
    return formData.toString().split("&").map ( v=> v.split("=") ).map(v=> {return {[v[0]]:v[1]};} ).reduce((o1,o2)=>Object.assign(o1,o2));
  },

  resultURL_route({token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION}) {
    let instance = this;
    return new Promise ( (resolve, reject) => {
      let _promise_;
      if (typeof token_ws !== "undefined") {
        logger.debug("Sending confirmation of the transaction...");
        logger.debug(`token=${token_ws}`);
        _promise_ = instance.confirmTransaction(token_ws).then((response) => {
          logger.debug ("Transaction was confirmed!");
          logger.debug ("Saving data...");
          resolve(response);
        }).catch (e=> {
          logger.debug ("Transaction was rejected.");
          console.log(e);
        });
      } else {
        logger.debug("Transaction was rejected...");
        logger.debug(`orderId=${TBK_ORDEN_COMPRA}`);
        logger.debug(`sessionId=${TBK_ID_SESION}`);
        logger.debug(`token=${TBK_TOKEN}`);
        reject({
          message: "Transaction rejected",
          orderId: TBK_ORDEN_COMPRA,
          sessionId: TBK_ID_SESION,
          token: TBK_TOKEN
        });
      }
      return _promise_;
    });
  }

});
