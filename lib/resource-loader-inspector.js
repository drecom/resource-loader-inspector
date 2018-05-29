(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["resource-loader-inspector"] = factory();
	else
		root["resource-loader-inspector"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _middleware__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./middleware */ "./src/middleware/index.ts");

/**
 * ResourceLoaderInspector<br />
 * is an inspector for <a href='https://github.com/englercj/resource-loader/'>resource-loader</a>
 * developed by <a href='https://github.com/englercj'>englercj</a>.<br />
 * ResourceLoaderInspector proveides its inspecting processes as loader middleware
 * and it enables to collect resource data size and resource amount.
 */
var ResourceLoaderInspector = /** @class */ (function () {
    function ResourceLoaderInspector() {
    }
    /**
     * Once loader is passed to this method, on time resource info retrieval is began.<br />
     * The second argument indicates use of HEAD request
     * since resource-loader uses browser api such as Image and Video
     * those don't have data size information on it's instance.<br />
     * Retrieved data is stored to augmented property inspectorSummary of loader instance.
     */
    ResourceLoaderInspector.attach = function (loader, headRequest) {
        if (headRequest === void 0) { headRequest = true; }
        loader.inspector = ResourceLoaderInspector.defaultInspectorProperty;
        ResourceLoaderInspector.registerMiddlewares(loader, headRequest);
    };
    /**
     * It returns object that has exactly same schema with loader.inspector.summary.<br />
     * Resource summary is retrieved from existing resource properties.<br />
     * It means no additional retrieval such as http HEAD request will occur in this method.<br />
     * Note that calcurated summary is not stored to given loader instance.<br />
     */
    ResourceLoaderInspector.snapshot = function (loader) {
        var summary = {
            totalContentLength: 0,
            resourceCount: 0,
            contentLengthUnknown: 0
        };
        var resourceKeys = Object.keys(loader.resources);
        summary.resourceCount = resourceKeys.length;
        for (var i = 0; i < summary.resourceCount; i++) {
            var resource = loader.resources[resourceKeys[i]];
            if (!resource.inspector) {
                summary.contentLengthUnknown++;
            }
            else {
                var contentLength = resource.inspector.contentLength;
                if (contentLength !== undefined) {
                    summary.totalContentLength += contentLength;
                }
                else {
                    summary.contentLengthUnknown++;
                }
            }
        }
        return summary;
    };
    /**
     * It recollects resource info from resources property of given loader instance.<br />
     * This API is used when resource data is reset
     * or whenever it is suspected not keeping atomicity beteen summary and resource data.<br />
     * Collected info is stored to inspector.summary property of loader instance.
     */
    ResourceLoaderInspector.recollect = function (loader, headRequest) {
        if (headRequest === void 0) { headRequest = true; }
        var defaultInspector = ResourceLoaderInspector.defaultInspectorProperty;
        if (!loader.inspector) {
            loader.inspector = defaultInspector;
        }
        var summary = defaultInspector.summary;
        var resourceKeys = Object.keys(loader.resources);
        summary.resourceCount = resourceKeys.length;
        for (var i = 0; i < summary.resourceCount; i++) {
            var resource = loader.resources[resourceKeys[i]];
            if (!resource.inspector) {
                summary.contentLengthUnknown++;
                continue;
            }
            var contentLength = resource.inspector.contentLength;
            if (contentLength) {
                summary.totalContentLength += contentLength;
                continue;
            }
            if (headRequest) {
                _middleware__WEBPACK_IMPORTED_MODULE_0__["requestResourceSize"].call(loader, resource, function () { });
                continue;
            }
            summary.contentLengthUnknown++;
        }
        loader.inspector.summary = summary;
    };
    Object.defineProperty(ResourceLoaderInspector, "defaultInspectorProperty", {
        /**
         * Returns default inspector object for loader instance.
         */
        get: function () {
            return {
                summary: {
                    totalContentLength: 0,
                    resourceCount: 0,
                    contentLengthUnknown: 0
                },
                hasMiddleware: false
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Registeres middlewares for resource-loader.<br />
     */
    ResourceLoaderInspector.registerMiddlewares = function (loader, headRequest) {
        if (headRequest === void 0) { headRequest = true; }
        if (!loader.inspector) {
            throw new Error('loader is not initialized');
        }
        if (loader.inspector.hasMiddleware) {
            return;
        }
        loader.pre(_middleware__WEBPACK_IMPORTED_MODULE_0__["setInspectorProperty"]);
        loader.pre(_middleware__WEBPACK_IMPORTED_MODULE_0__["markLoaded"]);
        loader.use(_middleware__WEBPACK_IMPORTED_MODULE_0__["addXhrContentLength"]);
        loader.use(_middleware__WEBPACK_IMPORTED_MODULE_0__["incrementResourceCount"]);
        if (headRequest) {
            loader.use(_middleware__WEBPACK_IMPORTED_MODULE_0__["requestResourceSize"]);
        }
        loader.inspector.hasMiddleware = true;
    };
    return ResourceLoaderInspector;
}());
/* harmony default export */ __webpack_exports__["default"] = (ResourceLoaderInspector);


/***/ }),

/***/ "./src/middleware/add_xhr_content_length.ts":
/*!**************************************************!*\
  !*** ./src/middleware/add_xhr_content_length.ts ***!
  \**************************************************/
/*! exports provided: addXhrContentLength */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addXhrContentLength", function() { return addXhrContentLength; });
/**
 * Retrieve content length from xhr and store the value
 * to resource and loader.inspectorSummary<br />
 * This middleware only works for loader that have valid xhr property.
 */
var addXhrContentLength = function addXhrContentLength(resource, next) {
    if (!this.xhr) {
        next();
        return;
    }
    var contentLength = this.xhr.getResponseHeader('Content-Length');
    // getResponseHeader may return null
    if (!contentLength) {
        next();
        return;
    }
    var contentLengthInt = parseInt(contentLength, 10);
    if (resource.inspector) {
        if (resource.inspector.alreadyLoaded) {
            next();
            return;
        }
        resource.inspector.contentLength = contentLengthInt;
    }
    if (this.inspector) {
        this.inspector.summary.totalContentLength += contentLengthInt;
    }
    next();
};



/***/ }),

/***/ "./src/middleware/increment_resource_count.ts":
/*!****************************************************!*\
  !*** ./src/middleware/increment_resource_count.ts ***!
  \****************************************************/
/*! exports provided: incrementResourceCount */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "incrementResourceCount", function() { return incrementResourceCount; });
/**
 * Increments resource count.
 */
var incrementResourceCount = function incrementResourceCount(resource, next) {
    if (resource.inspector && resource.inspector.alreadyLoaded) {
        next();
        return;
    }
    if (this.inspector) {
        this.inspector.summary.resourceCount++;
    }
    next();
};



/***/ }),

/***/ "./src/middleware/index.ts":
/*!*********************************!*\
  !*** ./src/middleware/index.ts ***!
  \*********************************/
/*! exports provided: setInspectorProperty, markLoaded, incrementResourceCount, addXhrContentLength, requestResourceSize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _set_inspector_property__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./set_inspector_property */ "./src/middleware/set_inspector_property.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setInspectorProperty", function() { return _set_inspector_property__WEBPACK_IMPORTED_MODULE_0__["setInspectorProperty"]; });

/* harmony import */ var _mark_loaded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mark_loaded */ "./src/middleware/mark_loaded.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "markLoaded", function() { return _mark_loaded__WEBPACK_IMPORTED_MODULE_1__["markLoaded"]; });

/* harmony import */ var _increment_resource_count__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./increment_resource_count */ "./src/middleware/increment_resource_count.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "incrementResourceCount", function() { return _increment_resource_count__WEBPACK_IMPORTED_MODULE_2__["incrementResourceCount"]; });

/* harmony import */ var _add_xhr_content_length__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./add_xhr_content_length */ "./src/middleware/add_xhr_content_length.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addXhrContentLength", function() { return _add_xhr_content_length__WEBPACK_IMPORTED_MODULE_3__["addXhrContentLength"]; });

/* harmony import */ var _request_resource_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./request_resource_size */ "./src/middleware/request_resource_size.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "requestResourceSize", function() { return _request_resource_size__WEBPACK_IMPORTED_MODULE_4__["requestResourceSize"]; });








/***/ }),

/***/ "./src/middleware/mark_loaded.ts":
/*!***************************************!*\
  !*** ./src/middleware/mark_loaded.ts ***!
  \***************************************/
/*! exports provided: markLoaded */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "markLoaded", function() { return markLoaded; });
/**
 * Mark resource with loaded status.<br />
 * Usually duplicate resource loading is guarded by resource-loader itself.<br />
 * TODO: consider remove this and let users have responsibility for custom loader.
 */
var markLoaded = function markLoaded(resource, next) {
    if (resource.inspector) {
        resource.inspector.alreadyLoaded = !!resource.data;
    }
    next();
};



/***/ }),

/***/ "./src/middleware/request_resource_size.ts":
/*!*************************************************!*\
  !*** ./src/middleware/request_resource_size.ts ***!
  \*************************************************/
/*! exports provided: requestResourceSize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requestResourceSize", function() { return requestResourceSize; });
/**
 * Requests resource size using HEAD method for resources not retrieved via XHR.
 */
var requestResourceSize = function requestResourceSize(resource, next) {
    var _this = this;
    if (resource.inspector && resource.inspector.alreadyLoaded) {
        next();
        return;
    }
    if (this.xhr) {
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', resource.url, true);
    xhr.addEventListener('load', function () {
        var contentLength = xhr.getResponseHeader('Content-Length');
        // getResponseHeader may return null
        if (!contentLength) {
            return;
        }
        var contentLengthInt = parseInt(contentLength, 10);
        if (resource.inspector) {
            resource.inspector.contentLength = contentLengthInt;
        }
        if (_this.inspector) {
            _this.inspector.summary.totalContentLength += contentLengthInt;
        }
    }, false);
    xhr.send();
    // no need to wait xhr procedure
    next();
};



/***/ }),

/***/ "./src/middleware/set_inspector_property.ts":
/*!**************************************************!*\
  !*** ./src/middleware/set_inspector_property.ts ***!
  \**************************************************/
/*! exports provided: setInspectorProperty */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setInspectorProperty", function() { return setInspectorProperty; });
/**
 * Set default inspector property to proceed rest of middlewares.
 */
var setInspectorProperty = function setInspectorProperty(resource, next) {
    resource.inspector = {
        contentLength: 0,
        alreadyLoaded: false
    };
    next();
};



/***/ })

/******/ });
});
//# sourceMappingURL=resource-loader-inspector.js.map