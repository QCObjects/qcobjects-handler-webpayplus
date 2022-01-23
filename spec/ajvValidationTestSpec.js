#!/usr/bin/env node
/* eslint-disable no-undef */

describe("QCObjects AJV JSON Schema Test", function () {
  require("qcobjects");
  // eslint-disable-next-line no-unused-vars
  var originalTimeout;

  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });  

  it("QCObjects AJV JSON Schema Test Spec", function () {
    const path = require("path");
    const absolutePath = path.resolve(__dirname, "./");
  
    require ("qcobjects");
    Import (absolutePath +"/../backend/js/packages/com.qcobjects.json_validator");
  
    const schema = require(absolutePath + "/../backend/schema/order.schema.json");
    const data = require(absolutePath + "/../backend/schema/order0.example.json");
  
    JSONValidator.validateData(schema, data)
    .then ((response) => {
      console.log(response);
      expect(response.isValid).toEqual(true);
    });
  
  });

});
