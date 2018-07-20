"use strict";
const assert = require('assert');
const log = require('../');
const LambdaLog = require('../lib/LambdaLog');

describe('Module', function() {
    it('should return a new instance', function() {
        assert(log instanceof LambdaLog);
    });
    
    it('should have access to uninstantiated class', function() {
        assert(log.LambdaLog === LambdaLog);
    });
});
