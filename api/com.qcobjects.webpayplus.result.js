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
const fs = require("fs");
const path = require("path");
const absolutePath = path.resolve(__dirname, "./");
const templatesPath = path.resolve(absolutePath, "../../templates/") + "/";


Import ("com.qcobjects.webpayplus.settings");
Import ("com.qcobjects.webpayplus.gateway");

Package("com.qcobjects.webpayplus.result", [
  Class ("Microservice",BackendMicroservice,{
    finishWithBody (stream) {
      try {
        stream.write(this.body);
        stream.end();
      } catch (e) {
        logger.debug("Something wrong writing the response for microservice" + e.toString());
      }
    },

    buildComponent (responseData) {
      let microservice = this;
      let promise = New (Component, {
        name: "index",
        cached: false,
        data: Object.assign({origin:`https://${microservice.domain}:${CONFIG.get("serverPortHTTPS")}`}, responseData),
        basePath: templatesPath,
        templateURI: "webpay-result.html",
        done ({req, component}){
          return Promise.resolve({request, component});
        }
      })
      .__promise__.catch ( e => console.log (e));
      promise.then(response => {
        microservice.body = response.component.parsedAssignmentText;
        microservice.done();
      });

    },

    post (formData){
      try {
        logger.debugEnabled = true;
        var microservice = this;
        console.log("RESULT DATA...");
        console.log(formData.toString());
        var webpayGateway = New(WebPayPlusGateway);
        var data = webpayGateway.result_data(formData);
        webpayGateway.resultURL_route(data).then((response) => {
          return response;
        }).then ((response)=> {
          console.log("data from result");
          console.log(response);
          microservice.buildComponent(response);
        }).catch(e => {
          logger.debug(e.toString());
          microservice.body = {status: e.toString()};
          microservice.done();
        });
      } catch (e){
        logger.debug(e.toString());
      }
    }
  })
]);
