/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/map.js":
/*!***********************!*\
  !*** ./src/js/map.js ***!
  \***********************/
// eslint-disable-next-line no-unused-vars
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* eslint-disable no-undef */\n(function() {\n    const lat = 4.5848455;\n    const lng = -74.155303;\n    const mapa = L.map('mapa').setView([lat, lng ], 16);\n    let marker;\n    // Permite utilizar un provider y un geocoder para obtener la información de la calle ubicada con el pin\n    const geocodeService = L.esri.Geocoding.geocodeService();\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    // Implementación del pin de ubicación\n    marker = new L.marker([lat, lng], {\n        draggable: true,\n        autoPan: true\n    })\n    .addTo(mapa);\n\n    // Detección del movimiento del pin\n    marker.on('moveend', function(event) {\n        marker = event.target;\n        const position = marker.getLatLng();\n        mapa.panTo(new L.LatLng(position.lat, position.lng));\n\n        // Obtener la información de la calle tan pronto se suelta el pin\n        geocodeService.reverse().latlng(position, 16).run(function (error, result) {\n            \n            // Información de la ubicación del pin\n            marker.bindPopup(result.address.LongLabel);\n\n            // Llenado de los campos ocultos del mapa\n            document.querySelector('.street').textContent = result?.address?.Address ?? '';\n            document.querySelector('#street').value = result?.address?.Address ?? '';\n            document.querySelector('#lat').value = result?.latlng?.lat ?? '';\n            document.querySelector('#lng').value = result?.latlng?.lng ?? '';\n        })\n    });\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/map.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;