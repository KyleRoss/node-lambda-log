"use strict";
const assert = require('assert');
const LambdaLog = require('../lib/LambdaLog');
const LogMessage = require('../lib/LogMessage');


describe('LambdaLog', function() {
    describe('Constructor', function() {
        it('should have default options', () => {
            let log = new LambdaLog();
            
            assert(typeof log.options.meta === 'object');
            assert(Array.isArray(log.options.tags) && log.options.tags.length === 0);
            assert(log.options.dynamicMeta === null);
            assert(log.options.debug === false);
            assert(log.options.dev === false);
            assert(log.options.silent === false);
            assert(log.options.replacer === null);
            assert(log.options.logHandler === console);
        });
        
        it('should override default options', () => {
            let log = new LambdaLog({
                meta: { test: true },
                tags: ['test'],
                dynamicMeta: function() { /*empty*/ },
                silent: true
            });
            
            assert(log.options.meta.test === true);
            assert(log.options.tags.length === 1 && log.options.tags[0] === 'test');
            assert(typeof log.options.dynamicMeta === 'function');
            assert(log.options.silent === true);
        });
        
        describe('LAMBDALOG_SILENT', function () {
            let oldVal;
            beforeEach(function () {
                oldVal = process.env.LAMBDALOG_SILENT;
            });

            afterEach(function () {
                process.env.LAMBDALOG_SILENT = oldVal;
            });

            it('should be true for "1"', function () {
                process.env.LAMBDALOG_SILENT = '1';
                assert(new LambdaLog().options.silent);
            });

            it('should be true for "true"', function () {
                process.env.LAMBDALOG_SILENT = true;
                assert(new LambdaLog().options.silent);
            });

            it('should be true for any truthy string', function () {
                process.env.LAMBDALOG_SILENT = 'foo';
                assert(new LambdaLog().options.silent);
            });

            it('should be false if not defined', function () {
                delete process.env.LAMBDALOG_SILENT;
                assert(!new LambdaLog().options.silent);
            });

            it('should be false if "0"', function () {
                process.env.LAMBDALOG_SILENT = '0';
                assert(!new LambdaLog().options.silent);
            });

            it('should be false for "false"', function () {
                process.env.LAMBDALOG_SILENT = 'false';
                assert(!new LambdaLog().options.silent);
            })
        });

        describe('Log Levels', function() {
            describe('Default', () => {
                let log = new LambdaLog();
                
                it('should have default log levels', () => {
                    assert(typeof log._logLevels === 'object');
                    assert(log._logLevels.info === 'info');
                    assert(log._logLevels.warn === 'warn');
                    assert(log._logLevels.error === 'error');
                    assert(typeof log._logLevels.debug === 'function');
                });
                
                it('should have array of log levels', () => {
                    assert(Array.isArray(log._levels));
                    assert(log._levels.length === 4);
                });
                
                it('should include custom log levels', () => {
                    let log = new LambdaLog({}, { test: 'log' });
                    assert(log._logLevels.test === 'log');
                });
            });
            
            describe('Custom', () => {
                let log = new LambdaLog({}, {
                    info: 'log',
                    fatal: 'error',
                    rainbow: function() { /*empty*/ }
                });
                
                it('should overwrite and concatenate new log levels', () => {
                    assert(typeof log._logLevels === 'object');
                    assert(log._logLevels.info === 'log');
                    assert(log._logLevels.warn === 'warn');
                    assert(log._logLevels.error === 'error');
                    assert(log._logLevels.fatal === 'error');
                    assert(typeof log._logLevels.debug === 'function');
                    assert(typeof log._logLevels.rainbow === 'function');
                });
                
                it('should have array of log levels', () => {
                    assert(Array.isArray(log._levels));
                    assert(log._levels.length === 6);
                });
                
                it('should create custom levels as methods', () => {
                    assert(typeof log.fatal === 'function');
                    assert(typeof log.rainbow === 'function');
                });
            });
        });
    });
    
    describe('Properties', function() {
        let log = new LambdaLog();
        
        it('should have options', function() {
            assert(log.options);
            assert.equal(typeof log.options, 'object');
        });

        it('should have access to LambdaLog', function() {
            assert(log.LambdaLog);
        });
        
        it('should have access to LogMessage', function() {
            assert(log.LogMessage);
        });
        
        it('should have _logLevels', () => {
            assert(typeof log._logLevels === 'object');
        });
        
        it('should have _levels', () => {
            assert(Array.isArray(log._levels));
        });
    });

    describe('Methods', function() {
        let log = new LambdaLog({
            meta: { test: true },
            dynamicMeta: function() {
                return { timestamp: new Date().toISOString() };
            },
            tags: ['test'],
            silent: true
        });
        
        describe('log()', function() {
            it('should have log method', function() {
                assert(typeof log.log, 'function');
            });

            it('should return LogMessage instance', function() {
                let logData = log.log('info', 'Test log');
                assert(logData instanceof LogMessage);
                assert.equal(logData.msg, 'Test log');
            });
            
            it('should log json to the console', function(done) {
                log.console = {
                    info: function(json) {
                        log.options.silent = true;
                        log.console = console;
                        
                        assert.ok(JSON.parse(json));
                        
                        done();
                    }
                };
                
                log.options.silent = false;
                log.log('info', 'test');
            });
            
            it('should throw error with invalid level provided', function() {
                assert.throws(function() {
                    log.log('random', 'Test invalid level');
                }, function(err) {
                    if((err instanceof Error) && err.message === '"random" is not a valid log level') return true;
                });
            });

            it('should aceept and parse Error object', function() {
                let err = new Error('Test error'),
                    logData = log.log('error', err);

                assert.equal(logData.msg, 'Test error');
                assert(logData.meta.stack);
            });

            it('should have default tags', function() {
                let logData = log.log('error', 'Test tags');
                assert(Array.isArray(logData.tags));
                assert(logData.tags.indexOf('log') !== -1);
                assert(logData.tags.indexOf('error') !== -1);
            });
            
            it('should have global tags from options', function() {
                let logData = log.log('error', 'Test tags');
                assert(logData.tags.indexOf('test') !== -1);
            });
            
            it('should have tags from log method', function() {
                let logData = log.log('error', 'Test tags', {}, ['hello']);
                assert(logData.tags.indexOf('hello') !== -1);
            });

            it('should contain custom meta', function() {
                let logData = log.log('error', 'Test meta', { hello: 'world', arr: [], num: 32 });
                assert.equal(logData.meta.hello, 'world');
                assert(Array.isArray(logData.meta.arr));
                assert.equal(logData.meta.num, 32);
            });

            it('should contain global meta from options', function() {
                let logData = log.log('error', 'Test meta', { hello: 'world' });
                assert.equal(logData.meta.hello, 'world');
                assert(logData.meta.test === true);
            });

            it('should have logLevel', function() {
                let logData = log.log('error', 'Test log level');
                assert.equal(logData.level, 'error');
            });

            it('should not throw for circular objects', function() {
                const circularObj = {};
                circularObj.circularRef = circularObj;
                circularObj.list = [circularObj, circularObj];
                assert.doesNotThrow(function() {
                    log.log('error', circularObj);
                });
            });
        });

        describe('info()', function() {
            it('should have info method', function() {
                assert(typeof log.info, 'function');
            });

            it('should set the correct level', function() {
                let logData = log.info('Test log level');
                assert(logData.tags.indexOf('info') !== -1);
                assert.equal(logData.level, 'info');
            });
        });

        describe('warn()', function() {
            it('should have warn method', function() {
                assert(typeof log.warn, 'function');
            });

            it('should set the correct level', function() {
                let logData = log.warn('Test log level');
                assert(logData.tags.indexOf('warn') !== -1);
                assert.equal(logData.level, 'warn');
            });
        });

        describe('error()', function() {
            it('should have error method', function() {
                assert(typeof log.error, 'function');
            });

            it('should set the correct level', function() {
                let logData = log.error('Test log level');
                assert(logData.tags.indexOf('error') !== -1);
                assert.equal(logData.level, 'error');
            });
        });

        describe('debug()', function() {
            it('should have debug method', function() {
                assert(typeof log.debug, 'function');
            });

            it('should set the correct level', function() {
                log.options.debug = true;
                let logData = log.debug('Test log level');
                assert(logData.tags.indexOf('debug') !== -1);
                assert.equal(logData.level, 'debug');
            });

            it('should return false with debug disabled', function() {
                log.options.debug = false;
                let logData = log.debug('Test debug mode');
                assert.equal(logData, false);
            });
        });

        describe('assert()', function() {
            it('should have assert method', function() {
                assert(typeof log.assert, 'function');
            });

            it('should return false for a truthy value', function() {
                let logData = log.assert(true, 'Test assert');
                assert.equal(logData, false);
            });

            it('should return log message for a falsy value', function() {
                let logData = log.assert(false, 'Test assert');
                assert.equal(logData.msg, 'Test assert');
            });

            it('should set the correct level', function() {
                let logData = log.assert(false, 'Test assert');
                assert(logData.tags.indexOf('error') !== -1);
                assert.equal(logData.level, 'error');
            });
        });
        
        describe('result()', function() {
            it('should have result method', function() {
                assert.equal(typeof log.result, 'function');
            });

            it('should return a promise', function() {
                let promise = new Promise(resolve => resolve('test')),
                    res = log.result(promise);
                assert.equal(typeof res.then, 'function');
            });
            
            it('should throw an error when a promise is not provided', function() {
                assert.throws(function() {
                    log.result();
                }, function(err) {
                    if((err instanceof Error) && err.message === 'A promise must be provided as the first argument') return true;
                });
            });
            
            it('should throw an error when a non-valid promise is provided', function() {
                assert.throws(function() {
                    log.result({});
                }, function(err) {
                    if((err instanceof Error) && err.message === 'A promise must be provided as the first argument') return true;
                });
            });
            
            it('should return a promise the resolves with log message', function(done) {
                let promise = new Promise(resolve => resolve('test')),
                    res = log.result(promise);
                
                res.then(logData => {
                    assert.equal(logData.msg, 'test');
                    done();
                });
            });

            it('should set the level to info on resolve', function(done) {
                let promise = new Promise(resolve => resolve('test')),
                    res = log.result(promise);
                
                res.then(logData => {
                    assert.equal(logData.level, 'info');
                    done();
                });
            });
            
            it('should set the level to error on rejection', function(done) {
                let promise = new Promise((resolve, reject) => reject('test')),
                    res = log.result(promise);
                
                res.then(logData => {
                    assert.equal(logData.level, 'error');
                    done();
                });
            });
        });
    });

    describe('Events', function() {
        let log = new LambdaLog({ silent: true });
        
        it('should have event emitter methods', function() {
            assert(typeof log.emit, 'function');
            assert(typeof log.on, 'function');
        });

        it('should emit event on log', function(done) {
            log.once('log', function() {
                assert.ok(true);
                done();
            });

            log.log('info', 'Test event');
        });

        it('should emit event on log and provide LogMessage instance', function(done) {
            log.once('log', function(data) {
                assert(data instanceof LogMessage);
                done();
            });

            log.log('info', 'Test event data');
        });
    });
});
