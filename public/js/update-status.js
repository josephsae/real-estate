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

/***/ "./src/js/update-status.js":
/*!*********************************!*\
  !*** ./src/js/update-status.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\n    const updateStatus = document.querySelectorAll(\".update-status\");\n    const token = document.querySelector(\"meta[name='csrf-token']\").getAttribute(\"content\")\n\n    updateStatus.forEach(button => {\n        button.addEventListener(\"click\", updatePropertyStatus)\n    });\n\n    async function updatePropertyStatus(event) {\n        const { propertyId } = event.target.dataset;\n\n        try {\n            const url = `/properties/${propertyId}`;\n            const response = await fetch(url, {\n                method: \"PUT\",\n                headers: {\n                    \"CSRF-Token\": token\n                }\n            });\n\n            const result = await response.json();\n\n            if (result) {\n                if (event.target.classList.contains(\"bg-yellow-100\")) {\n                    event.target.classList.add(\"bg-green-100\", \"text-green-800\");\n                    event.target.classList.remove(\"bg-yellow-100\", \"text-yellow-800\");\n                    event.target.textContent = \"Published\";\n                } else {\n                    event.target.classList.add(\"bg-yellow-100\", \"text-yellow-800\");\n                    event.target.classList.remove(\"bg-green-100\", \"text-green-800\");\n                    event.target.textContent = \"Not published\";\n                }\n            }\n\n            console.log(result);\n        } catch (error) {\n            console.log(\"error\");\n        }\n    }\n\n})()\n\n//# sourceURL=webpack://real-estate/./src/js/update-status.js?");

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
/******/ 	__webpack_modules__["./src/js/update-status.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;