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

Import ("com.qcobjects.webpayplus.settings");
Import ("com.qcobjects.webpayplus.gateway");

Package("com.qcobjects.webpayplus.inittransaction", [
  Class ("Microservice",BackendMicroservice,{
    finishWithBody (stream) {
      try {
        stream.write(this.body);
        stream.end();
      } catch (e) {
        logger.debug("Something wrong writing the response for microservice" + e.toString());
      }
    },
    post (formData){
      try {
        logger.debugEnabled = true;
        var microservice = this;
        var data = JSON.parse(formData.toString());
        data.sessionId = data.id;
        data.returnUrl = `${CONFIG.get("webpayplus").returnUrl}`;
        var webpayGateway = New(WebPayPlusGateway);

        webpayGateway.initTransaction(data).then((response) => {
          return webpayGateway.submitIntermediateForm(response);
        }).then ((response)=> {
          microservice.body = response;
          microservice.done();
        }).catch(e => {
          logger.debug(e.toString());
        });
      } catch (e){
        logger.debug(e.toString());
      }
    }
  })
]);
Package("qcobjects-handler-webpayplus/api/com.qcobjects.webpayplus.inittransaction", Package("com.qcobjects.webpayplus.inittransaction"));
