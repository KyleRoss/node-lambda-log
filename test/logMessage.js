"use strict";
const assert = require('assert');
const LogMessage = require('../lib/LogMessage');

const logMsg = new LogMessage({
    level: 'error',
    msg: new Error('Test'),
    meta: { hello: 'world', arr: [1, 2, 3] },
    tags: ['test']
}, {
    meta: { test: true },
    tags: ['test'],
    dynamicMeta: function() {
        return {
            timestamp: new Date().toISOString()
        };
    },
    replacer: function(key, value) {
        if(key === 'ssn') {
            return `${value.substr(0, 3)}-**-****`;
        }
        return value;
    },
    silent: true
});

describe('LogMessage', () => {
    describe('Constructor', () => {
        it('should create instance of LogMessage', () => {
            assert(logMsg instanceof LogMessage);
        });
        
        it('should create a meta object', () => {
            let logMsgMeta = new LogMessage({
                level: 'error',
                msg: new Error('Test'),
                meta: 'test',
                tags: ['test']
            }, { tags: [] });
            
            assert(typeof logMsgMeta.meta === 'object');
        });
        
        it('should combine global metadata with local metadata', () => {
            let logMsgMeta = new LogMessage({
                level: 'error',
                msg: new Error('Test'),
                meta: { test: true },
                tags: ['test']
            }, { meta: { global: true }, tags: [] });
            
            assert(logMsgMeta.meta.test === true);
            assert(logMsgMeta.meta.global === true);
        });
    });
    
    describe('Properties', () => {
        it('should have level', () => {
            assert(typeof logMsg.level === 'string');
            assert(logMsg.level === 'error');
        });
        
        it('should have meta', () => {
            assert(typeof logMsg.meta === 'object');
        });
        
        it('should have tags', () => {
            assert(Array.isArray(logMsg.tags));
        });
        
        it('should have msg', () => {
            assert(typeof logMsg.msg === 'string');
        });
        
        it('should have _error', () => {
            assert(logMsg._error instanceof Error);
        });
        
        it('should have _replacer', () => {
            assert(typeof logMsg._replacer === 'function');
        });
    });
    
    describe('Methods', () => {
        describe('toJSON()', () => {
            it('should have toJSON() method', () => {
                assert(typeof logMsg.toJSON === 'function');
            });
            
            it('should return json (string)', () => {
                assert(typeof logMsg.toJSON() === 'string');
            });
            
            it('should return valid json', () => {
                assert(JSON.parse(logMsg.toJSON()));
            });
            
            it('should format json', () => {
                assert(logMsg.toJSON(true).match(/\n/gm) !== null);
            });
            
            it('should replace values with a _replacer function', () => {
                logMsg.meta.ssn = '555-66-7777';
                let json = JSON.parse(logMsg.toJSON());
                
                assert(json.ssn === '555-**-****');
            });
        });
    });
    
    describe('Getters', () => {
        describe('value', () => {
            it('should return object', () => {
                assert(typeof logMsg.value === 'object');
            });
            
            it('should have base properties', () => {
                let val = logMsg.value;
                
                assert(val._logLevel === logMsg.level);
                assert(val.msg === logMsg.msg);
                assert(Array.isArray(val._tags));
            });
        });
        
        describe('log', () => {
            it('should return object', () => {
                assert(typeof logMsg.log === 'object');
            });

            it('should equal value', () => {
                assert.deepStrictEqual(logMsg.log, logMsg.value);
            });
        });
        
        describe('throw', () => {
            it('should throw error', () => {
                assert.throws(() => {
                    logMsg.throw;
                });
            });
            
            it('should create an error if one is not provided', () => {
                let logMsgPlain = new LogMessage({
                    level: 'error',
                    msg: 'Test',
                    meta: { test: true },
                    tags: ['test']
                }, { meta: { global: true }, tags: [] });
                
                assert.throws(() => {
                    logMsgPlain.throw;
                }, function(err) {
                    if((err instanceof Error) && err.message === 'Test') return true;
                });
            });
        });
    });
    
    describe('Statics', function() {
        describe('isError()', function() {
            it('should have static method', function() {
                assert.equal(typeof LogMessage.isError, 'function');
            });

            it('should return true for Error and Error-like objects', function() {
                let err = new Error('Test Error'),
                    typeErr = new TypeError('Test Type Error'),
                    errLike = {
                        message: 'Error-like object',
                        stack: 'Some stack trace'
                    };

                assert(LogMessage.isError(err));
                assert(LogMessage.isError(typeErr));
                assert(LogMessage.isError(errLike));
            });

            it('should return false for everything else', function() {
                assert(!LogMessage.isError(null));
                assert(!LogMessage.isError());
                assert(!LogMessage.isError({}));
                assert(!LogMessage.isError([]));
                assert(!LogMessage.isError('test'));
                assert(!LogMessage.isError(32));
                assert(!LogMessage.isError(true));
                assert(!LogMessage.isError(false));
            });
        });
    });
});
