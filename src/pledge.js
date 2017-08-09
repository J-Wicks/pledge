'use strict';

/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function isFunc (maybeFunc) {
  return typeof maybeFunc === 'function';
}

class $Promise {
  constructor (executor) {
    this._state = 'pending';
    if (isFunc(executor)) {
      executor(this._internalResolve.bind(this), this._internalReject.bind(this));
    } else throw new TypeError('executor is not a function');
  }

  _internalResolve (data) {
    if (this._state !== 'pending') return;
    this._state = 'fulfilled';
    this._value = data;
    this._callHandlers();
    return data;
  }
  _internalReject (reason) {
    if (this._state !== 'pending') return;
    this._state = 'rejected';
    this._value = reason;
    this._callHandlers();
    return reason;
  }

  catch (errorCb) {
    return this.then(null, errorCb);
  }

  then (successCb, errorCb) {
    const newPromise = new $Promise(() => {});
    const callBacks = [successCb, errorCb].map(callback => isFunc(callback) ? callback : null);
    this._handlerGroups = this._handlerGroups || [];
    this._handlerGroups.push({
      successCb: callBacks[0],
      errorCb: callBacks[1],
      downstreamPromise: newPromise,
    });
    this._callHandlers();
    return newPromise;
  }

  _callHandlers () {
    while (this._state !== 'pending' && this._handlerGroups && this._handlerGroups.length) {
      const thisHandler = this._handlerGroups.shift();
      const handlerToUse = this._state === 'fulfilled' ? 'successCb' : 'errorCb';
      if (isFunc(thisHandler[handlerToUse])) {
        try {
          const retVal = thisHandler[handlerToUse](this._value);
          if (retVal instanceof $Promise) {
            retVal.then(
              thisHandler.downstreamPromise._internalResolve.bind(thisHandler.downstreamPromise),
              thisHandler.downstreamPromise._internalReject.bind(thisHandler.downstreamPromise),
            );
          } else thisHandler.downstreamPromise._internalResolve(retVal);
        } catch (err) {
          thisHandler.downstreamPromise._internalReject(err);
        }
      } else if (handlerToUse === 'errorCb') {
        thisHandler.downstreamPromise._internalReject(this._value);
      } else if (handlerToUse === 'successCb') {
        thisHandler.downstreamPromise._internalResolve(this._value);
      }
    }
  }
}
/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
