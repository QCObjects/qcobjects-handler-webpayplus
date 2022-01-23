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

const Environment = require("transbank-sdk").Environment;
const WebpayPlus = require("transbank-sdk").WebpayPlus;

Class ("WebpayPlusClient", {
    client: null,
    _new_ (){
      WebpayPlus.commerceCode = CONFIG.get("webpayplus").commerceCode;
      WebpayPlus.apiKey = CONFIG.get("webpayplus").apiKey;
      WebpayPlus.environment = Environment[CONFIG.get("webpayplus").Environment];
      this.client = WebpayPlus;
    }
});
