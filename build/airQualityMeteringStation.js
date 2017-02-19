/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("./config");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_json__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__config_json__);


const getReadings = () => {
  return {
    sds011: {
      PM25: 2.5,
      PM10: 10
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = getReadings;


const collectData = () => {
  console.log(`Collecting data from ${__WEBPACK_IMPORTED_MODULE_0__config_json___default.a.devices[0].name}", port: ${__WEBPACK_IMPORTED_MODULE_0__config_json___default.a.devices[0].port}`)
}
/* harmony export (immutable) */ __webpack_exports__["b"] = collectData;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__meter_airQualityMeter__ = __webpack_require__(1);



const app = __WEBPACK_IMPORTED_MODULE_0_express___default()()
let server = null

app.get('/v1/readings', (reqest, response) => {
  const readings = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__meter_airQualityMeter__["a" /* getReadings */])()
  response.end(JSON.stringify(readings))
})

const startServer = () => {
  if (server !== null) { return }

  server = app.listen(8080, () => {
    console.log(`Example app listening at http://${server.address().address}:${server.address().port}`)
  })
}
/* harmony export (immutable) */ __webpack_exports__["a"] = startServer;


const stopServer = () => {
  if (server === null) { return }
  server.close()
}
/* unused harmony export stopServer */



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_node_schedule__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_node_schedule___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_node_schedule__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__meter_airQualityMeter__ = __webpack_require__(1);




let job = null

const startScheduler = () => {
  if (job !== null) { return }
  console.log('Start collecting data')
  job = __WEBPACK_IMPORTED_MODULE_0_node_schedule___default.a.scheduleJob('*/10 * * * * *', () => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__meter_airQualityMeter__["b" /* collectData */])())
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__meter_airQualityMeter__["b" /* collectData */])()
}
/* harmony export (immutable) */ __webpack_exports__["a"] = startScheduler;


const stopScheduler = () => {
  if (job === null) { return }
  job.cancel()
}
/* unused harmony export stopScheduler */



/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("node-schedule");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_readingsScheduler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_apiServer__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_json__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_json___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__config_json__);




console.log(`Device "${__WEBPACK_IMPORTED_MODULE_2__config_json___default.a.devices[0].name}", port: ${__WEBPACK_IMPORTED_MODULE_2__config_json___default.a.devices[0].port}`)
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scheduler_readingsScheduler__["a" /* startScheduler */])()
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__api_apiServer__["a" /* startServer */])()



/***/ })
/******/ ]);
//# sourceMappingURL=airQualityMeteringStation.js.map