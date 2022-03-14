var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node_modules/@middy/core/index.js
var require_core = __commonJS({
  "node_modules/@middy/core/index.js"(exports, module2) {
    "use strict";
    var middy2 = (baseHandler = () => {
    }, plugin) => {
      var _plugin$beforePrefetc;
      plugin === null || plugin === void 0 ? void 0 : (_plugin$beforePrefetc = plugin.beforePrefetch) === null || _plugin$beforePrefetc === void 0 ? void 0 : _plugin$beforePrefetc.call(plugin);
      const beforeMiddlewares = [];
      const afterMiddlewares = [];
      const onErrorMiddlewares = [];
      const instance = (event = {}, context = {}) => {
        var _plugin$requestStart;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$requestStart = plugin.requestStart) === null || _plugin$requestStart === void 0 ? void 0 : _plugin$requestStart.call(plugin);
        const request = {
          event,
          context,
          response: void 0,
          error: void 0,
          internal: {}
        };
        return runRequest(request, [...beforeMiddlewares], baseHandler, [...afterMiddlewares], [...onErrorMiddlewares], plugin);
      };
      instance.use = (middlewares) => {
        if (Array.isArray(middlewares)) {
          for (const middleware of middlewares) {
            instance.applyMiddleware(middleware);
          }
          return instance;
        }
        return instance.applyMiddleware(middlewares);
      };
      instance.applyMiddleware = (middleware) => {
        const {
          before,
          after,
          onError
        } = middleware;
        if (!before && !after && !onError) {
          throw new Error('Middleware must be an object containing at least one key among "before", "after", "onError"');
        }
        if (before)
          instance.before(before);
        if (after)
          instance.after(after);
        if (onError)
          instance.onError(onError);
        return instance;
      };
      instance.before = (beforeMiddleware) => {
        beforeMiddlewares.push(beforeMiddleware);
        return instance;
      };
      instance.after = (afterMiddleware) => {
        afterMiddlewares.unshift(afterMiddleware);
        return instance;
      };
      instance.onError = (onErrorMiddleware) => {
        onErrorMiddlewares.push(onErrorMiddleware);
        return instance;
      };
      instance.__middlewares = {
        before: beforeMiddlewares,
        after: afterMiddlewares,
        onError: onErrorMiddlewares
      };
      return instance;
    };
    var runRequest = async (request, beforeMiddlewares, baseHandler, afterMiddlewares, onErrorMiddlewares, plugin) => {
      try {
        await runMiddlewares(request, beforeMiddlewares, plugin);
        if (request.response === void 0) {
          var _plugin$beforeHandler, _plugin$afterHandler;
          plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeHandler = plugin.beforeHandler) === null || _plugin$beforeHandler === void 0 ? void 0 : _plugin$beforeHandler.call(plugin);
          request.response = await baseHandler(request.event, request.context);
          plugin === null || plugin === void 0 ? void 0 : (_plugin$afterHandler = plugin.afterHandler) === null || _plugin$afterHandler === void 0 ? void 0 : _plugin$afterHandler.call(plugin);
          await runMiddlewares(request, afterMiddlewares, plugin);
        }
      } catch (e) {
        request.response = void 0;
        request.error = e;
        try {
          await runMiddlewares(request, onErrorMiddlewares, plugin);
        } catch (e2) {
          e2.originalError = request.error;
          request.error = e2;
          throw request.error;
        }
        if (request.response === void 0)
          throw request.error;
      } finally {
        var _plugin$requestEnd;
        await (plugin === null || plugin === void 0 ? void 0 : (_plugin$requestEnd = plugin.requestEnd) === null || _plugin$requestEnd === void 0 ? void 0 : _plugin$requestEnd.call(plugin, request));
      }
      return request.response;
    };
    var runMiddlewares = async (request, middlewares, plugin) => {
      for (const nextMiddleware of middlewares) {
        var _plugin$beforeMiddlew, _plugin$afterMiddlewa;
        plugin === null || plugin === void 0 ? void 0 : (_plugin$beforeMiddlew = plugin.beforeMiddleware) === null || _plugin$beforeMiddlew === void 0 ? void 0 : _plugin$beforeMiddlew.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        const res = await (nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware(request));
        plugin === null || plugin === void 0 ? void 0 : (_plugin$afterMiddlewa = plugin.afterMiddleware) === null || _plugin$afterMiddlewa === void 0 ? void 0 : _plugin$afterMiddlewa.call(plugin, nextMiddleware === null || nextMiddleware === void 0 ? void 0 : nextMiddleware.name);
        if (res !== void 0) {
          request.response = res;
          return;
        }
      }
    };
    module2.exports = middy2;
  }
});

// node_modules/@middy/validator/node_modules/@middy/util/codes.json
var require_codes = __commonJS({
  "node_modules/@middy/validator/node_modules/@middy/util/codes.json"(exports, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/@middy/validator/node_modules/@middy/util/index.js
var require_util = __commonJS({
  "node_modules/@middy/validator/node_modules/@middy/util/index.js"(exports, module2) {
    "use strict";
    var {
      Agent
    } = require("https");
    var awsClientDefaultOptions = {
      httpOptions: {
        agent: new Agent({
          secureProtocol: "TLSv1_2_method"
        })
      }
    };
    var createPrefetchClient = (options) => {
      const awsClientOptions = __spreadValues(__spreadValues({}, awsClientDefaultOptions), options.awsClientOptions);
      const client = new options.AwsClient(awsClientOptions);
      if (options.awsClientCapture) {
        return options.awsClientCapture(client);
      }
      return client;
    };
    var createClient = async (options, request) => {
      let awsClientCredentials = {};
      if (options.awsClientAssumeRole) {
        if (!request)
          throw new Error("Request required when assuming role");
        awsClientCredentials = await getInternal({
          credentials: options.awsClientAssumeRole
        }, request);
      }
      awsClientCredentials = __spreadValues(__spreadValues({}, awsClientCredentials), options.awsClientOptions);
      return createPrefetchClient(__spreadProps(__spreadValues({}, options), {
        awsClientOptions: awsClientCredentials
      }));
    };
    var canPrefetch = (options) => {
      return !(options !== null && options !== void 0 && options.awsClientAssumeRole) && !(options !== null && options !== void 0 && options.disablePrefetch);
    };
    var getInternal = async (variables, request) => {
      if (!variables || !request)
        return {};
      let keys = [];
      let values = [];
      if (variables === true) {
        keys = values = Object.keys(request.internal);
      } else if (typeof variables === "string") {
        keys = values = [variables];
      } else if (Array.isArray(variables)) {
        keys = values = variables;
      } else if (typeof variables === "object") {
        keys = Object.keys(variables);
        values = Object.values(variables);
      }
      const promises = [];
      for (const internalKey of values) {
        var _valuePromise;
        const pathOptionKey = internalKey.split(".");
        const rootOptionKey = pathOptionKey.shift();
        let valuePromise = request.internal[rootOptionKey];
        if (typeof ((_valuePromise = valuePromise) === null || _valuePromise === void 0 ? void 0 : _valuePromise.then) !== "function") {
          valuePromise = Promise.resolve(valuePromise);
        }
        promises.push(valuePromise.then((value) => pathOptionKey.reduce((p, c) => p === null || p === void 0 ? void 0 : p[c], value)));
      }
      values = await Promise.allSettled(promises);
      const errors = values.filter((res) => res.status === "rejected").map((res) => res.reason.message);
      if (errors.length)
        throw new Error(JSON.stringify(errors));
      return keys.reduce((obj, key, index) => __spreadProps(__spreadValues({}, obj), {
        [sanitizeKey(key)]: values[index].value
      }), {});
    };
    var sanitizeKeyPrefixLeadingNumber = /^([0-9])/;
    var sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g;
    var sanitizeKey = (key) => {
      return key.replace(sanitizeKeyPrefixLeadingNumber, "_$1").replace(sanitizeKeyRemoveDisallowedChar, "_");
    };
    var cache = {};
    var processCache = (options, fetch = () => void 0, request) => {
      const {
        cacheExpiry,
        cacheKey
      } = options;
      if (cacheExpiry) {
        const cached = getCache(cacheKey);
        const unexpired = cached && (cacheExpiry < 0 || cached.expiry > Date.now());
        if (unexpired && cached.modified) {
          const value2 = fetch(request, cached.value);
          cache[cacheKey] = {
            value: __spreadValues(__spreadValues({}, cached.value), value2),
            expiry: cached.expiry
          };
          return cache[cacheKey];
        }
        if (unexpired) {
          return __spreadProps(__spreadValues({}, cached), {
            cache: true
          });
        }
      }
      const value = fetch(request);
      const expiry = Date.now() + cacheExpiry;
      if (cacheExpiry) {
        cache[cacheKey] = {
          value,
          expiry
        };
      }
      return {
        value,
        expiry
      };
    };
    var getCache = (key) => {
      return cache[key];
    };
    var modifyCache = (cacheKey, value) => {
      if (!cache[cacheKey])
        return;
      cache[cacheKey] = __spreadProps(__spreadValues({}, cache[cacheKey]), {
        value,
        modified: true
      });
    };
    var clearCache = (keys = null) => {
      var _keys;
      keys = (_keys = keys) !== null && _keys !== void 0 ? _keys : Object.keys(cache);
      if (!Array.isArray(keys))
        keys = [keys];
      for (const cacheKey of keys) {
        cache[cacheKey] = void 0;
      }
    };
    var jsonSafeParse = (string, reviver) => {
      if (typeof string !== "string")
        return string;
      const firstChar = string[0];
      if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"')
        return string;
      try {
        return JSON.parse(string, reviver);
      } catch (e) {
      }
      return string;
    };
    var normalizeHttpResponse = (response) => {
      var _response$headers, _response;
      if (response === void 0) {
        response = {};
      } else if (Array.isArray(response) || typeof response !== "object" || response === null) {
        response = {
          body: response
        };
      }
      response.headers = (_response$headers = (_response = response) === null || _response === void 0 ? void 0 : _response.headers) !== null && _response$headers !== void 0 ? _response$headers : {};
      return response;
    };
    var statuses = require_codes();
    var {
      inherits
    } = require("util");
    var createErrorRegexp = /[^a-zA-Z]/g;
    var createError = (code, message, properties = {}) => {
      const name = statuses[code].replace(createErrorRegexp, "");
      const className = name.substr(-5) !== "Error" ? name + "Error" : name;
      function HttpError(message2) {
        const msg = message2 !== null && message2 !== void 0 ? message2 : statuses[code];
        const err = new Error(msg);
        Error.captureStackTrace(err, HttpError);
        Object.setPrototypeOf(err, HttpError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(HttpError, Error);
      const desc = Object.getOwnPropertyDescriptor(HttpError, "name");
      desc.value = className;
      Object.defineProperty(HttpError, "name", desc);
      Object.assign(HttpError.prototype, {
        status: code,
        statusCode: code,
        expose: code < 500
      }, properties);
      return new HttpError(message);
    };
    module2.exports = {
      createPrefetchClient,
      createClient,
      canPrefetch,
      getInternal,
      sanitizeKey,
      processCache,
      getCache,
      modifyCache,
      clearCache,
      jsonSafeParse,
      normalizeHttpResponse,
      createError
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = __spreadProps(__spreadValues({}, opts), { _n: opts.lines ? line : code_1.nil });
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : __spreadValues({}, this.lhs.names);
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new If(not(cond), e instanceof If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a, _b;
        super.optimizeNames(names, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = __spreadProps(__spreadValues({}, opts), { _n: opts.lines ? "\n" : "" });
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      name(prefix) {
        return this._scope.name(prefix);
      }
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      else() {
        return this._elseNode(new Else());
      }
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      endFor() {
        return this._endBlockNode(For);
      }
      label(label) {
        return this._leafNode(new Label(label));
      }
      break(label) {
        return this._leafNode(new Break(label));
      }
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/util.js
var require_util2 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : __spreadValues(__spreadValues({}, from), to),
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type = exports.Type || (exports.Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      data: new codegen_1.Name("data"),
      valCxt: new codegen_1.Name("valCxt"),
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      vErrors: new codegen_1.Name("vErrors"),
      errors: new codegen_1.Name("errors"),
      this: new codegen_1.Name("this"),
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: __spreadProps(__spreadValues({}, groups), { integer: true, boolean: true, null: true }),
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType = exports.DataType || (exports.DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var names_1 = require_names();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      return gen.scopeValue("pattern", {
        key: pattern,
        ref: new RegExp(pattern, u),
        code: (0, codegen_1._)`new RegExp(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module2) {
    "use strict";
    module2.exports = function equal(a, b) {
      if (a === b)
        return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor)
          return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length)
            return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i]))
              return false;
          return true;
        }
        if (a.constructor === RegExp)
          return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
          return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
          return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
          return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
            return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key]))
            return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/@middy/validator/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "node_modules/@middy/validator/node_modules/json-schema-traverse/index.js"(exports, module2) {
    "use strict";
    var traverse = module2.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// node_modules/uri-js/dist/es5/uri.all.js
var require_uri_all = __commonJS({
  "node_modules/uri-js/dist/es5/uri.all.js"(exports, module2) {
    (function(global, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.URI = global.URI || {});
    })(exports, function(exports2) {
      "use strict";
      function merge() {
        for (var _len = arguments.length, sets = Array(_len), _key = 0; _key < _len; _key++) {
          sets[_key] = arguments[_key];
        }
        if (sets.length > 1) {
          sets[0] = sets[0].slice(0, -1);
          var xl = sets.length - 1;
          for (var x = 1; x < xl; ++x) {
            sets[x] = sets[x].slice(1, -1);
          }
          sets[xl] = sets[xl].slice(1);
          return sets.join("");
        } else {
          return sets[0];
        }
      }
      function subexp(str) {
        return "(?:" + str + ")";
      }
      function typeOf(o) {
        return o === void 0 ? "undefined" : o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase();
      }
      function toUpperCase(str) {
        return str.toUpperCase();
      }
      function toArray(obj) {
        return obj !== void 0 && obj !== null ? obj instanceof Array ? obj : typeof obj.length !== "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj) : [];
      }
      function assign(target, source) {
        var obj = target;
        if (source) {
          for (var key in source) {
            obj[key] = source[key];
          }
        }
        return obj;
      }
      function buildExps(isIRI2) {
        var ALPHA$$ = "[A-Za-z]", CR$ = "[\\x0D]", DIGIT$$ = "[0-9]", DQUOTE$$ = "[\\x22]", HEXDIG$$2 = merge(DIGIT$$, "[A-Fa-f]"), LF$$ = "[\\x0A]", SP$$ = "[\\x20]", PCT_ENCODED$2 = subexp(subexp("%[EFef]" + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$2 + "%" + HEXDIG$$2 + HEXDIG$$2) + "|" + subexp("%" + HEXDIG$$2 + HEXDIG$$2)), GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]", SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]", RESERVED$$ = merge(GEN_DELIMS$$, SUB_DELIMS$$), UCSCHAR$$ = isIRI2 ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]", IPRIVATE$$ = isIRI2 ? "[\\uE000-\\uF8FF]" : "[]", UNRESERVED$$2 = merge(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]", UCSCHAR$$), SCHEME$ = subexp(ALPHA$$ + merge(ALPHA$$, DIGIT$$, "[\\+\\-\\.]") + "*"), USERINFO$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\:]")) + "*"), DEC_OCTET$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("[1-9]" + DIGIT$$) + "|" + DIGIT$$), DEC_OCTET_RELAXED$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("0?[1-9]" + DIGIT$$) + "|0?0?" + DIGIT$$), IPV4ADDRESS$ = subexp(DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$), H16$ = subexp(HEXDIG$$2 + "{1,4}"), LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$), IPV6ADDRESS1$ = subexp(subexp(H16$ + "\\:") + "{6}" + LS32$), IPV6ADDRESS2$ = subexp("\\:\\:" + subexp(H16$ + "\\:") + "{5}" + LS32$), IPV6ADDRESS3$ = subexp(subexp(H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{4}" + LS32$), IPV6ADDRESS4$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,1}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{3}" + LS32$), IPV6ADDRESS5$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,2}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{2}" + LS32$), IPV6ADDRESS6$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,3}" + H16$) + "?\\:\\:" + H16$ + "\\:" + LS32$), IPV6ADDRESS7$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,4}" + H16$) + "?\\:\\:" + LS32$), IPV6ADDRESS8$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,5}" + H16$) + "?\\:\\:" + H16$), IPV6ADDRESS9$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,6}" + H16$) + "?\\:\\:"), IPV6ADDRESS$ = subexp([IPV6ADDRESS1$, IPV6ADDRESS2$, IPV6ADDRESS3$, IPV6ADDRESS4$, IPV6ADDRESS5$, IPV6ADDRESS6$, IPV6ADDRESS7$, IPV6ADDRESS8$, IPV6ADDRESS9$].join("|")), ZONEID$ = subexp(subexp(UNRESERVED$$2 + "|" + PCT_ENCODED$2) + "+"), IPV6ADDRZ$ = subexp(IPV6ADDRESS$ + "\\%25" + ZONEID$), IPV6ADDRZ_RELAXED$ = subexp(IPV6ADDRESS$ + subexp("\\%25|\\%(?!" + HEXDIG$$2 + "{2})") + ZONEID$), IPVFUTURE$ = subexp("[vV]" + HEXDIG$$2 + "+\\." + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\:]") + "+"), IP_LITERAL$ = subexp("\\[" + subexp(IPV6ADDRZ_RELAXED$ + "|" + IPV6ADDRESS$ + "|" + IPVFUTURE$) + "\\]"), REG_NAME$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$)) + "*"), HOST$ = subexp(IP_LITERAL$ + "|" + IPV4ADDRESS$ + "(?!" + REG_NAME$ + ")|" + REG_NAME$), PORT$ = subexp(DIGIT$$ + "*"), AUTHORITY$ = subexp(subexp(USERINFO$ + "@") + "?" + HOST$ + subexp("\\:" + PORT$) + "?"), PCHAR$ = subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@]")), SEGMENT$ = subexp(PCHAR$ + "*"), SEGMENT_NZ$ = subexp(PCHAR$ + "+"), SEGMENT_NZ_NC$ = subexp(subexp(PCT_ENCODED$2 + "|" + merge(UNRESERVED$$2, SUB_DELIMS$$, "[\\@]")) + "+"), PATH_ABEMPTY$ = subexp(subexp("\\/" + SEGMENT$) + "*"), PATH_ABSOLUTE$ = subexp("\\/" + subexp(SEGMENT_NZ$ + PATH_ABEMPTY$) + "?"), PATH_NOSCHEME$ = subexp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$), PATH_ROOTLESS$ = subexp(SEGMENT_NZ$ + PATH_ABEMPTY$), PATH_EMPTY$ = "(?!" + PCHAR$ + ")", PATH$ = subexp(PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$), QUERY$ = subexp(subexp(PCHAR$ + "|" + merge("[\\/\\?]", IPRIVATE$$)) + "*"), FRAGMENT$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"), HIER_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$), URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"), RELATIVE_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$), RELATIVE$ = subexp(RELATIVE_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"), URI_REFERENCE$ = subexp(URI$ + "|" + RELATIVE$), ABSOLUTE_URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?"), GENERIC_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", RELATIVE_REF$ = "^(){0}" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", ABSOLUTE_REF$ = "^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?$", SAMEDOC_REF$ = "^" + subexp("\\#(" + FRAGMENT$ + ")") + "?$", AUTHORITY_REF$ = "^" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?$";
        return {
          NOT_SCHEME: new RegExp(merge("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
          NOT_USERINFO: new RegExp(merge("[^\\%\\:]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_HOST: new RegExp(merge("[^\\%\\[\\]\\:]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_PATH: new RegExp(merge("[^\\%\\/\\:\\@]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_PATH_NOSCHEME: new RegExp(merge("[^\\%\\/\\@]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          NOT_QUERY: new RegExp(merge("[^\\%]", UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@\\/\\?]", IPRIVATE$$), "g"),
          NOT_FRAGMENT: new RegExp(merge("[^\\%]", UNRESERVED$$2, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
          ESCAPE: new RegExp(merge("[^]", UNRESERVED$$2, SUB_DELIMS$$), "g"),
          UNRESERVED: new RegExp(UNRESERVED$$2, "g"),
          OTHER_CHARS: new RegExp(merge("[^\\%]", UNRESERVED$$2, RESERVED$$), "g"),
          PCT_ENCODED: new RegExp(PCT_ENCODED$2, "g"),
          IPV4ADDRESS: new RegExp("^(" + IPV4ADDRESS$ + ")$"),
          IPV6ADDRESS: new RegExp("^\\[?(" + IPV6ADDRESS$ + ")" + subexp(subexp("\\%25|\\%(?!" + HEXDIG$$2 + "{2})") + "(" + ZONEID$ + ")") + "?\\]?$")
        };
      }
      var URI_PROTOCOL = buildExps(false);
      var IRI_PROTOCOL = buildExps(true);
      var slicedToArray = function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = void 0;
          try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i)
                break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"])
                _i["return"]();
            } finally {
              if (_d)
                throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      }();
      var toConsumableArray = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
          return arr2;
        } else {
          return Array.from(arr);
        }
      };
      var maxInt = 2147483647;
      var base = 36;
      var tMin = 1;
      var tMax = 26;
      var skew = 38;
      var damp = 700;
      var initialBias = 72;
      var initialN = 128;
      var delimiter = "-";
      var regexPunycode = /^xn--/;
      var regexNonASCII = /[^\0-\x7E]/;
      var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
      var errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      };
      var baseMinusTMin = base - tMin;
      var floor = Math.floor;
      var stringFromCharCode = String.fromCharCode;
      function error$1(type) {
        throw new RangeError(errors[type]);
      }
      function map(array, fn) {
        var result = [];
        var length = array.length;
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string, fn) {
        var parts = string.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        var labels = string.split(".");
        var encoded = map(labels, fn).join(".");
        return result + encoded;
      }
      function ucs2decode(string) {
        var output = [];
        var counter = 0;
        var length = string.length;
        while (counter < length) {
          var value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            var extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      var ucs2encode = function ucs2encode2(array) {
        return String.fromCodePoint.apply(String, toConsumableArray(array));
      };
      var basicToDigit = function basicToDigit2(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      };
      var digitToBasic = function digitToBasic2(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      };
      var adapt = function adapt2(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      };
      var decode = function decode2(input) {
        var output = [];
        var inputLength = input.length;
        var i = 0;
        var n = initialN;
        var bias = initialBias;
        var basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (var j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error$1("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (var index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          var oldi = i;
          for (var w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error$1("invalid-input");
            }
            var digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error$1("overflow");
            }
            i += digit * w;
            var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            var baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error$1("overflow");
            }
            w *= baseMinusT;
          }
          var out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error$1("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return String.fromCodePoint.apply(String, output);
      };
      var encode = function encode2(input) {
        var output = [];
        input = ucs2decode(input);
        var inputLength = input.length;
        var n = initialN;
        var delta = 0;
        var bias = initialBias;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = void 0;
        try {
          for (var _iterator = input[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _currentValue2 = _step.value;
            if (_currentValue2 < 128) {
              output.push(stringFromCharCode(_currentValue2));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
        var basicLength = output.length;
        var handledCPCount = basicLength;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          var m = maxInt;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = void 0;
          try {
            for (var _iterator2 = input[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var currentValue = _step2.value;
              if (currentValue >= n && currentValue < m) {
                m = currentValue;
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          var handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error$1("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = void 0;
          try {
            for (var _iterator3 = input[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _currentValue = _step3.value;
              if (_currentValue < n && ++delta > maxInt) {
                error$1("overflow");
              }
              if (_currentValue == n) {
                var q = delta;
                for (var k = base; ; k += base) {
                  var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                  if (q < t) {
                    break;
                  }
                  var qMinusT = q - t;
                  var baseMinusT = base - t;
                  output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
                  q = floor(qMinusT / baseMinusT);
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                delta = 0;
                ++handledCPCount;
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      };
      var toUnicode = function toUnicode2(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      };
      var toASCII = function toASCII2(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      };
      var punycode = {
        "version": "2.1.0",
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      var SCHEMES = {};
      function pctEncChar(chr) {
        var c = chr.charCodeAt(0);
        var e = void 0;
        if (c < 16)
          e = "%0" + c.toString(16).toUpperCase();
        else if (c < 128)
          e = "%" + c.toString(16).toUpperCase();
        else if (c < 2048)
          e = "%" + (c >> 6 | 192).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();
        else
          e = "%" + (c >> 12 | 224).toString(16).toUpperCase() + "%" + (c >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (c & 63 | 128).toString(16).toUpperCase();
        return e;
      }
      function pctDecChars(str) {
        var newStr = "";
        var i = 0;
        var il = str.length;
        while (i < il) {
          var c = parseInt(str.substr(i + 1, 2), 16);
          if (c < 128) {
            newStr += String.fromCharCode(c);
            i += 3;
          } else if (c >= 194 && c < 224) {
            if (il - i >= 6) {
              var c2 = parseInt(str.substr(i + 4, 2), 16);
              newStr += String.fromCharCode((c & 31) << 6 | c2 & 63);
            } else {
              newStr += str.substr(i, 6);
            }
            i += 6;
          } else if (c >= 224) {
            if (il - i >= 9) {
              var _c = parseInt(str.substr(i + 4, 2), 16);
              var c3 = parseInt(str.substr(i + 7, 2), 16);
              newStr += String.fromCharCode((c & 15) << 12 | (_c & 63) << 6 | c3 & 63);
            } else {
              newStr += str.substr(i, 9);
            }
            i += 9;
          } else {
            newStr += str.substr(i, 3);
            i += 3;
          }
        }
        return newStr;
      }
      function _normalizeComponentEncoding(components, protocol) {
        function decodeUnreserved2(str) {
          var decStr = pctDecChars(str);
          return !decStr.match(protocol.UNRESERVED) ? str : decStr;
        }
        if (components.scheme)
          components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved2).toLowerCase().replace(protocol.NOT_SCHEME, "");
        if (components.userinfo !== void 0)
          components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.host !== void 0)
          components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved2).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.path !== void 0)
          components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.query !== void 0)
          components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        if (components.fragment !== void 0)
          components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved2).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
        return components;
      }
      function _stripLeadingZeros(str) {
        return str.replace(/^0*(.*)/, "$1") || "0";
      }
      function _normalizeIPv4(host, protocol) {
        var matches = host.match(protocol.IPV4ADDRESS) || [];
        var _matches = slicedToArray(matches, 2), address = _matches[1];
        if (address) {
          return address.split(".").map(_stripLeadingZeros).join(".");
        } else {
          return host;
        }
      }
      function _normalizeIPv6(host, protocol) {
        var matches = host.match(protocol.IPV6ADDRESS) || [];
        var _matches2 = slicedToArray(matches, 3), address = _matches2[1], zone = _matches2[2];
        if (address) {
          var _address$toLowerCase$ = address.toLowerCase().split("::").reverse(), _address$toLowerCase$2 = slicedToArray(_address$toLowerCase$, 2), last = _address$toLowerCase$2[0], first = _address$toLowerCase$2[1];
          var firstFields = first ? first.split(":").map(_stripLeadingZeros) : [];
          var lastFields = last.split(":").map(_stripLeadingZeros);
          var isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(lastFields[lastFields.length - 1]);
          var fieldCount = isLastFieldIPv4Address ? 7 : 8;
          var lastFieldsStart = lastFields.length - fieldCount;
          var fields = Array(fieldCount);
          for (var x = 0; x < fieldCount; ++x) {
            fields[x] = firstFields[x] || lastFields[lastFieldsStart + x] || "";
          }
          if (isLastFieldIPv4Address) {
            fields[fieldCount - 1] = _normalizeIPv4(fields[fieldCount - 1], protocol);
          }
          var allZeroFields = fields.reduce(function(acc, field, index) {
            if (!field || field === "0") {
              var lastLongest = acc[acc.length - 1];
              if (lastLongest && lastLongest.index + lastLongest.length === index) {
                lastLongest.length++;
              } else {
                acc.push({ index, length: 1 });
              }
            }
            return acc;
          }, []);
          var longestZeroFields = allZeroFields.sort(function(a, b) {
            return b.length - a.length;
          })[0];
          var newHost = void 0;
          if (longestZeroFields && longestZeroFields.length > 1) {
            var newFirst = fields.slice(0, longestZeroFields.index);
            var newLast = fields.slice(longestZeroFields.index + longestZeroFields.length);
            newHost = newFirst.join(":") + "::" + newLast.join(":");
          } else {
            newHost = fields.join(":");
          }
          if (zone) {
            newHost += "%" + zone;
          }
          return newHost;
        } else {
          return host;
        }
      }
      var URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
      var NO_MATCH_IS_UNDEFINED = "".match(/(){0}/)[1] === void 0;
      function parse(uriString) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var components = {};
        var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
        if (options.reference === "suffix")
          uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
        var matches = uriString.match(URI_PARSE);
        if (matches) {
          if (NO_MATCH_IS_UNDEFINED) {
            components.scheme = matches[1];
            components.userinfo = matches[3];
            components.host = matches[4];
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = matches[7];
            components.fragment = matches[8];
            if (isNaN(components.port)) {
              components.port = matches[5];
            }
          } else {
            components.scheme = matches[1] || void 0;
            components.userinfo = uriString.indexOf("@") !== -1 ? matches[3] : void 0;
            components.host = uriString.indexOf("//") !== -1 ? matches[4] : void 0;
            components.port = parseInt(matches[5], 10);
            components.path = matches[6] || "";
            components.query = uriString.indexOf("?") !== -1 ? matches[7] : void 0;
            components.fragment = uriString.indexOf("#") !== -1 ? matches[8] : void 0;
            if (isNaN(components.port)) {
              components.port = uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : void 0;
            }
          }
          if (components.host) {
            components.host = _normalizeIPv6(_normalizeIPv4(components.host, protocol), protocol);
          }
          if (components.scheme === void 0 && components.userinfo === void 0 && components.host === void 0 && components.port === void 0 && !components.path && components.query === void 0) {
            components.reference = "same-document";
          } else if (components.scheme === void 0) {
            components.reference = "relative";
          } else if (components.fragment === void 0) {
            components.reference = "absolute";
          } else {
            components.reference = "uri";
          }
          if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
            components.error = components.error || "URI is not a " + options.reference + " reference.";
          }
          var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
          if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
            if (components.host && (options.domainHost || schemeHandler && schemeHandler.domainHost)) {
              try {
                components.host = punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
              } catch (e) {
                components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
              }
            }
            _normalizeComponentEncoding(components, URI_PROTOCOL);
          } else {
            _normalizeComponentEncoding(components, protocol);
          }
          if (schemeHandler && schemeHandler.parse) {
            schemeHandler.parse(components, options);
          }
        } else {
          components.error = components.error || "URI can not be parsed.";
        }
        return components;
      }
      function _recomposeAuthority(components, options) {
        var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
        var uriTokens = [];
        if (components.userinfo !== void 0) {
          uriTokens.push(components.userinfo);
          uriTokens.push("@");
        }
        if (components.host !== void 0) {
          uriTokens.push(_normalizeIPv6(_normalizeIPv4(String(components.host), protocol), protocol).replace(protocol.IPV6ADDRESS, function(_, $1, $2) {
            return "[" + $1 + ($2 ? "%25" + $2 : "") + "]";
          }));
        }
        if (typeof components.port === "number" || typeof components.port === "string") {
          uriTokens.push(":");
          uriTokens.push(String(components.port));
        }
        return uriTokens.length ? uriTokens.join("") : void 0;
      }
      var RDS1 = /^\.\.?\//;
      var RDS2 = /^\/\.(\/|$)/;
      var RDS3 = /^\/\.\.(\/|$)/;
      var RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
      function removeDotSegments(input) {
        var output = [];
        while (input.length) {
          if (input.match(RDS1)) {
            input = input.replace(RDS1, "");
          } else if (input.match(RDS2)) {
            input = input.replace(RDS2, "/");
          } else if (input.match(RDS3)) {
            input = input.replace(RDS3, "/");
            output.pop();
          } else if (input === "." || input === "..") {
            input = "";
          } else {
            var im = input.match(RDS5);
            if (im) {
              var s = im[0];
              input = input.slice(s.length);
              output.push(s);
            } else {
              throw new Error("Unexpected dot segment condition");
            }
          }
        }
        return output.join("");
      }
      function serialize(components) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var protocol = options.iri ? IRI_PROTOCOL : URI_PROTOCOL;
        var uriTokens = [];
        var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
        if (schemeHandler && schemeHandler.serialize)
          schemeHandler.serialize(components, options);
        if (components.host) {
          if (protocol.IPV6ADDRESS.test(components.host)) {
          } else if (options.domainHost || schemeHandler && schemeHandler.domainHost) {
            try {
              components.host = !options.iri ? punycode.toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : punycode.toUnicode(components.host);
            } catch (e) {
              components.error = components.error || "Host's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
            }
          }
        }
        _normalizeComponentEncoding(components, protocol);
        if (options.reference !== "suffix" && components.scheme) {
          uriTokens.push(components.scheme);
          uriTokens.push(":");
        }
        var authority = _recomposeAuthority(components, options);
        if (authority !== void 0) {
          if (options.reference !== "suffix") {
            uriTokens.push("//");
          }
          uriTokens.push(authority);
          if (components.path && components.path.charAt(0) !== "/") {
            uriTokens.push("/");
          }
        }
        if (components.path !== void 0) {
          var s = components.path;
          if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
            s = removeDotSegments(s);
          }
          if (authority === void 0) {
            s = s.replace(/^\/\//, "/%2F");
          }
          uriTokens.push(s);
        }
        if (components.query !== void 0) {
          uriTokens.push("?");
          uriTokens.push(components.query);
        }
        if (components.fragment !== void 0) {
          uriTokens.push("#");
          uriTokens.push(components.fragment);
        }
        return uriTokens.join("");
      }
      function resolveComponents(base2, relative) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var skipNormalization = arguments[3];
        var target = {};
        if (!skipNormalization) {
          base2 = parse(serialize(base2, options), options);
          relative = parse(serialize(relative, options), options);
        }
        options = options || {};
        if (!options.tolerant && relative.scheme) {
          target.scheme = relative.scheme;
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
            target.userinfo = relative.userinfo;
            target.host = relative.host;
            target.port = relative.port;
            target.path = removeDotSegments(relative.path || "");
            target.query = relative.query;
          } else {
            if (!relative.path) {
              target.path = base2.path;
              if (relative.query !== void 0) {
                target.query = relative.query;
              } else {
                target.query = base2.query;
              }
            } else {
              if (relative.path.charAt(0) === "/") {
                target.path = removeDotSegments(relative.path);
              } else {
                if ((base2.userinfo !== void 0 || base2.host !== void 0 || base2.port !== void 0) && !base2.path) {
                  target.path = "/" + relative.path;
                } else if (!base2.path) {
                  target.path = relative.path;
                } else {
                  target.path = base2.path.slice(0, base2.path.lastIndexOf("/") + 1) + relative.path;
                }
                target.path = removeDotSegments(target.path);
              }
              target.query = relative.query;
            }
            target.userinfo = base2.userinfo;
            target.host = base2.host;
            target.port = base2.port;
          }
          target.scheme = base2.scheme;
        }
        target.fragment = relative.fragment;
        return target;
      }
      function resolve(baseURI, relativeURI, options) {
        var schemelessOptions = assign({ scheme: "null" }, options);
        return serialize(resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true), schemelessOptions);
      }
      function normalize(uri, options) {
        if (typeof uri === "string") {
          uri = serialize(parse(uri, options), options);
        } else if (typeOf(uri) === "object") {
          uri = parse(serialize(uri, options), options);
        }
        return uri;
      }
      function equal(uriA, uriB, options) {
        if (typeof uriA === "string") {
          uriA = serialize(parse(uriA, options), options);
        } else if (typeOf(uriA) === "object") {
          uriA = serialize(uriA, options);
        }
        if (typeof uriB === "string") {
          uriB = serialize(parse(uriB, options), options);
        } else if (typeOf(uriB) === "object") {
          uriB = serialize(uriB, options);
        }
        return uriA === uriB;
      }
      function escapeComponent(str, options) {
        return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.ESCAPE : IRI_PROTOCOL.ESCAPE, pctEncChar);
      }
      function unescapeComponent(str, options) {
        return str && str.toString().replace(!options || !options.iri ? URI_PROTOCOL.PCT_ENCODED : IRI_PROTOCOL.PCT_ENCODED, pctDecChars);
      }
      var handler = {
        scheme: "http",
        domainHost: true,
        parse: function parse2(components, options) {
          if (!components.host) {
            components.error = components.error || "HTTP URIs must have a host.";
          }
          return components;
        },
        serialize: function serialize2(components, options) {
          var secure = String(components.scheme).toLowerCase() === "https";
          if (components.port === (secure ? 443 : 80) || components.port === "") {
            components.port = void 0;
          }
          if (!components.path) {
            components.path = "/";
          }
          return components;
        }
      };
      var handler$1 = {
        scheme: "https",
        domainHost: handler.domainHost,
        parse: handler.parse,
        serialize: handler.serialize
      };
      function isSecure(wsComponents) {
        return typeof wsComponents.secure === "boolean" ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === "wss";
      }
      var handler$2 = {
        scheme: "ws",
        domainHost: true,
        parse: function parse2(components, options) {
          var wsComponents = components;
          wsComponents.secure = isSecure(wsComponents);
          wsComponents.resourceName = (wsComponents.path || "/") + (wsComponents.query ? "?" + wsComponents.query : "");
          wsComponents.path = void 0;
          wsComponents.query = void 0;
          return wsComponents;
        },
        serialize: function serialize2(wsComponents, options) {
          if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === "") {
            wsComponents.port = void 0;
          }
          if (typeof wsComponents.secure === "boolean") {
            wsComponents.scheme = wsComponents.secure ? "wss" : "ws";
            wsComponents.secure = void 0;
          }
          if (wsComponents.resourceName) {
            var _wsComponents$resourc = wsComponents.resourceName.split("?"), _wsComponents$resourc2 = slicedToArray(_wsComponents$resourc, 2), path = _wsComponents$resourc2[0], query = _wsComponents$resourc2[1];
            wsComponents.path = path && path !== "/" ? path : void 0;
            wsComponents.query = query;
            wsComponents.resourceName = void 0;
          }
          wsComponents.fragment = void 0;
          return wsComponents;
        }
      };
      var handler$3 = {
        scheme: "wss",
        domainHost: handler$2.domainHost,
        parse: handler$2.parse,
        serialize: handler$2.serialize
      };
      var O = {};
      var isIRI = true;
      var UNRESERVED$$ = "[A-Za-z0-9\\-\\.\\_\\~" + (isIRI ? "\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF" : "") + "]";
      var HEXDIG$$ = "[0-9A-Fa-f]";
      var PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$));
      var ATEXT$$ = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]";
      var QTEXT$$ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]";
      var VCHAR$$ = merge(QTEXT$$, '[\\"\\\\]');
      var SOME_DELIMS$$ = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]";
      var UNRESERVED = new RegExp(UNRESERVED$$, "g");
      var PCT_ENCODED = new RegExp(PCT_ENCODED$, "g");
      var NOT_LOCAL_PART = new RegExp(merge("[^]", ATEXT$$, "[\\.]", '[\\"]', VCHAR$$), "g");
      var NOT_HFNAME = new RegExp(merge("[^]", UNRESERVED$$, SOME_DELIMS$$), "g");
      var NOT_HFVALUE = NOT_HFNAME;
      function decodeUnreserved(str) {
        var decStr = pctDecChars(str);
        return !decStr.match(UNRESERVED) ? str : decStr;
      }
      var handler$4 = {
        scheme: "mailto",
        parse: function parse$$1(components, options) {
          var mailtoComponents = components;
          var to = mailtoComponents.to = mailtoComponents.path ? mailtoComponents.path.split(",") : [];
          mailtoComponents.path = void 0;
          if (mailtoComponents.query) {
            var unknownHeaders = false;
            var headers = {};
            var hfields = mailtoComponents.query.split("&");
            for (var x = 0, xl = hfields.length; x < xl; ++x) {
              var hfield = hfields[x].split("=");
              switch (hfield[0]) {
                case "to":
                  var toAddrs = hfield[1].split(",");
                  for (var _x = 0, _xl = toAddrs.length; _x < _xl; ++_x) {
                    to.push(toAddrs[_x]);
                  }
                  break;
                case "subject":
                  mailtoComponents.subject = unescapeComponent(hfield[1], options);
                  break;
                case "body":
                  mailtoComponents.body = unescapeComponent(hfield[1], options);
                  break;
                default:
                  unknownHeaders = true;
                  headers[unescapeComponent(hfield[0], options)] = unescapeComponent(hfield[1], options);
                  break;
              }
            }
            if (unknownHeaders)
              mailtoComponents.headers = headers;
          }
          mailtoComponents.query = void 0;
          for (var _x2 = 0, _xl2 = to.length; _x2 < _xl2; ++_x2) {
            var addr = to[_x2].split("@");
            addr[0] = unescapeComponent(addr[0]);
            if (!options.unicodeSupport) {
              try {
                addr[1] = punycode.toASCII(unescapeComponent(addr[1], options).toLowerCase());
              } catch (e) {
                mailtoComponents.error = mailtoComponents.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
              }
            } else {
              addr[1] = unescapeComponent(addr[1], options).toLowerCase();
            }
            to[_x2] = addr.join("@");
          }
          return mailtoComponents;
        },
        serialize: function serialize$$1(mailtoComponents, options) {
          var components = mailtoComponents;
          var to = toArray(mailtoComponents.to);
          if (to) {
            for (var x = 0, xl = to.length; x < xl; ++x) {
              var toAddr = String(to[x]);
              var atIdx = toAddr.lastIndexOf("@");
              var localPart = toAddr.slice(0, atIdx).replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_LOCAL_PART, pctEncChar);
              var domain = toAddr.slice(atIdx + 1);
              try {
                domain = !options.iri ? punycode.toASCII(unescapeComponent(domain, options).toLowerCase()) : punycode.toUnicode(domain);
              } catch (e) {
                components.error = components.error || "Email address's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
              }
              to[x] = localPart + "@" + domain;
            }
            components.path = to.join(",");
          }
          var headers = mailtoComponents.headers = mailtoComponents.headers || {};
          if (mailtoComponents.subject)
            headers["subject"] = mailtoComponents.subject;
          if (mailtoComponents.body)
            headers["body"] = mailtoComponents.body;
          var fields = [];
          for (var name in headers) {
            if (headers[name] !== O[name]) {
              fields.push(name.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar) + "=" + headers[name].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar));
            }
          }
          if (fields.length) {
            components.query = fields.join("&");
          }
          return components;
        }
      };
      var URN_PARSE = /^([^\:]+)\:(.*)/;
      var handler$5 = {
        scheme: "urn",
        parse: function parse$$1(components, options) {
          var matches = components.path && components.path.match(URN_PARSE);
          var urnComponents = components;
          if (matches) {
            var scheme = options.scheme || urnComponents.scheme || "urn";
            var nid = matches[1].toLowerCase();
            var nss = matches[2];
            var urnScheme = scheme + ":" + (options.nid || nid);
            var schemeHandler = SCHEMES[urnScheme];
            urnComponents.nid = nid;
            urnComponents.nss = nss;
            urnComponents.path = void 0;
            if (schemeHandler) {
              urnComponents = schemeHandler.parse(urnComponents, options);
            }
          } else {
            urnComponents.error = urnComponents.error || "URN can not be parsed.";
          }
          return urnComponents;
        },
        serialize: function serialize$$1(urnComponents, options) {
          var scheme = options.scheme || urnComponents.scheme || "urn";
          var nid = urnComponents.nid;
          var urnScheme = scheme + ":" + (options.nid || nid);
          var schemeHandler = SCHEMES[urnScheme];
          if (schemeHandler) {
            urnComponents = schemeHandler.serialize(urnComponents, options);
          }
          var uriComponents = urnComponents;
          var nss = urnComponents.nss;
          uriComponents.path = (nid || options.nid) + ":" + nss;
          return uriComponents;
        }
      };
      var UUID = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
      var handler$6 = {
        scheme: "urn:uuid",
        parse: function parse2(urnComponents, options) {
          var uuidComponents = urnComponents;
          uuidComponents.uuid = uuidComponents.nss;
          uuidComponents.nss = void 0;
          if (!options.tolerant && (!uuidComponents.uuid || !uuidComponents.uuid.match(UUID))) {
            uuidComponents.error = uuidComponents.error || "UUID is not valid.";
          }
          return uuidComponents;
        },
        serialize: function serialize2(uuidComponents, options) {
          var urnComponents = uuidComponents;
          urnComponents.nss = (uuidComponents.uuid || "").toLowerCase();
          return urnComponents;
        }
      };
      SCHEMES[handler.scheme] = handler;
      SCHEMES[handler$1.scheme] = handler$1;
      SCHEMES[handler$2.scheme] = handler$2;
      SCHEMES[handler$3.scheme] = handler$3;
      SCHEMES[handler$4.scheme] = handler$4;
      SCHEMES[handler$5.scheme] = handler$5;
      SCHEMES[handler$6.scheme] = handler$6;
      exports2.SCHEMES = SCHEMES;
      exports2.pctEncChar = pctEncChar;
      exports2.pctDecChars = pctDecChars;
      exports2.parse = parse;
      exports2.removeDotSegments = removeDotSegments;
      exports2.serialize = serialize;
      exports2.resolveComponents = resolveComponents;
      exports2.resolve = resolve;
      exports2.normalize = normalize;
      exports2.equal = equal;
      exports2.escapeComponent = escapeComponent;
      exports2.unescapeComponent = unescapeComponent;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util2();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var URI = require_uri_all();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = URI.parse(id);
      return _getFullPath(p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(p) {
      return URI.serialize(p).split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(baseId, id) {
      id = normalizeId(id);
      return URI.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let baseId2 = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          baseId2 = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = baseId2;
        function addRef(ref) {
          ref = normalizeId(baseId2 ? URI.resolve(baseId2, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util2();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      it.dataTypes = it.dataTypes.filter((t) => includesType(types, t));
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = __spreadProps(__spreadValues(__spreadValues({}, this.it), subschema), { items: void 0, props: void 0 });
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util2();
    var validate_1 = require_validate();
    var URI = require_uri_all();
    var SchemaEnv = class {
      constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = URI.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(p);
      let baseId = (0, resolve_1.getFullPath)(root.baseId);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/data.json"(exports, module2) {
    module2.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/core.js
var require_core2 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util2();
    var $dataRefSchema = require_data();
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      return {
        strictSchema: (_c = (_b = o.strictSchema) !== null && _b !== void 0 ? _b : s) !== null && _c !== void 0 ? _c : true,
        strictNumbers: (_e = (_d = o.strictNumbers) !== null && _d !== void 0 ? _d : s) !== null && _e !== void 0 ? _e : true,
        strictTypes: (_g = (_f = o.strictTypes) !== null && _f !== void 0 ? _f : s) !== null && _g !== void 0 ? _g : "log",
        strictTuples: (_j = (_h = o.strictTuples) !== null && _h !== void 0 ? _h : s) !== null && _j !== void 0 ? _j : "log",
        strictRequired: (_l = (_k = o.strictRequired) !== null && _k !== void 0 ? _k : s) !== null && _l !== void 0 ? _l : false,
        code: o.code ? __spreadProps(__spreadValues({}, o.code), { optimize }) : { optimize },
        loopRequired: (_m = o.loopRequired) !== null && _m !== void 0 ? _m : MAX_EXPRESSION,
        loopEnum: (_o = o.loopEnum) !== null && _o !== void 0 ? _o : MAX_EXPRESSION,
        meta: (_p = o.meta) !== null && _p !== void 0 ? _p : true,
        messages: (_q = o.messages) !== null && _q !== void 0 ? _q : true,
        inlineRefs: (_r = o.inlineRefs) !== null && _r !== void 0 ? _r : true,
        schemaId: (_s = o.schemaId) !== null && _s !== void 0 ? _s : "$id",
        addUsedSchema: (_t = o.addUsedSchema) !== null && _t !== void 0 ? _t : true,
        validateSchema: (_u = o.validateSchema) !== null && _u !== void 0 ? _u : true,
        validateFormats: (_v = o.validateFormats) !== null && _v !== void 0 ? _v : true,
        unicodeRegExp: (_w = o.unicodeRegExp) !== null && _w !== void 0 ? _w : true,
        int32range: (_x = o.int32range) !== null && _x !== void 0 ? _x : true
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = __spreadValues(__spreadValues({}, opts), requiredOptions(opts));
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = __spreadValues({}, $dataRefSchema);
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = __spreadProps(__spreadValues({}, def), {
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        });
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    exports.default = Ajv;
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = __spreadValues({}, this.opts);
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: __spreadProps(__spreadValues({}, definition), {
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        })
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util2();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/core/index.js
var require_core3 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        const regExp = $data ? (0, codegen_1._)`(new RegExp(${schemaCode}, ${u}))` : (0, code_1.usePattern)(cxt, schema);
        cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        const eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${eql}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${eql}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      limitNumber_1.default,
      multipleOf_1.default,
      limitLength_1.default,
      pattern_1.default,
      limitProperties_1.default,
      required_1.default,
      limitItems_1.default,
      uniqueItems_1.default,
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else {
          gen.let(valid, false);
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        cxt.result(valid, () => cxt.reset());
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
          const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
          cxt.mergeValidEvaluated(schCxt, valid);
        }, () => gen.var(valid, true));
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util2();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util2();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var util_2 = require_util2();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util2();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util2();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util2();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core3();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicAnchor = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicAnchor",
      schemaType: "string",
      code: (cxt) => dynamicAnchor(cxt, cxt.schema)
    };
    function dynamicAnchor(cxt, anchor) {
      const { gen, it } = cxt;
      it.schemaEnv.root.dynamicAnchors[anchor] = true;
      const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
      const validate = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
      gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate));
    }
    exports.dynamicAnchor = dynamicAnchor;
    function _getValidate(cxt) {
      const { schemaEnv, schema, self } = cxt.it;
      const { root, baseId, localRefs, meta } = schemaEnv.root;
      const { schemaId } = self.opts;
      const sch = new compile_1.SchemaEnv({ schema, schemaId, root, baseId, localRefs, meta });
      compile_1.compileSchema.call(self, sch);
      return (0, ref_1.getValidate)(cxt, sch);
    }
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicRef = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicRef",
      schemaType: "string",
      code: (cxt) => dynamicRef(cxt, cxt.schema)
    };
    function dynamicRef(cxt, ref) {
      const { gen, keyword, it } = cxt;
      if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
      const anchor = ref.slice(1);
      if (it.allErrors) {
        _dynamicRef();
      } else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
      }
      function _dynamicRef(valid) {
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
          const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
          gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        } else {
          _callRef(it.validateName, valid)();
        }
      }
      function _callRef(validate, valid) {
        return valid ? () => gen.block(() => {
          (0, ref_1.callRef)(cxt, validate);
          gen.let(valid, true);
        }) : () => (0, ref_1.callRef)(cxt, validate);
      }
    }
    exports.dynamicRef = dynamicRef;
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var util_1 = require_util2();
    var def = {
      keyword: "$recursiveAnchor",
      schemaType: "boolean",
      code(cxt) {
        if (cxt.schema)
          (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
        else
          (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicRef_1 = require_dynamicRef();
    var def = {
      keyword: "$recursiveRef",
      schemaType: "string",
      code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/dynamic/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var dynamicRef_1 = require_dynamicRef();
    var recursiveAnchor_1 = require_recursiveAnchor();
    var recursiveRef_1 = require_recursiveRef();
    var dynamic = [dynamicAnchor_1.default, dynamicRef_1.default, recursiveAnchor_1.default, recursiveRef_1.default];
    exports.default = dynamic;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/dependentRequired.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentRequired",
      type: "object",
      schemaType: "object",
      error: dependencies_1.error,
      code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentSchemas",
      type: "object",
      schemaType: "object",
      code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/validation/limitContains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util2();
    var def = {
      keyword: ["maxContains", "minContains"],
      type: "array",
      schemaType: "number",
      code({ keyword, parentSchema, it }) {
        if (parentSchema.contains === void 0) {
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/next.js
var require_next = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/next.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependentRequired_1 = require_dependentRequired();
    var dependentSchemas_1 = require_dependentSchemas();
    var limitContains_1 = require_limitContains();
    var next = [dependentRequired_1.default, dependentSchemas_1.default, limitContains_1.default];
    exports.default = next;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var names_1 = require_names();
    var error = {
      message: "must NOT have unevaluated properties",
      params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
    };
    var def = {
      keyword: "unevaluatedProperties",
      type: "object",
      schemaType: ["boolean", "object"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, props } = it;
        if (props instanceof codegen_1.Name) {
          gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
        } else if (props !== true) {
          gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
        }
        it.props = true;
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function unevaluatedPropCode(key) {
          if (schema === false) {
            cxt.setParams({ unevaluatedProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (!(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            cxt.subschema({
              keyword: "unevaluatedProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            }, valid);
            if (!allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          }
        }
        function unevaluatedDynamic(evaluatedProps, key) {
          return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
        }
        function unevaluatedStatic(evaluatedProps, key) {
          const ps = [];
          for (const p in evaluatedProps) {
            if (evaluatedProps[p] === true)
              ps.push((0, codegen_1._)`${key} !== ${p}`);
          }
          return (0, codegen_1.and)(...ps);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util2();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "unevaluatedItems",
      type: "array",
      schemaType: ["boolean", "object"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        const items = it.items || 0;
        if (items === true)
          return;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema === false) {
          cxt.setParams({ len: items });
          cxt.fail((0, codegen_1._)`${len} > ${items}`);
        } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
          gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
          cxt.ok(valid);
        }
        it.items = true;
        function validateItems(valid, from) {
          gen.forRange("i", from, len, (i) => {
            cxt.subschema({ keyword: "unevaluatedItems", dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/unevaluated/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var unevaluatedProperties_1 = require_unevaluatedProperties();
    var unevaluatedItems_1 = require_unevaluatedItems();
    var unevaluated = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
    exports.default = unevaluated;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError = exports.DiscrError || (exports.DiscrError = {}));
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            const sch = oneOf[i];
            const propSch = (_a = sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf schemas must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/schema.json
var require_schema = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/schema.json"(exports, module2) {
    module2.exports = {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "https://json-schema.org/draft/2019-09/schema",
      $vocabulary: {
        "https://json-schema.org/draft/2019-09/vocab/core": true,
        "https://json-schema.org/draft/2019-09/vocab/applicator": true,
        "https://json-schema.org/draft/2019-09/vocab/validation": true,
        "https://json-schema.org/draft/2019-09/vocab/meta-data": true,
        "https://json-schema.org/draft/2019-09/vocab/format": false,
        "https://json-schema.org/draft/2019-09/vocab/content": true
      },
      $recursiveAnchor: true,
      title: "Core and Validation specifications meta-schema",
      allOf: [
        { $ref: "meta/core" },
        { $ref: "meta/applicator" },
        { $ref: "meta/validation" },
        { $ref: "meta/meta-data" },
        { $ref: "meta/format" },
        { $ref: "meta/content" }
      ],
      type: ["object", "boolean"],
      properties: {
        definitions: {
          $comment: "While no longer an official keyword as it is replaced by $defs, this keyword is retained in the meta-schema to prevent incompatible extensions as it remains in common use.",
          type: "object",
          additionalProperties: { $recursiveRef: "#" },
          default: {}
        },
        dependencies: {
          $comment: '"dependencies" is no longer a keyword, but schema authors should avoid redefining it to facilitate a smooth transition to "dependentSchemas" and "dependentRequired"',
          type: "object",
          additionalProperties: {
            anyOf: [{ $recursiveRef: "#" }, { $ref: "meta/validation#/$defs/stringArray" }]
          }
        }
      }
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/applicator.json
var require_applicator2 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/applicator.json"(exports, module2) {
    module2.exports = {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "https://json-schema.org/draft/2019-09/meta/applicator",
      $vocabulary: {
        "https://json-schema.org/draft/2019-09/vocab/applicator": true
      },
      $recursiveAnchor: true,
      title: "Applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        additionalItems: { $recursiveRef: "#" },
        unevaluatedItems: { $recursiveRef: "#" },
        items: {
          anyOf: [{ $recursiveRef: "#" }, { $ref: "#/$defs/schemaArray" }]
        },
        contains: { $recursiveRef: "#" },
        additionalProperties: { $recursiveRef: "#" },
        unevaluatedProperties: { $recursiveRef: "#" },
        properties: {
          type: "object",
          additionalProperties: { $recursiveRef: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $recursiveRef: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependentSchemas: {
          type: "object",
          additionalProperties: {
            $recursiveRef: "#"
          }
        },
        propertyNames: { $recursiveRef: "#" },
        if: { $recursiveRef: "#" },
        then: { $recursiveRef: "#" },
        else: { $recursiveRef: "#" },
        allOf: { $ref: "#/$defs/schemaArray" },
        anyOf: { $ref: "#/$defs/schemaArray" },
        oneOf: { $ref: "#/$defs/schemaArray" },
        not: { $recursiveRef: "#" }
      },
      $defs: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $recursiveRef: "#" }
        }
      }
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/content.json
var require_content = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/content.json"(exports, module2) {
    module2.exports = {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "https://json-schema.org/draft/2019-09/meta/content",
      $vocabulary: {
        "https://json-schema.org/draft/2019-09/vocab/content": true
      },
      $recursiveAnchor: true,
      title: "Content vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        contentSchema: { $recursiveRef: "#" }
      }
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/core.json
var require_core4 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/core.json"(exports, module2) {
    module2.exports = {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "https://json-schema.org/draft/2019-09/meta/core",
      $vocabulary: {
        "https://json-schema.org/draft/2019-09/vocab/core": true
      },
      $recursiveAnchor: true,
      title: "Core vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference",
          $comment: "Non-empty fragments not allowed.",
          pattern: "^[^#]*#?$"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $anchor: {
          type: "string",
          pattern: "^[A-Za-z][-A-Za-z0-9.:_]*$"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $recursiveRef: {
          type: "string",
          format: "uri-reference"
        },
        $recursiveAnchor: {
          type: "boolean",
          default: false
        },
        $vocabulary: {
          type: "object",
          propertyNames: {
            type: "string",
            format: "uri"
          },
          additionalProperties: {
            type: "boolean"
          }
        },
        $comment: {
          type: "string"
        },
        $defs: {
          type: "object",
          additionalProperties: { $recursiveRef: "#" },
          default: {}
        }
      }
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/format.json
var require_format3 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/format.json"(exports, module2) {
    module2.exports = {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "https://json-schema.org/draft/2019-09/meta/format",
      $vocabulary: {
        "https://json-schema.org/draft/2019-09/vocab/format": true
      },
      $recursiveAnchor: true,
      title: "Format vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        format: { type: "string" }
      }
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/meta-data.json
var require_meta_data = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/meta-data.json"(exports, module2) {
    module2.exports = {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "https://json-schema.org/draft/2019-09/meta/meta-data",
      $vocabulary: {
        "https://json-schema.org/draft/2019-09/vocab/meta-data": true
      },
      $recursiveAnchor: true,
      title: "Meta-data vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        deprecated: {
          type: "boolean",
          default: false
        },
        readOnly: {
          type: "boolean",
          default: false
        },
        writeOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        }
      }
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/validation.json
var require_validation2 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/meta/validation.json"(exports, module2) {
    module2.exports = {
      $schema: "https://json-schema.org/draft/2019-09/schema",
      $id: "https://json-schema.org/draft/2019-09/meta/validation",
      $vocabulary: {
        "https://json-schema.org/draft/2019-09/vocab/validation": true
      },
      $recursiveAnchor: true,
      title: "Validation vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/$defs/nonNegativeInteger" },
        minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        maxItems: { $ref: "#/$defs/nonNegativeInteger" },
        minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        maxContains: { $ref: "#/$defs/nonNegativeInteger" },
        minContains: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 1
        },
        maxProperties: { $ref: "#/$defs/nonNegativeInteger" },
        minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        required: { $ref: "#/$defs/stringArray" },
        dependentRequired: {
          type: "object",
          additionalProperties: {
            $ref: "#/$defs/stringArray"
          }
        },
        const: true,
        enum: {
          type: "array",
          items: true
        },
        type: {
          anyOf: [
            { $ref: "#/$defs/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/$defs/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        }
      },
      $defs: {
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 0
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      }
    };
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/index.js
var require_json_schema_2019_09 = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/refs/json-schema-2019-09/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var metaSchema = require_schema();
    var applicator = require_applicator2();
    var content = require_content();
    var core = require_core4();
    var format = require_format3();
    var metadata = require_meta_data();
    var validation = require_validation2();
    var META_SUPPORT_DATA = ["/properties"];
    function addMetaSchema2019($data) {
      ;
      [
        metaSchema,
        applicator,
        content,
        core,
        with$data(this, format),
        metadata,
        with$data(this, validation)
      ].forEach((sch) => this.addMetaSchema(sch, void 0, false));
      return this;
      function with$data(ajv, sch) {
        return $data ? ajv.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
      }
    }
    exports.default = addMetaSchema2019;
  }
});

// node_modules/@middy/validator/node_modules/ajv/dist/2019.js
var require__ = __commonJS({
  "node_modules/@middy/validator/node_modules/ajv/dist/2019.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var core_1 = require_core2();
    var draft7_1 = require_draft7();
    var dynamic_1 = require_dynamic();
    var next_1 = require_next();
    var unevaluated_1 = require_unevaluated();
    var discriminator_1 = require_discriminator();
    var json_schema_2019_09_1 = require_json_schema_2019_09();
    var META_SCHEMA_ID = "https://json-schema.org/draft/2019-09/schema";
    var Ajv2019 = class extends core_1.default {
      constructor(opts = {}) {
        super(__spreadProps(__spreadValues({}, opts), {
          dynamicRef: true,
          next: true,
          unevaluated: true
        }));
      }
      _addVocabularies() {
        super._addVocabularies();
        this.addVocabulary(dynamic_1.default);
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        this.addVocabulary(next_1.default);
        this.addVocabulary(unevaluated_1.default);
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data, meta } = this.opts;
        if (!meta)
          return;
        json_schema_2019_09_1.default.call(this, $data);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    module2.exports = exports = Ajv2019;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv2019;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
  }
});

// node_modules/ajv-i18n/localize/en/index.js
var require_en = __commonJS({
  "node_modules/ajv-i18n/localize/en/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_en(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "additionalProperties":
            out = "must NOT have additional properties";
            break;
          case "anyOf":
            out = 'must match a schema in "anyOf"';
            break;
          case "const":
            out = "must be equal to constant";
            break;
          case "contains":
            out = "must contain a valid item";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "must have propert";
            if (n == 1) {
              out += "y";
            } else {
              out += "ies";
            }
            out += " " + e.params.deps + " when property " + e.params.property + " is present";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'must pass "' + e.keyword + '" keyword validation';
            }
            break;
          case "enum":
            out = "must be equal to one of the allowed values";
            break;
          case "false schema":
            out = "boolean schema is false";
            break;
          case "format":
            out = 'must match format "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "if":
            out = 'must match "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "must NOT be longer than " + n + " character";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "must NOT have more than " + n + " propert";
            if (n == 1) {
              out += "y";
            } else {
              out += "ies";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "must NOT have less than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "must NOT be shorter than " + n + " character";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "must NOT have less than " + n + " propert";
            if (n == 1) {
              out += "y";
            } else {
              out += "ies";
            }
            break;
          case "multipleOf":
            out = "must be a multiple of " + e.params.multipleOf;
            break;
          case "not":
            out = 'must NOT be valid according to schema in "not"';
            break;
          case "oneOf":
            out = 'must match exactly one schema in "oneOf"';
            break;
          case "pattern":
            out = 'must match pattern "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'must have property matching pattern "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "property name is invalid";
            break;
          case "required":
            out = "must have required property " + e.params.missingProperty;
            break;
          case "type":
            out = "must be " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "must NOT have duplicate items (items ## " + e.params.j + " and " + e.params.i + " are identical)";
            break;
          default:
            out = 'must pass "' + e.keyword + '" keyword validation';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/ar/index.js
var require_ar = __commonJS({
  "node_modules/ajv-i18n/localize/ar/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_ar(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 " + n + " \u0639\u0646\u0635\u0631";
            break;
          case "additionalProperties":
            out = "\u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u062E\u0635\u0627\u0626\u0635 \u0625\u0636\u0627\u0641\u064A\u0629";
            break;
          case "anyOf":
            out = '\u064A\u062C\u0628 \u0623\u0646 \u064A\u0648\u0627\u0641\u0642 \u0623\u062D\u062F \u0627\u0644\u0645\u062E\u0637\u0637\u0627\u062A \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A "anyOf"';
            break;
          case "const":
            out = "\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u062B\u0627\u0628\u062A\u0627\u064B";
            break;
          case "contains":
            out = "\u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u0648\u064A \u0639\u0646\u0635\u0631\u0627 \u0635\u062D\u064A\u062D";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u0648\u064A \u0627\u0644\u062E\u0635\u0627\u0626\u0635 " + e.params.deps + " \u0639\u0646\u062F\u0645\u0627 \u062A\u0643\u0648\u0646 \u0627\u0644\u062E\u0627\u0635\u064A\u0629 " + e.params.property + " \u0645\u0648\u062C\u0648\u062F\u0629";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = '\u064A\u062C\u0628 \u0623\u0646 \u062A\u0645\u0631\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0645\u0641\u062A\u0627\u062D\u064A\u0629 "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "\u0642\u064A\u0645\u0629 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0645\u0633\u0627\u0648\u064A\u0629 \u0644\u0623\u062D\u062F \u0627\u0644\u0642\u064A\u0645 \u0627\u0644\u0645\u0639\u0631\u0641\u0629 \u0645\u0633\u0628\u0642\u0627\u064B";
            break;
          case "false schema":
            out = "\u0627\u0644\u0645\u062E\u0637\u0637 \u0627\u0644\u0645\u0646\u0637\u0642\u064A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D";
            break;
          case "format":
            out = '\u064A\u062C\u0628 \u0623\u0646 \u064A\u0648\u0627\u0641\u0642 \u0627\u0644\u0635\u064A\u063A\u0629 "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 " + cond;
            break;
          case "if":
            out = '\u064A\u062C\u0628 \u0623\u0646 \u062A\u0648\u0627\u0641\u0642 \u0627\u0644\u0645\u062E\u0637\u0637 "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 " + n + " \u0639\u0646\u0635\u0631";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 " + n + " \u0645\u062D\u0631\u0641";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 " + n + " \u062E\u0635\u0627\u0626\u0635";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0623\u0642\u0644 \u0645\u0646 " + n + " \u0639\u0646\u0635\u0631";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0623\u0642\u0644 \u0645\u0646 " + n + " \u0645\u062D\u0631\u0641";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += " \u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0623\u0642\u0644 \u0645\u0646 " + n + " \u062E\u0635\u0627\u0626\u0635";
            break;
          case "multipleOf":
            out = " \u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u0648\u064A \u0623\u0643\u062B\u0631 \u0645\u0646 " + e.params.multipleOf;
            break;
          case "not":
            out = '\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D \u0648\u0641\u0642\u0627\u064B \u0644\u0644\u0645\u062E\u0637\u0637 "not"';
            break;
          case "oneOf":
            out = '\u064A\u062C\u0628 \u0623\u0646 \u064A\u0648\u0627\u0641\u0642 \u0645\u062E\u0637\u0637 \u0648\u0627\u062D\u062F \u0641\u0642\u0637 \u0645\u0648\u062C\u0648\u062F \u0641\u064A "oneOf"';
            break;
          case "pattern":
            out = '\u064A\u062C\u0628 \u0623\u0646 \u064A\u0648\u0627\u0641\u0642 \u0627\u0644\u0646\u0645\u0637 "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = '\u064A\u062C\u0628 \u0623\u0646 \u064A\u062D\u0648\u064A \u062E\u0627\u0635\u064A\u0629 \u062A\u0648\u0627\u0641\u0642 \u0627\u0644\u0646\u0645\u0637 "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "\u0627\u0633\u0645 \u0627\u0644\u062E\u0627\u0635\u064A\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D";
            break;
          case "required":
            out = "\u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0625\u0644\u0632\u0627\u0645\u064A";
            break;
          case "type":
            out = "\u0642\u064A\u0645\u0629 \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629";
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "\u064A\u062C\u0628 \u0623\u0646 \u0644\u0627 \u064A\u062D\u0648\u064A \u0639\u0646\u0627\u0635\u0631 \u0645\u0643\u0631\u0631\u0629 (\u0627\u0644\u0639\u0646\u0635\u0631 ## " + e.params.j + " \u0648 " + e.params.i + " \u0645\u062A\u0637\u0627\u0628\u0642\u0629)";
            break;
          default:
            out = '\u064A\u062C\u0628 \u0623\u0646 \u062A\u0645\u0631\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0645\u0641\u062A\u0627\u062D\u064A\u0629 "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/ca/index.js
var require_ca = __commonJS({
  "node_modules/ajv-i18n/localize/ca/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_ca(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "no ha de tenir m\xE9s de " + n + " element";
            if (n != 1) {
              out += "s";
            }
            break;
          case "additionalProperties":
            out = "no ha de tenir propietats addicionals";
            break;
          case "anyOf":
            out = 'ha de coincidir amb algun esquema definit a "anyOf"';
            break;
          case "const":
            out = "ha de ser igual a la constant";
            break;
          case "contains":
            out = "ha de contenir un \xEDtem v\xE0lid";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "ha de contenir la propietat";
            if (n != 1) {
              out += "s";
            }
            out += " " + e.params.deps + " quan la propietat " + e.params.property + " \xE9s present";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'ha de passar la validaci\xF3 de la clau "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "ha de ser igual a un dels valors predefinits";
            break;
          case "false schema":
            out = "l\u2019esquema \xE9s fals";
            break;
          case "format":
            out = 'ha de coincidir amb el format "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "ha de ser " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "ha de ser " + cond;
            break;
          case "if":
            out = 'ha de correspondre\u2019s amb l\u2019esquema "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "ha de ser " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "no ha de tenir m\xE9s de " + n + " \xEDtem";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "no pot contenir m\xE9s de " + n + " car\xE0cter";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "no pot contenir m\xE9s de " + n + " propietat";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "ha de ser " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "no ha de tenir menys de " + n + " \xEDtem";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "no pot contenir menys de " + n + " car\xE0cter";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "no pot contenir menys de " + n + " propietat";
            if (n != 1) {
              out += "s";
            }
            break;
          case "multipleOf":
            out = "ha de ser m\xFAltiple de " + e.params.multipleOf;
            break;
          case "not":
            out = 'no ha de ser v\xE0lid d\u2019acord amb l\u2019esquema definit a "not"';
            break;
          case "oneOf":
            out = 'ha de coincidir nom\xE9s amb un esquema definit a "oneOf"';
            break;
          case "pattern":
            out = 'ha de coincidir amb el patr\xF3 "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'la propietat ha de coincidir amb el patr\xF3 "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "la propietat no \xE9s v\xE0lida";
            break;
          case "required":
            out = "ha de tenir la propietat requerida " + e.params.missingProperty;
            break;
          case "type":
            out = "ha de ser del tipus " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "no ha de tenir \xEDtems duplicats (els \xEDtems ## " + e.params.j + " i " + e.params.i + " s\xF3n id\xE8ntics)";
            break;
          default:
            out = 'ha de passar la validaci\xF3 de la clau "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/cs/index.js
var require_cs = __commonJS({
  "node_modules/ajv-i18n/localize/cs/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_cs(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "nem\u016F\u017Ee m\xEDt v\xEDc, ne\u017E " + n + " prv";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "ek";
            } else {
              out += "k\u016F";
            }
            break;
          case "additionalProperties":
            out = "nem\u016F\u017Ee m\xEDt dal\u0161\xED polo\u017Eky";
            break;
          case "anyOf":
            out = 'mus\xED vyhov\u011Bt alespo\u0148 jednomu sch\xE9matu v "anyOf"';
            break;
          case "const":
            out = "mus\xED b\xFDt roven konstant\u011B";
            break;
          case "contains":
            out = "mus\xED obsahovat prvek odpov\xEDdaj\xEDc\xED sch\xE9matu";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "mus\xED m\xEDt polo\u017E";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "ek";
            } else {
              out += "ka";
            }
            out += ": " + e.params.deps + ", pokud obsahuje " + e.params.property;
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'mus\xED vyhov\u011Bt "' + e.keyword + '" validaci';
            }
            break;
          case "enum":
            out = "mus\xED b\xFDt rovno jedn\xE9 hodnot\u011B z v\xFD\u010Dtu";
            break;
          case "false schema":
            out = "sch\xE9ma je false";
            break;
          case "format":
            out = 'mus\xED b\xFDt ve form\xE1tu "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED b\xFDt " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED b\xFDt " + cond;
            break;
          case "if":
            out = 'mus\xED vyhov\u011Bt "' + e.params.failingKeyword + '" sch\xE9matu';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED b\xFDt " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "nesm\xED obsahovat v\xEDc ne\u017E " + n + " prv";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "ek";
            } else {
              out += "k\u016F";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "nesm\xED b\xFDt del\u0161\xED ne\u017E " + n + " zna";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "k";
            } else {
              out += "k\u016F";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "nesm\xED m\xEDt v\xEDc ne\u017E " + n + " polo\u017E";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "ek";
            } else {
              out += "ka";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED b\xFDt " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "nesm\xED obsahovat m\xE9n\u011B ne\u017E " + n + " prv";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "ek";
            } else {
              out += "k\u016F";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "nesm\xED b\xFDt krat\u0161\xED ne\u017E " + n + " zna";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "k";
            } else {
              out += "k\u016F";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "nesm\xED m\xEDt m\xE9n\u011B ne\u017E " + n + " polo\u017E";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "ek";
            } else {
              out += "ka";
            }
            break;
          case "multipleOf":
            out = "mus\xED b\xFDt n\xE1sobkem " + e.params.multipleOf;
            break;
          case "not":
            out = 'nesm\xED vyhov\u011Bt sch\xE9matu v "not"';
            break;
          case "oneOf":
            out = 'mus\xED vyhov\u011Bt pr\xE1v\u011B jednomu sch\xE9matu v "oneOf"';
            break;
          case "pattern":
            out = 'mus\xED vyhov\u011Bt regul\xE1rn\xEDmu v\xFDrazu "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'mus\xED obsahovat polo\u017Eku vyhovuj\xEDc\xED regul\xE1rn\xEDmu v\xFDrazu "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "n\xE1zev polo\u017Eky nen\xED platn\xFD";
            break;
          case "required":
            out = "mus\xED obsahovat po\u017Eadovanou polo\u017Eku " + e.params.missingProperty;
            break;
          case "type":
            out = "mus\xED b\xFDt " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "nesm\xED obsahovat duplicitn\xED prvky (prvky ## " + e.params.j + " a " + e.params.i + " jsou identick\xE9)";
            break;
          default:
            out = 'mus\xED vyhov\u011Bt "' + e.keyword + '" validaci';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/de/index.js
var require_de = __commonJS({
  "node_modules/ajv-i18n/localize/de/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_de(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "darf nicht mehr als " + n + " Element";
            if (n != 1) {
              out += "e";
            }
            out += " enthalten";
            break;
          case "additionalProperties":
            out = "darf keine zus\xE4tzlichen Attribute haben";
            break;
          case "anyOf":
            out = 'muss einem der Schemata in "anyOf" entsprechen';
            break;
          case "const":
            out = "muss gleich der Konstanten sein";
            break;
          case "contains":
            out = "muss ein valides Element enthalten";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "muss Attribut";
            if (n != 1) {
              out += "e";
            }
            out += " " + e.params.deps + " aufweisen, wenn Attribut " + e.params.property + " gesetzt ist";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'der Tag "' + e.params.tag + '" muss eine Zeichenkette sein';
                break;
              case "mapping":
                out = 'der Wert vom Tag "' + e.params.tag + '" muss im oneOf enthalten sein';
                break;
              default:
                out = 'muss die Validierung "' + e.keyword + '" bestehen';
            }
            break;
          case "enum":
            out = "muss einem der vorgegebenen Werte entsprechen";
            break;
          case "false schema":
            out = "boolesches Schema ist falsch";
            break;
          case "format":
            out = 'muss diesem Format entsprechen: "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "muss " + cond + " sein";
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "muss " + cond + " sein";
            break;
          case "if":
            out = 'muss dem Schema "' + e.params.failingKeyword + '" entsprechen';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "muss " + cond + " sein";
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "darf nicht mehr als " + n + " Element";
            if (n != 1) {
              out += "e";
            }
            out += " haben";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "darf nicht l\xE4nger als " + n + " Zeichen sein";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "darf nicht mehr als " + n + " Attribut";
            if (n != 1) {
              out += "e";
            }
            out += " haben";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "muss " + cond + " sein";
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "darf nicht weniger als " + n + " Element";
            if (n != 1) {
              out += "e";
            }
            out += " haben";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "darf nicht k\xFCrzer als " + n + " Zeichen sein";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "darf nicht weniger als " + n + " Attribut";
            if (n != 1) {
              out += "e";
            }
            out += " haben";
            break;
          case "multipleOf":
            out = "muss ein Vielfaches von " + e.params.multipleOf + " sein";
            break;
          case "not":
            out = 'muss dem in "not" angegebenen Schema widersprechen';
            break;
          case "oneOf":
            out = 'muss genau einem der Schemata in "oneOf" entsprechen';
            break;
          case "pattern":
            out = 'muss diesem Muster entsprechen: "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'muss ein Attribut nach folgendem Muster haben "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "Attributname ist ung\xFCltig";
            break;
          case "required":
            out = "muss das erforderliche Attribut " + e.params.missingProperty + " enthalten";
            break;
          case "type":
            out = "muss sein: " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "darf nicht mehr als " + n + " Element";
            if (n != 1) {
              out += "e";
            }
            out += " haben";
            break;
          case "unevaluatedProperties":
            out = "darf keine unausgewerteten Attribute haben";
            break;
          case "uniqueItems":
            out = "darf keine Duplikate enthalten (Elemente #" + e.params.j + " und #" + e.params.i + " sind gleich)";
            break;
          default:
            out = 'muss die Validierung "' + e.keyword + '" bestehen';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/es/index.js
var require_es = __commonJS({
  "node_modules/ajv-i18n/localize/es/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_es(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "no debe tener m\xE1s de " + n + " elemento";
            if (n != 1) {
              out += "s";
            }
            break;
          case "additionalProperties":
            out = "no debe tener propiedades adicionales";
            break;
          case "anyOf":
            out = 'debe coincidir con alg\xFAn esquema en "anyOf"';
            break;
          case "const":
            out = "debe ser igual a la constante";
            break;
          case "contains":
            out = "debe contener un elemento v\xE1lido";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "debe contener la";
            if (n != 1) {
              out += "s";
            }
            out += " propiedad";
            if (n != 1) {
              out += "es";
            }
            out += " " + e.params.deps + " cuando la propiedad " + e.params.property + " se encuentra presente";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'debe pasar la validaci\xF3n de palabra clave "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "deber ser igual a uno de los valores predefinidos";
            break;
          case "false schema":
            out = "el esquema \xE9s falso";
            break;
          case "format":
            out = 'debe coincidir con el formato "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "debe ser " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "debe ser " + cond;
            break;
          case "if":
            out = 'debe corresponderse con el esquema "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "debe ser " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "no debe contener m\xE1s de " + n + " elemento";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "no debe contener m\xE1s de " + n + " caracter";
            if (n != 1) {
              out += "es";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "no debe contener m\xE1s de " + n + " propiedad";
            if (n != 1) {
              out += "es";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "debe ser " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "no debe contener menos de " + n + " elemento";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "no debe contener menos de " + n + " caracter";
            if (n != 1) {
              out += "es";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "no debe contener menos de " + n + " propiedad";
            if (n != 1) {
              out += "es";
            }
            break;
          case "multipleOf":
            out = "debe ser m\xFAltiplo de " + e.params.multipleOf;
            break;
          case "not":
            out = 'no debe ser v\xE1lido seg\xFAn el esquema en "not"';
            break;
          case "oneOf":
            out = 'debe coincidir con un solo esquema en "oneOf"';
            break;
          case "pattern":
            out = 'debe coincidir con el patron "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'la propiedad debe coincidir con el patr\xF3n "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "la propiedad no \xE9s v\xE1lida";
            break;
          case "required":
            out = "debe tener la propiedad requerida " + e.params.missingProperty;
            break;
          case "type":
            out = "debe ser " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "no debe contener elementos duplicados, (los elementos ## " + e.params.j + " y " + e.params.i + " son id\xE9nticos)";
            break;
          default:
            out = 'debe pasar la validaci\xF3n de palabra clave "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/fr/index.js
var require_fr = __commonJS({
  "node_modules/ajv-i18n/localize/fr/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_fr(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "ne doit pas contenir plus de " + n + " \xE9l\xE9m\xE9nt";
            if (n != 1) {
              out += "s";
            }
            break;
          case "additionalProperties":
            out = "ne doit pas contenir de propri\xE9t\xE9s additionnelles";
            break;
          case "anyOf":
            out = 'doit correspondre \xE0 un sch\xE9ma de "anyOf"';
            break;
          case "const":
            out = "doit \xEAtre \xE9gal \xE0 la constante";
            break;
          case "contains":
            out = "doit contenir un \xE9l\xE9ment valide";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "doit avoir la propri\xE9t\xE9 " + e.params.deps + " quand la propri\xE9t\xE9 " + e.params.property + " est pr\xE9sente";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'doit \xEAtre valide selon le crit\xE8re "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "doit \xEAtre \xE9gal \xE0 une des valeurs pr\xE9d\xE9finies";
            break;
          case "false schema":
            out = 'le schema est "false"';
            break;
          case "format":
            out = 'doit correspondre au format "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "doit \xEAtre " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "doit \xEAtre " + cond;
            break;
          case "if":
            out = 'doit correspondre au sch\xE9ma "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "doit \xEAtre " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "ne doit pas contenir plus de " + n + " \xE9l\xE9ment";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "ne doit pas d\xE9passer " + n + " caract\xE8re";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "ne doit pas contenir plus de " + n + " propri\xE9t\xE9";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "doit \xEAtre " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "ne doit pas contenir moins de " + n + " \xE9l\xE9ment";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "ne doit pas faire moins de " + n + " caract\xE8re";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "ne doit pas contenir moins de " + n + " propri\xE9t\xE9";
            if (n != 1) {
              out += "s";
            }
            break;
          case "multipleOf":
            out = "doit \xEAtre un multiple de " + e.params.multipleOf;
            break;
          case "not":
            out = 'est invalide selon le sch\xE9ma "not"';
            break;
          case "oneOf":
            out = 'doit correspondre \xE0 exactement un sch\xE9ma de "oneOf"';
            break;
          case "pattern":
            out = 'doit correspondre au format "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'la propri\xE9t\xE9 doit correspondre au format "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "le nom de propri\xE9t\xE9 est invalide";
            break;
          case "required":
            out = "requiert la propri\xE9t\xE9 " + e.params.missingProperty;
            break;
          case "type":
            out = "doit \xEAtre de type " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "ne doit pas contenir de doublons (les \xE9l\xE9ments ## " + e.params.j + " et " + e.params.i + " sont identiques)";
            break;
          default:
            out = 'doit \xEAtre valide selon le crit\xE8re "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/hu/index.js
var require_hu = __commonJS({
  "node_modules/ajv-i18n/localize/hu/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_hu(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "nem lehet t\xF6bb, mint " + n + " eleme";
            break;
          case "additionalProperties":
            out = "nem lehetnek tov\xE1bbi elemei";
            break;
          case "anyOf":
            out = 'meg kell feleljen legal\xE1bb egy "anyOf" alaknak';
            break;
          case "const":
            out = "must be equal to constant";
            break;
          case "contains":
            out = "must contain a valid item";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "-nak kell legyen";
            if (n > 1) {
              out += "ek";
            }
            out += " a k\xF6vetkez\u0151 tulajdons\xE1ga";
            if (n != 1) {
              out += "i";
            }
            out += ": " + e.params.deps + ", ha van " + e.params.property + " tulajdons\xE1ga";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'must pass "' + e.keyword + '" keyword validation';
            }
            break;
          case "enum":
            out = "egyenl\u0151 kell legyen valamely el\u0151re meghat\xE1rozott \xE9rt\xE9kkel";
            break;
          case "false schema":
            out = "boolean schema is false";
            break;
          case "format":
            out = 'meg kell feleljen a k\xF6vetkez\u0151 form\xE1tumnak: "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "if":
            out = 'must match "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "kell legyen " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "nem lehet t\xF6bb, mint " + n + " eleme";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "nem lehet hosszabb, mint " + n + " szimb\xF3lum";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "nem lehet t\xF6bb, mint " + n + " tulajdons\xE1ga";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "kell legyen " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "nem lehet kevesebb, mint " + n + " eleme";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "nem lehet r\xF6videbb, mint " + n + " szimb\xF3lum";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "nem lehet kevesebb, mint " + n + " tulajdons\xE1ga";
            break;
          case "multipleOf":
            out = "a t\xF6bbsz\xF6r\xF6se kell legyen a k\xF6vetkez\u0151 sz\xE1mnak: " + e.params.multipleOf;
            break;
          case "not":
            out = 'nem lehet \xE9rv\xE9nyes a "not" alaknak megfelel\u0151en';
            break;
          case "oneOf":
            out = 'meg kell feleljen pontosan egy "oneOf" alaknak';
            break;
          case "pattern":
            out = 'meg kell feleljen a k\xF6vetkez\u0151 mint\xE1nak: "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'must have property matching pattern "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "property name is invalid";
            break;
          case "required":
            out = "kell legyen " + e.params.missingProperty + " tulajdons\xE1ga";
            break;
          case "type":
            out = "" + e.params.type + " kell legyen";
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "nem lehetnek azonos elemei (" + e.params.j + " \xE9s " + e.params.i + " elemek azonosak)";
            break;
          default:
            out = 'must pass "' + e.keyword + '" keyword validation';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/id/index.js
var require_id2 = __commonJS({
  "node_modules/ajv-i18n/localize/id/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_id(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += " tidak boleh memiliki lebih dari " + n + " item";
            break;
          case "additionalProperties":
            out = "tidak boleh memiliki properti tambahan";
            break;
          case "anyOf":
            out = 'harus cocok dengan beberapa skema pada "anyOf"';
            break;
          case "const":
            out = "harus sama dengan konstan";
            break;
          case "contains":
            out = "harus berisi item yang valid";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += " harus memiliki properti " + e.params.deps + " ketika properti " + e.params.property + " hadir";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'harus lulus validasi kata kunci "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "harus sama dengan salah satu dari nilai yang telah ditentukan";
            break;
          case "false schema":
            out = "skema boolean salah";
            break;
          case "format":
            out = 'harus cocok dengan format "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "harus " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "harus " + cond;
            break;
          case "if":
            out = 'harus cocok dengan skema "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "harus " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += " tidak boleh memiliki lebih dari " + n + " item";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += " tidak boleh lebih dari " + n + " karakter";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += " tidak boleh memiliki lebih dari " + n + " properti";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "harus " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += " tidak boleh kurang dari " + n + " item";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += " tidak boleh lebih pendek dari " + n + " karakter";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += " tidak boleh kurang dari " + n + " properti";
            break;
          case "multipleOf":
            out = "harus merupakan kelipatan dari " + e.params.multipleOf;
            break;
          case "not":
            out = 'tidak boleh valid sesuai dengan skema pada "not"';
            break;
          case "oneOf":
            out = 'harus sama persis dengan satu skema pada "oneOf"';
            break;
          case "pattern":
            out = 'harus cocok dengan pola "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'harus memiliki pola pencocokan properti "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "nama properti tidak valid";
            break;
          case "required":
            out = "harus memiliki properti " + e.params.missingProperty;
            break;
          case "type":
            out = "harus berupa " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "tidak boleh memiliki item duplikat (item ## " + e.params.j + " dan " + e.params.i + " identik)";
            break;
          default:
            out = 'harus lulus validasi kata kunci "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/it/index.js
var require_it = __commonJS({
  "node_modules/ajv-i18n/localize/it/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_it(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "non dovrebbe avere pi\xF9 di " + n + " element";
            if (n == 1) {
              out += "o";
            } else {
              out += "i";
            }
            break;
          case "additionalProperties":
            out = "non deve avere attributi aggiuntivi";
            break;
          case "anyOf":
            out = 'deve corrispondere ad uno degli schema in "anyOf"';
            break;
          case "const":
            out = "deve essere uguale alla costante";
            break;
          case "contains":
            out = "deve contentere un elemento valido";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "dovrebbe avere ";
            if (n == 1) {
              out += "l'";
            } else {
              out += "gli ";
            }
            out += "attribut";
            if (n == 1) {
              out += "o";
            } else {
              out += "i";
            }
            out += " " + e.params.deps + " quando l'attributo " + e.params.property + " \xE8 presente";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'il tag "' + e.params.tag + '" deve essere di tipo stringa';
                break;
              case "mapping":
                out = 'il valore del tag "' + e.params.tag + '" deve essere nei oneOf';
                break;
              default:
                out = 'deve essere valido secondo il criterio "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "deve essere uguale ad uno dei valori consentiti";
            break;
          case "false schema":
            out = "lo schema booleano \xE8 falso";
            break;
          case "format":
            out = 'deve corrispondere al formato "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve essere " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve essere " + cond;
            break;
          case "if":
            out = 'deve corrispondere allo schema "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve essere " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "non deve avere pi\xF9 di " + n + " element";
            if (n == 1) {
              out += "o";
            } else {
              out += "i";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "non deve essere pi\xF9 lungo di " + n + " caratter";
            if (n == 1) {
              out += "e";
            } else {
              out += "i";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "non deve avere pi\xF9 di " + n + " attribut";
            if (n == 1) {
              out += "o";
            } else {
              out += "i";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve essere " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "non deve avere meno di " + n + " element";
            if (n == 1) {
              out += "o";
            } else {
              out += "i";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "non deve essere meno lungo di " + n + " caratter";
            if (n == 1) {
              out += "e";
            } else {
              out += "i";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "non deve avere meno di " + n + " attribut";
            if (n == 1) {
              out += "o";
            } else {
              out += "i";
            }
            break;
          case "multipleOf":
            out = "deve essere un multiplo di " + e.params.multipleOf;
            break;
          case "not":
            out = 'non deve essere valido in base allo schema di "non"';
            break;
          case "oneOf":
            out = 'deve corrispondere esattamente ad uno degli schema in "oneOf"';
            break;
          case "pattern":
            out = 'deve corrispondere al formato "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'deve avere un attributo che corrisponda al formato "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "il nome dell'attritbuto non \xE8 valido";
            break;
          case "required":
            out = "deve avere l'attributo obbligatorio " + e.params.missingProperty;
            break;
          case "type":
            out = "deve essere di tipo " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "non deve avere pi\xF9 di " + n + " elementi";
            if (n == 1) {
              out += "o";
            } else {
              out += "i";
            }
            break;
          case "unevaluatedProperties":
            out = "non deve avere attributi non valutati";
            break;
          case "uniqueItems":
            out = "non deve avere duplicati (gli elementi ## " + e.params.j + " e " + e.params.i + " sono uguali)";
            break;
          default:
            out = 'deve essere valido secondo il criterio "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/ja/index.js
var require_ja = __commonJS({
  "node_modules/ajv-i18n/localize/ja/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_ja(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "\u306F" + n + "\u4EE5\u4E0A\u3042\u3063\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "additionalProperties":
            out = "\u8FFD\u52A0\u3057\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "anyOf":
            out = '"anyOf"\u306E\u30B9\u30AD\u30FC\u30DE\u3068\u30DE\u30C3\u30C1\u3057\u306A\u304F\u3066\u306F\u3044\u3051\u306A\u3044';
            break;
          case "const":
            out = "must be equal to constant";
            break;
          case "contains":
            out = "must contain a valid item";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "" + e.params.property + "\u304C\u3042\u308B\u5834\u5408\u3001";
            var n = e.params.depsCount;
            out += "\u306F" + e.params.deps + "\u3092\u3064\u3051\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'must pass "' + e.keyword + '" keyword validation';
            }
            break;
          case "enum":
            out = "\u4E8B\u524D\u306B\u5B9A\u7FA9\u3055\u308C\u305F\u5024\u306E\u3044\u305A\u308C\u304B\u306B\u7B49\u3057\u304F\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044";
            break;
          case "false schema":
            out = "boolean schema is false";
            break;
          case "format":
            out = '"' + e.params.format + '"\u5F62\u5F0F\u306B\u63C3\u3048\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "must be " + cond;
            break;
          case "if":
            out = 'must match "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += cond + "\u3067\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044";
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "\u306F" + n + "\u500B\u4EE5\u4E0A\u3067\u3042\u3063\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "\u306F" + n + "\u6587\u5B57\u4EE5\u4E0A\u3067\u3042\u3063\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "\u306F" + n + "\u500B\u4EE5\u4E0A\u306E\u30D7\u30ED\u30D1\u30C6\u30A3\u3092\u6709\u3057\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += cond + "\u3067\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044";
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "\u306F" + n + "\u500B\u4EE5\u4E0B\u3067\u3042\u3063\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "\u306F" + n + "\u6587\u5B57\u4EE5\u4E0B\u3067\u3042\u3063\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "\u306F" + n + "\u500B\u4EE5\u4E0B\u306E\u30D7\u30ED\u30D1\u30C6\u30A3\u3092\u6709\u3057\u3066\u306F\u3044\u3051\u306A\u3044";
            break;
          case "multipleOf":
            out = "" + e.params.multipleOf + "\u306E\u500D\u6570\u3067\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044";
            break;
          case "not":
            out = '"not"\u306E\u30B9\u30AD\u30FC\u30DE\u306B\u5F93\u3063\u3066\u6709\u52B9\u3068\u3057\u3066\u306F\u3044\u3051\u306A\u3044';
            break;
          case "oneOf":
            out = '"oneOf"\u306E\u30B9\u30AD\u30FC\u30DE\u3068\u5B8C\u5168\u306B\u4E00\u81F4\u3057\u306A\u304F\u3066\u306F\u3044\u3051\u306A\u3044';
            break;
          case "pattern":
            out = '"' + e.params.pattern + '"\u306E\u30D1\u30BF\u30FC\u30F3\u3068\u4E00\u81F4\u3057\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044';
            break;
          case "patternRequired":
            out = 'must have property matching pattern "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "property name is invalid";
            break;
          case "required":
            out = "\u5FC5\u8981\u306A\u30D7\u30ED\u30D1\u30C6\u30A3" + e.params.missingProperty + "\u304C\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044";
            break;
          case "type":
            out = "" + e.params.type + "\u3067\u306A\u3051\u308C\u3070\u3044\u3051\u306A\u3044";
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "\u91CD\u8907\u3059\u308B\u30A2\u30A4\u30C6\u30E0\u304C\u3042\u3063\u3066\u306F\u3044\u3051\u306A\u3044\uFF08" + e.params.j + "\u3068" + e.params.i + "\u306F\u540C\u3058\u3067\u3042\u308B\uFF09";
            break;
          default:
            out = 'must pass "' + e.keyword + '" keyword validation';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/ko/index.js
var require_ko = __commonJS({
  "node_modules/ajv-i18n/localize/ko/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_ko(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += " \uD56D\uBAA9\uC740 \uC544\uC774\uD15C\uC744 " + n + "\uAC1C \uC774\uC0C1 \uAC00\uC9C8 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4";
            break;
          case "additionalProperties":
            out = "\uCD94\uAC00\uC801\uC778 \uC18D\uC131\uC740 \uD5C8\uC6A9\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4";
            break;
          case "anyOf":
            out = '"anyOf"\uC758 \uC2A4\uD0A4\uB9C8\uC640 \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4';
            break;
          case "const":
            out = "\uC0C1\uC218\uC640 \uAC19\uC544\uC57C\uD569\uB2C8\uB2E4";
            break;
          case "contains":
            out = "\uC62C\uBC14\uB978 \uC544\uC774\uD15C\uC744 \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += e.params.property + "\uC18D\uC131\uC774 \uC788\uB294 \uACBD\uC6B0, " + e.params.deps + " \uC18D\uC131\uC774 \uC788\uC5B4\uC57C\uD569\uB2C8\uB2E4";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = '"' + e.params.tag + '"\uD0DC\uADF8\uB294 \uBC18\uB4DC\uC2DC \uBB38\uC790\uC5F4\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4';
                break;
              case "mapping":
                out = '"' + e.params.tag + '"\uD0DC\uADF8\uC758 \uAC12\uC740 \uBC18\uB4DC\uC2DC oneOf\uC5D0 \uC788\uC5B4\uC57C \uD569\uB2C8\uB2E4';
                break;
              default:
                out = '"' + e.keyword + '"\uD0A4\uC6CC\uB4DC \uAC80\uC0AC\uB97C \uD1B5\uACFC\uD574\uC57C \uD569\uB2C8\uB2E4';
            }
            break;
          case "enum":
            out = "\uBBF8\uB9AC \uC815\uC758\uB41C \uAC12\uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "false schema":
            out = "boolean \uC2A4\uD0A4\uB9C8\uB294 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4";
            break;
          case "format":
            out = '"' + e.params.format + '" \uD3EC\uB9F7\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " " + cond + " \uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " " + cond + " \uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "if":
            out = '"' + e.params.failingKeyword + '" \uC2A4\uD0A4\uB9C8\uC640 \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " " + cond + " \uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "\uC544\uC774\uD15C\uC774 \uCD5C\uB300 " + n + "\uAC1C\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "\uCD5C\uB300 " + n + "\uAE00\uC790\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "\uC18D\uC131\uC740 \uCD5C\uB300 " + n + "\uAC1C \uC774\uB0B4\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += " " + cond + " \uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "\uC544\uC774\uD15C\uC774 \uCD5C\uC18C " + n + "\uAC1C\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "\uCD5C\uC18C " + n + "\uAE00\uC790\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "\uC18D\uC131\uC740 \uCD5C\uC18C " + n + "\uAC1C \uC774\uC0C1\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "multipleOf":
            out = "" + e.params.multipleOf + "\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "not":
            out = '"not"\uC2A4\uD0A4\uB9C8\uC5D0 \uB530\uB77C \uC720\uD6A8\uD558\uC9C0 \uC54A\uC544\uC57C \uD569\uB2C8\uB2E4';
            break;
          case "oneOf":
            out = '"oneOf" \uC2A4\uD0A4\uB9C8\uC911 \uD558\uB098\uC640 \uC815\uD655\uD558\uAC8C \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4';
            break;
          case "pattern":
            out = '"' + e.params.pattern + '"\uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4';
            break;
          case "patternRequired":
            out = '"' + e.params.missingPattern + '"\uD328\uD134\uACFC \uC77C\uCE58\uD558\uB294 \uC18D\uC131\uC744 \uAC00\uC838\uC57C \uD569\uB2C8\uB2E4';
            break;
          case "propertyNames":
            out = "\uC18D\uC131\uBA85\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4";
            break;
          case "required":
            out = "" + e.params.missingProperty + " \uC18D\uC131\uC740 \uD544\uC218\uC785\uB2C8\uB2E4";
            break;
          case "type":
            out = "" + e.params.type + "\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4";
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "\uD56D\uBAA9\uC774 " + n + "\uAC1C \uC544\uC774\uD15C\uC744 \uCD08\uACFC\uD558\uBA74 \uC548\uB429\uB2C8\uB2E4";
            break;
          case "unevaluatedProperties":
            out = "\uD3C9\uAC00\uB418\uC9C0 \uC54A\uC740 \uC18D\uC131\uC774 \uC5C6\uC5B4\uC57C\uD569\uB2C8\uB2E4.";
            break;
          case "uniqueItems":
            out = "\uC911\uBCF5 \uC544\uC774\uD15C\uC774 \uC5C6\uC5B4\uC57C \uD569\uB2C8\uB2E4 (\uC544\uC774\uD15C" + e.params.j + "\uACFC \uC544\uC774\uD15C" + e.params.i + "\uAC00 \uB3D9\uC77C\uD569\uB2C8\uB2E4)";
            break;
          default:
            out = '"' + e.keyword + '"\uD0A4\uC6CC\uB4DC \uAC80\uC0AC\uB97C \uD1B5\uACFC\uD574\uC57C \uD569\uB2C8\uB2E4';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/nb/index.js
var require_nb = __commonJS({
  "node_modules/ajv-i18n/localize/nb/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_nb(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "kan ikke ha mer enn " + n + " element";
            if (n != 1) {
              out += "er";
            }
            break;
          case "additionalProperties":
            out = "kan ikke ha flere egenskaper";
            break;
          case "anyOf":
            out = 'm\xE5 samsvare med et schema i "anyOf"';
            break;
          case "const":
            out = "m\xE5 v\xE6re lik konstanten";
            break;
          case "contains":
            out = "m\xE5 inneholde et gyldig element";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "m\xE5 ha egenskapen";
            if (n != 1) {
              out += "e";
            }
            out += " " + e.params.deps + " n\xE5r egenskapen " + e.params.property + " er angitt";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = "m\xE5 samsvare med valideringen for " + e.keyword;
            }
            break;
          case "enum":
            out = "m\xE5 v\xE6re lik en av de forh\xE5ndsdefinerte verdiene";
            break;
          case "false schema":
            out = "boolsk schema er usannt";
            break;
          case "format":
            out = 'm\xE5 stemme overens med formatet "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "m\xE5 v\xE6re " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "m\xE5 v\xE6re " + cond;
            break;
          case "if":
            out = 'must match "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "m\xE5 v\xE6re " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "kan ikke ha fler enn " + n + " element";
            if (n != 1) {
              out += "er";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "kan ikke v\xE6re lengre enn " + n + " tegn";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "kan ikke ha mer enn " + n + " egenskap";
            if (n != 1) {
              out += "er";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "m\xE5 v\xE6re " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "kan ikke ha f\xE6rre enn " + n + " element";
            if (n != 1) {
              out += "er";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "kan ikke v\xE6re kortere enn " + n + " tegn";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "kan ikke ha mindre enn " + n + " egenskap";
            if (n != 1) {
              out += "er";
            }
            break;
          case "multipleOf":
            out = "m\xE5 v\xE6re et multiplum av " + e.params.multipleOf;
            break;
          case "not":
            out = 'kan ikke samsvare med schema i "not"';
            break;
          case "oneOf":
            out = 'm\xE5 samsvare med n\xF8yaktig ett schema i "oneOf"';
            break;
          case "pattern":
            out = 'm\xE5 samsvare med m\xF8nsteret "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'm\xE5 ha en egenskap som samsvarer med m\xF8nsteret "' + e.params.missingPattern;
            break;
          case "propertyNames":
            out = "egenskapen med navnet '";
            e.params.propertyNameout += "' er ugyldig";
            break;
          case "required":
            out = "m\xE5 ha den p\xE5krevde egenskapen " + e.params.missingProperty;
            break;
          case "type":
            out = "";
            var t = e.params.type;
            out += "m\xE5 v\xE6re ";
            if (t == "number") {
              out += "et tall";
            } else if (t == "integer") {
              out += "et heltall";
            } else if (t == "string") {
              out += "en streng";
            } else if (t == "boolean") {
              out += "ja eller nei";
            } else {
              out += t;
            }
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "kan ikke ha duplikate elemeneter (elementene ## " + e.params.j + " og " + e.params.i + " er identiske)";
            break;
          default:
            out = "m\xE5 samsvare med valideringen for " + e.keyword;
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/nl/index.js
var require_nl = __commonJS({
  "node_modules/ajv-i18n/localize/nl/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_nl(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "mag niet meer dan " + n + " item";
            if (n != 1) {
              out += "s";
            }
            out += " bevatten";
            break;
          case "additionalProperties":
            out = "mag geen extra eigenschappen bevatten";
            break;
          case "anyOf":
            out = 'moet overeenkomen met een schema in "anyOf"';
            break;
          case "const":
            out = "moet gelijk zijn aan constante";
            break;
          case "contains":
            out = "moet een geldig item bevatten";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "moet de eigenschap";
            if (n != 1) {
              out += "pen";
            }
            out += " " + e.params.deps + " bevatten als " + e.params.property + " is gedefinieerd";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" moet een tekenreeks zijn';
                break;
              case "mapping":
                out = 'de waarde van het veld "' + e.params.tag + '" moet voorkomen in de oneOf';
                break;
              default:
                out = 'moet sleutelwoord validatie "' + e.keyword + '" doorstaan';
            }
            break;
          case "enum":
            out = "moet overeenkomen met \xE9\xE9n van de voorgedefinieerde waarden";
            break;
          case "false schema":
            out = "boolean schema is fout";
            break;
          case "format":
            out = 'moet overeenkomen met het volgende formaat: "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "moet " + cond + " zijn";
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "moet " + cond + " zijn";
            break;
          case "if":
            out = 'moet overeenkomen met "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "moet " + cond + " zijn";
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "mag niet meer dan " + n + " item";
            if (n != 1) {
              out += "s";
            }
            out += " bevatten";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "mag niet langer dan " + n + " karakter";
            if (n != 1) {
              out += "s";
            }
            out += " zijn";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "mag niet meer dan " + n + " eigenschap";
            if (n != 1) {
              out += "pen";
            }
            out += " bevatten";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "moet " + cond + " zijn";
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "mag niet minder dan " + n + " item";
            if (n != 1) {
              out += "s";
            }
            out += " bevatten";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "mag niet korter dan " + n + " karakter";
            if (n != 1) {
              out += "s";
            }
            out += " zijn";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "mag niet minder dan " + n + " eigenschap";
            if (n != 1) {
              out += "pen";
            }
            out += " bevatten";
            break;
          case "multipleOf":
            out = "moet een veelvoud van " + e.params.multipleOf + " zijn";
            break;
          case "not":
            out = 'mag niet overeenkomen met een schema in "not"';
            break;
          case "oneOf":
            out = 'moet overeenkomen met \xE9\xE9n schema in "oneOf"';
            break;
          case "pattern":
            out = 'moet overeenkomen met het volgende patroon: "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'moet een eigenschap bevatten die overeenkomt met het pattroon: "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "eigenschapnaam is ongeldig";
            break;
          case "required":
            out = "moet de eigenschap " + e.params.missingProperty + " bevatten";
            break;
          case "type":
            out = "";
            var t = e.params.type;
            out += "moet een ";
            if (t == "number") {
              out += "nummer";
            } else if (t == "integer") {
              out += "geheel getal";
            } else if (t == "string") {
              out += "tekenreeks";
            } else if (t == "boolean") {
              out += "ja of nee waarde";
            }
            out += " (" + t + ") bevatten";
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "mag niet meer dan " + n + " item";
            if (n != 1) {
              out += "s";
            }
            out += " bevatten";
            break;
          case "unevaluatedProperties":
            out = "mag geen ongecontroleerde eigenschappen bevatten";
            break;
          case "uniqueItems":
            out = "mag geen gedupliceerde items bevatten (items ## " + e.params.j + " en " + e.params.i + " zijn identiek)";
            break;
          default:
            out = 'moet sleutelwoord validatie "' + e.keyword + '" doorstaan';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/pl/index.js
var require_pl = __commonJS({
  "node_modules/ajv-i18n/localize/pl/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_pl(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "nie powinien mie\u0107 wi\u0119cej ni\u017C " + n + " element";
            if (n == 1) {
              out += "u";
            } else {
              out += "\xF3w";
            }
            break;
          case "additionalProperties":
            out = "nie powinien zawiera\u0107 dodatkowych p\xF3l";
            break;
          case "anyOf":
            out = 'powinien pasowa\u0107 do wzoru z sekcji "anyOf"';
            break;
          case "const":
            out = "powinien by\u0107 r\xF3wny sta\u0142ej";
            break;
          case "contains":
            out = "must contain a valid item";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "powinien zawiera\u0107 pol";
            if (n == 1) {
              out += "e";
            } else {
              out += "a";
            }
            out += " " + e.params.deps + " kiedy pole " + e.params.property + " jest obecne";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'powinien przej\u015B\u0107 walidacj\u0119 "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "powinien by\u0107 r\xF3wny jednej z predefiniowanych warto\u015Bci";
            break;
          case "false schema":
            out = "boolean schema is false";
            break;
          case "format":
            out = 'powinien zgadza\u0107 si\u0119 z formatem "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "powinien by\u0107 " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "powinien by\u0107 " + cond;
            break;
          case "if":
            out = 'must match "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "powinien by\u0107 " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "nie powinien mie\u0107 wi\u0119cej ni\u017C " + n + " element";
            if (n == 1) {
              out += "u";
            } else {
              out += "\xF3w";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "nie powinien by\u0107 d\u0142u\u017Cszy ni\u017C " + n + " znak";
            if (n != 1) {
              out += "\xF3w";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "nie powinien zawiera\u0107 wi\u0119cej ni\u017C " + n + " ";
            if (n == 1) {
              out += "pole";
            } else {
              out += "p\xF3l";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "powinien by\u0107 " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "nie powinien mie\u0107 mniej ni\u017C " + n + " element";
            if (n == 1) {
              out += "u";
            } else {
              out += "\xF3w";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "nie powinien by\u0107 kr\xF3tszy ni\u017C " + n + " znak";
            if (n != 1) {
              out += "\xF3w";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "nie powinien zawiera\u0107 mniej ni\u017C " + n + " ";
            if (n == 1) {
              out += "pole";
            } else {
              out += "p\xF3l";
            }
            break;
          case "multipleOf":
            out = "powinien by\u0107 wielokrotno\u015Bci\u0105 " + e.params.multipleOf;
            break;
          case "not":
            out = 'nie powinien pasowa\u0107 do wzoru z sekcji "not"';
            break;
          case "oneOf":
            out = 'powinien pasowa\u0107 do jednego wzoru z sekcji "oneOf"';
            break;
          case "pattern":
            out = 'powinien zgadza\u0107 si\u0119 ze wzorem "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'powinien mie\u0107 pole pasuj\u0105ce do wzorca "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "property name is invalid";
            break;
          case "required":
            out = "powinien zawiera\u0107 wymagane pole " + e.params.missingProperty;
            break;
          case "type":
            out = "powinien by\u0107 " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "nie powinien zawiera\u0107 element\xF3w kt\xF3re si\u0119 powtarzaj\u0105 (elementy " + e.params.j + " i " + e.params.i + " s\u0105 identyczne)";
            break;
          default:
            out = 'powinien przej\u015B\u0107 walidacj\u0119 "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/pt-BR/index.js
var require_pt_BR = __commonJS({
  "node_modules/ajv-i18n/localize/pt-BR/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_pt_BR(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "n\xE3o s\xE3o permitidos itens adicionais (mais do que " + n + ")";
            break;
          case "additionalProperties":
            out = "n\xE3o s\xE3o permitidas propriedades adicionais";
            break;
          case "anyOf":
            out = 'os dados n\xE3o correspondem a nenhum schema de "anyOf"';
            break;
          case "const":
            out = "deve ser igual \xE0 constante";
            break;
          case "contains":
            out = "deve conter um item v\xE1lido";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += " deve ter propriedade";
            if (n != 1) {
              out += "s";
            }
            out += " " + e.params.deps + " quando a propriedade " + e.params.property + " estiver presente";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'a tag "' + e.params.tag + '" deve ser uma string';
                break;
              case "mapping":
                out = 'o valor da tag "' + e.params.tag + '" deve estar no oneOf';
                break;
              default:
                out = 'deve passar a valida\xE7\xE3o da keyword "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "deve ser igual a um dos valores permitidos";
            break;
          case "false schema":
            out = 'o schema booleano \xE9 "false"';
            break;
          case "format":
            out = 'deve corresponder ao formato "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve ser " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve ser " + cond;
            break;
          case "if":
            out = 'deve corresponder ao schema "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve ser " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "n\xE3o deve ter mais que " + n + " elemento";
            if (n != 1) {
              out += "s";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "n\xE3o deve ser maior que " + n + " caracter";
            if (n != 1) {
              out += "es";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "n\xE3o deve ter mais que " + n + " propriedade";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "deve ser " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "n\xE3o deve ter menos que " + n + " elemento";
            if (n != 1) {
              out += "s";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "n\xE3o deve ser mais curta que " + n + " caracter";
            if (n != 1) {
              out += "es";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "n\xE3o deve ter menos que " + n + " propriedade";
            if (n != 1) {
              out += "s";
            }
            break;
          case "multipleOf":
            out = "deve ser m\xFAltiplo de " + e.params.multipleOf;
            break;
          case "not":
            out = 'n\xE3o deve ser valido segundo o schema em "not"';
            break;
          case "oneOf":
            out = 'deve corresponder exatamente com um schema em "oneOf"';
            break;
          case "pattern":
            out = 'deve corresponder ao padr\xE3o "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'deve ter a propriedade correspondente ao padr\xE3o "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "o nome da propriedade \xE9 inv\xE1lido";
            break;
          case "required":
            out = "deve ter a propriedade obrigat\xF3ria " + e.params.missingProperty;
            break;
          case "type":
            out = "";
            var t = e.params.type;
            out += "deve ser ";
            if (t == "number") {
              out += "um n\xFAmero";
            } else if (t == "integer") {
              out += "um n\xFAmero inteiro";
            } else if (t == "string") {
              out += "um texto";
            } else if (t == "boolean") {
              out += "um booleano";
            } else {
              out += t;
            }
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "n\xE3o pode possuir mais que " + n + " ";
            if (n == 1) {
              out += "item";
            } else {
              out += "itens";
            }
            break;
          case "unevaluatedProperties":
            out = "n\xE3o pode possuir propridades n\xE3o avaliadas";
            break;
          case "uniqueItems":
            out = "n\xE3o deve ter itens duplicados (os itens ## " + e.params.j + " e " + e.params.i + " s\xE3o id\xEAnticos)";
            break;
          default:
            out = 'deve passar a valida\xE7\xE3o da keyword "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/ru/index.js
var require_ru = __commonJS({
  "node_modules/ajv-i18n/localize/ru/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_ru(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043D\u0435 \u0431\u043E\u043B\u0435\u0435, \u0447\u0435\u043C " + n + " \u044D\u043B\u0435\u043C\u0435\u043D\u0442";
            if (n >= 2 && n <= 4) {
              out += "\u0430";
            } else if (n != 1) {
              out += "\u043E\u0432";
            }
            break;
          case "additionalProperties":
            out = "\u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043F\u043E\u043B\u0435\u0439";
            break;
          case "anyOf":
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u043E\u0434\u043D\u043E\u0439 \u0438\u0445 \u0441\u0445\u0435\u043C \u0432 "anyOf"';
            break;
          case "const":
            out = "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0440\u0430\u0432\u043D\u043E \u0437\u0430\u0434\u0430\u043D\u043D\u043E\u043C\u0443 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044E";
            break;
          case "contains":
            out = "\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0435 \u0441\u0445\u0435\u043C\u0435";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043F\u043E\u043B";
            if (n == 1) {
              out += "\u0435";
            } else {
              out += "\u044F";
            }
            out += " " + e.params.deps + ", \u043A\u043E\u0433\u0434\u0430 \u043F\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u043E\u043B\u0435 " + e.params.property;
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = '\u043F\u043E\u043B\u0435 "' + e.params.tag + '" \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u043E\u0439';
                break;
              case "mapping":
                out = '\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044F "' + e.params.tag + '" \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0432 \u043E\u0434\u043D\u043E\u0439 \u0438\u0437 oneOf \u0441\u0445\u0435\u043C ';
                break;
              default:
                out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u0443 "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0440\u0430\u0432\u043D\u043E \u043E\u0434\u043D\u043E\u043C\u0443 \u0438\u0437 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u043D\u044B\u0445 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439";
            break;
          case "false schema":
            out = "\u0441\u0445\u0435\u043C\u0430 \u0440\u0430\u0432\u043D\u0430 false";
            break;
          case "format":
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0444\u043E\u0440\u043C\u0430\u0442\u0443 "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C " + cond;
            break;
          case "if":
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0441\u0445\u0435\u043Ce "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043D\u0435 \u0431\u043E\u043B\u0435\u0435, \u0447\u0435\u043C " + n + " \u044D\u043B\u0435\u043C\u0435\u043D\u0442";
            if (n >= 2 && n <= 4) {
              out += "\u0430";
            } else if (n != 1) {
              out += "\u043E\u0432";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043D\u0435 \u0434\u043B\u0438\u043D\u043D\u0435\u0435, \u0447\u0435\u043C " + n + " \u0441\u0438\u043C\u0432\u043E\u043B";
            if (n >= 2 && n <= 4) {
              out += "\u0430";
            } else if (n != 1) {
              out += "\u043E\u0432";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043D\u0435 \u0431\u043E\u043B\u0435\u0435, \u0447\u0435\u043C " + n + " \u043F\u043E\u043B";
            if (n == 1) {
              out += "\u0435";
            } else if (n >= 2 && n <= 4) {
              out += "\u044F";
            } else {
              out += "\u0435\u0439";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435, \u0447\u0435\u043C " + n + " \u044D\u043B\u0435\u043C\u0435\u043D\u0442";
            if (n >= 2 && n <= 4) {
              out += "\u0430";
            } else if (n != 1) {
              out += "\u043E\u0432";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043D\u0435 \u043A\u043E\u0440\u043E\u0447\u0435, \u0447\u0435\u043C " + n + " \u0441\u0438\u043C\u0432\u043E\u043B";
            if (n >= 2 && n <= 4) {
              out += "\u0430";
            } else if (n != 1) {
              out += "\u043E\u0432";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435, \u0447\u0435\u043C " + n + " \u043F\u043E\u043B";
            if (n == 1) {
              out += "\u0435";
            } else if (n >= 2 && n <= 4) {
              out += "\u044F";
            } else {
              out += "\u0435\u0439";
            }
            break;
          case "multipleOf":
            out = "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C " + e.params.multipleOf;
            break;
          case "not":
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0441\u0445\u0435\u043C\u0435 \u0432 "not"';
            break;
          case "oneOf":
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0432 \u0442\u043E\u0447\u043D\u043E\u0441\u0442\u0438 \u043E\u0434\u043D\u043E\u0439 \u0441\u0445\u0435\u043Ce \u0432 "oneOf"';
            break;
          case "pattern":
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u043E\u0431\u0440\u0430\u0437\u0446\u0443 "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043F\u043E\u043B\u0435, \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0435 \u043E\u0431\u0440\u0430\u0437\u0446\u0443 "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "\u0438\u043C\u044F \u043F\u043E\u043B\u044F \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0441\u0445\u0435\u043C\u0435";
            break;
          case "required":
            out = "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 " + e.params.missingProperty;
            break;
          case "type":
            out = "\u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "\u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043D\u0435 \u0431\u043E\u043B\u0435\u0435, \u0447\u0435\u043C " + n + " \u044D\u043B\u0435\u043C\u0435\u043D\u0442";
            if (n >= 2 && n <= 4) {
              out += "\u0430";
            } else if (n != 1) {
              out += "\u043E\u0432";
            }
            break;
          case "unevaluatedProperties":
            out = "\u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043D\u0435\u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0445 \u043F\u043E\u043B\u0435\u0439";
            break;
          case "uniqueItems":
            out = "\u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0438\u043C\u0435\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0438\u0445\u0441\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 (\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B " + e.params.j + " \u0438 " + e.params.i + " \u0438\u0434\u0435\u043D\u0442\u0438\u0447\u043D\u044B)";
            break;
          default:
            out = '\u0434\u043E\u043B\u0436\u043D\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u0443 "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/sk/index.js
var require_sk = __commonJS({
  "node_modules/ajv-i18n/localize/sk/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_sk(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "nem\xF4\u017Ee obsahova\u0165 viac, ne\u017E " + n + " prv";
            if (n == 1) {
              out += "ok";
            } else {
              out += "kov";
            }
            break;
          case "additionalProperties":
            out = "nem\xF4\u017Ee obsahova\u0165 \u010Fal\u0161ie polo\u017Eky";
            break;
          case "anyOf":
            out = 'mus\xED spl\u0148ova\u0165 aspo\u0148 jednu zo sch\xE9m v "anyOf"';
            break;
          case "const":
            out = "mus\xED by\u0165 kon\u0161tanta";
            break;
          case "contains":
            out = "mus\xED obsahova\u0165 prvok zodpovedaj\xFAci sch\xE9me";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += " mus\xED obsahova\u0165 polo\u017E";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "iek";
            } else {
              out += "ka";
            }
            out += ": " + e.params.deps + ", ak obsahuje " + e.params.property;
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'mus\xED splni\u0165 "' + e.keyword + '" valid\xE1ciu';
            }
            break;
          case "enum":
            out = "mus\xED by\u0165 jedna z definovan\xFDch hodn\xF4t";
            break;
          case "false schema":
            out = "sch\xE9ma je false";
            break;
          case "format":
            out = 'mus\xED obsahova\u0165 form\xE1t "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED by\u0165 " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED by\u0165 " + cond;
            break;
          case "if":
            out = 'must match "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED by\u0165 " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "nesmie obsahova\u0165 viac ne\u017E " + n + " prv";
            if (n == 1) {
              out += "ok";
            } else {
              out += "kov";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "nesmie by\u0165 dlh\u0161\xED ne\u017E " + n + " znak";
            if (n != 1) {
              out += "ov";
            }
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "nesmie obsahova\u0165 viac ne\u017E " + n + " polo\u017E";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "iek";
            } else {
              out += "ka";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "mus\xED by\u0165 " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "nesmie obsahova\u0165 menej ne\u017E " + n + " prv";
            if (n == 1) {
              out += "ok";
            } else {
              out += "kov";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "nesmie by\u0165 krat\u0161\xED ne\u017E " + n + " znak";
            if (n != 1) {
              out += "ov";
            }
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "nesmie obsahova\u0165 menej ne\u017E " + n + " polo\u017E";
            if (n >= 2 && n <= 4) {
              out += "ky";
            } else if (n != 1) {
              out += "iek";
            } else {
              out += "ka";
            }
            break;
          case "multipleOf":
            out = "mus\xED by\u0165 n\xE1sobkom " + e.params.multipleOf;
            break;
          case "not":
            out = 'nesmie spl\u0148ova\u0165 sch\xE9mu v "not"';
            break;
          case "oneOf":
            out = 'mus\xED spl\u0148ova\u0165 pr\xE1ve jednu sch\xE9mu v "oneOf"';
            break;
          case "pattern":
            out = 'mus\xED spl\u0148ova\u0165 regul\xE1rny v\xFDraz "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'mus\xED obsahova\u0165 polo\u017Eku spl\u0148j\xFAcu regul\xE1rny v\xFDraz "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "n\xE1zov polo\u017Eky nezodpoved\xE1 sch\xE9me";
            break;
          case "required":
            out = "mus\xED obsahova\u0165 po\u017Eadovan\xFA polo\u017Eku " + e.params.missingProperty;
            break;
          case "type":
            out = "mus\xED by\u0165 " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "nesmie obsahova\u0165 duplicitn\xE9 prvky (prvky ## " + e.params.j + " a " + e.params.i + " s\xFA rovnak\xE9)";
            break;
          default:
            out = 'mus\xED splni\u0165 "' + e.keyword + '" valid\xE1ciu';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/sv/index.js
var require_sv = __commonJS({
  "node_modules/ajv-i18n/localize/sv/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_sv(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "borde ha fler \xE4n " + n + " sak";
            if (n != 1) {
              out += "er";
            }
            break;
          case "additionalProperties":
            out = "borde inte ha fler egenskaper";
            break;
          case "anyOf":
            out = 'borde matcha n\xE5got schema i "anyOf"';
            break;
          case "const":
            out = "b\xF6r vara en konstant";
            break;
          case "contains":
            out = "b\xF6r inneh\xE5lla ett giltigt objekt";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "borde ha egenskap";
            if (n != 1) {
              out += "er";
            }
            out += " " + e.params.deps + " n\xE4r egenskap " + e.params.property + " finns tillg\xE4ngligt";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" must be string';
                break;
              case "mapping":
                out = 'value of tag "' + e.params.tag + '" must be in oneOf';
                break;
              default:
                out = 'b\xF6r passera "' + e.keyword + '" nyckelord validering';
            }
            break;
          case "enum":
            out = "borde vara ekvivalent med en av dess f\xF6rdefinierade v\xE4rden";
            break;
          case "false schema":
            out = "boolean schema \xE4r falskt";
            break;
          case "format":
            out = 'borde matcha formatet "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "b\xF6r vara " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "b\xF6r vara " + cond;
            break;
          case "if":
            out = 'must match "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "borde vara " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "borde inte ha fler \xE4n " + n + " sak";
            if (n != 1) {
              out += "er";
            }
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "borde inte vara l\xE4ngre \xE4n " + n + " tecken";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "borde inte ha fler \xE4n " + n + " egenskap";
            if (n != 1) {
              out += "er";
            }
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "borde vara " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "borde inte ha f\xE4rre \xE4n " + n + " sak";
            if (n != 1) {
              out += "er";
            }
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "borde inte vara kortare \xE4n " + n + " tecken";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "borde inte ha f\xE4rre \xE4n " + n + " egenskap";
            if (n != 1) {
              out += "er";
            }
            break;
          case "multipleOf":
            out = "borde vara en multipel av " + e.params.multipleOf;
            break;
          case "not":
            out = 'borde inte vara giltigt enligt schema i "not"';
            break;
          case "oneOf":
            out = 'borde matcha exakt ett schema i "oneOf"';
            break;
          case "pattern":
            out = 'borde matcha m\xF6nstret "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = 'b\xF6r ha en egenskap som matchar m\xF6nstret "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "egenskap med namnet \xE4r inte giltig";
            break;
          case "required":
            out = "borde ha den n\xF6dv\xE4ndiga egenskapen " + e.params.missingProperty;
            break;
          case "type":
            out = "borde vara " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "must NOT have more than " + n + " item";
            if (n != 1) {
              out += "s";
            }
            break;
          case "unevaluatedProperties":
            out = "must NOT have unevaluated properties";
            break;
          case "uniqueItems":
            out = "borde inte ha duplicerade saker (sakerna ## " + e.params.j + " och " + e.params.i + " \xE4r identiska)";
            break;
          default:
            out = 'b\xF6r passera "' + e.keyword + '" nyckelord validering';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/th/index.js
var require_th = __commonJS({
  "node_modules/ajv-i18n/localize/th/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_th(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + n + " \u0E15\u0E31\u0E27";
            break;
          case "additionalProperties":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35 property \u0E2D\u0E37\u0E48\u0E19\u0E46 \u0E19\u0E2D\u0E01\u0E40\u0E2B\u0E19\u0E35\u0E2D\u0E08\u0E32\u0E01\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
            break;
          case "anyOf":
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 schema \u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49\u0E43\u0E19 "anyOf"';
            break;
          case "const":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E17\u0E48\u0E32\u0E01\u0E31\u0E1A\u0E04\u0E48\u0E32\u0E04\u0E07\u0E17\u0E35\u0E48";
            break;
          case "contains":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E17\u0E35\u0E48\u0E1C\u0E48\u0E32\u0E19\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E2D\u0E22\u0E39\u0E48";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E21\u0E35 property " + e.params.property + " \u0E41\u0E25\u0E49\u0E27\u0E08\u0E30\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 property " + e.params.deps + " \u0E14\u0E49\u0E27\u0E22";
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = 'tag "' + e.params.tag + '" \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 string';
                break;
              case "mapping":
                out = '\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E04\u0E48\u0E32\u0E02\u0E2D\u0E07 tag "' + e.params.tag + '" \u0E43\u0E19 oneOf';
                break;
              default:
                out = '\u0E15\u0E49\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E04\u0E35\u0E22\u0E4C\u0E40\u0E27\u0E34\u0E23\u0E4C\u0E14 "' + e.keyword + '"';
            }
            break;
          case "enum":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19\u0E04\u0E48\u0E32\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
            break;
          case "false schema":
            out = "schema \u0E40\u0E1B\u0E47\u0E19 false";
            break;
          case "format":
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07 " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07 " + cond;
            break;
          case "if":
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A schema "' + e.params.failingKeyword + '"';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07 " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + n;
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07\u0E22\u0E32\u0E27\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + n + " \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 property \u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + n + " \u0E15\u0E31\u0E27";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07 " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "\u0E04\u0E27\u0E23\u0E21\u0E35\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E44\u0E21\u0E48\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32 " + n;
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 " + n + " \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 property \u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 " + n + " \u0E15\u0E31\u0E27";
            break;
          case "multipleOf":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E23 " + e.params.multipleOf + " \u0E25\u0E07\u0E15\u0E31\u0E27";
            break;
          case "not":
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E1C\u0E48\u0E32\u0E19 schema \u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49\u0E43\u0E19 "not"';
            break;
          case "oneOf":
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A schema \u0E15\u0E31\u0E27\u0E40\u0E14\u0E35\u0E22\u0E27\u0E43\u0E19 "oneOf" \u0E40\u0E17\u0E48\u0E32\u0E19\u0E31\u0E49\u0E19';
            break;
          case "pattern":
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E15\u0E32\u0E21 pattern "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 property \u0E17\u0E35\u0E48\u0E21\u0E35\u0E0A\u0E37\u0E48\u0E2D\u0E15\u0E23\u0E07\u0E15\u0E32\u0E21 pattern "' + e.params.missingPattern + '"';
            break;
          case "propertyNames":
            out = "\u0E0A\u0E37\u0E48\u0E2D property \u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07";
            break;
          case "required":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 property " + e.params.missingProperty + " \u0E14\u0E49\u0E27\u0E22";
            break;
          case "type":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19 " + e.params.type;
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + n + " \u0E15\u0E31\u0E27";
            break;
          case "unevaluatedProperties":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35 property \u0E17\u0E35\u0E48\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E1C\u0E48\u0E32\u0E19\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E43\u0E14\u0E46";
            break;
          case "uniqueItems":
            out = "\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E44\u0E21\u0E48\u0E0B\u0E49\u0E33\u0E31\u0E01\u0E31\u0E19 (\u0E25\u0E33\u0E14\u0E31\u0E1A\u0E17\u0E35\u0E48 " + e.params.j + " \u0E01\u0E31\u0E1A " + e.params.i + " \u0E0B\u0E49\u0E33\u0E01\u0E31\u0E19)";
            break;
          default:
            out = '\u0E15\u0E49\u0E2D\u0E07\u0E1C\u0E48\u0E32\u0E19\u0E04\u0E35\u0E22\u0E4C\u0E40\u0E27\u0E34\u0E23\u0E4C\u0E14 "' + e.keyword + '"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/zh/index.js
var require_zh = __commonJS({
  "node_modules/ajv-i18n/localize/zh/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_zh(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u5141\u8BB8\u8D85\u8FC7" + n + "\u4E2A\u5143\u7D20";
            break;
          case "additionalProperties":
            out = "\u4E0D\u5141\u8BB8\u6709\u989D\u5916\u7684\u5C5E\u6027";
            break;
          case "anyOf":
            out = "\u6570\u636E\u5E94\u4E3A anyOf \u6240\u6307\u5B9A\u7684\u5176\u4E2D\u4E00\u4E2A";
            break;
          case "const":
            out = "\u5E94\u5F53\u7B49\u4E8E\u5E38\u91CF";
            break;
          case "contains":
            out = "\u5E94\u5F53\u5305\u542B\u4E00\u4E2A\u6709\u6548\u9879";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "\u5E94\u5F53\u62E5\u6709\u5C5E\u6027" + e.params.property + "\u7684\u4F9D\u8D56\u5C5E\u6027" + e.params.deps;
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = '\u6807\u7B7E "' + e.params.tag + '" \u7684\u7C7B\u578B\u5FC5\u987B\u4E3A\u5B57\u7B26\u4E32';
                break;
              case "mapping":
                out = '\u6807\u7B7E "' + e.params.tag + '" \u7684\u503C\u5FC5\u987B\u5728 oneOf \u4E4B\u4E2D';
                break;
              default:
                out = '\u5E94\u5F53\u901A\u8FC7 "' + e.keyword + ' \u5173\u952E\u8BCD\u6821\u9A8C"';
            }
            break;
          case "enum":
            out = "\u5E94\u5F53\u662F\u9884\u8BBE\u5B9A\u7684\u679A\u4E3E\u503C\u4E4B\u4E00";
            break;
          case "false schema":
            out = "\u5E03\u5C14\u6A21\u5F0F\u51FA\u9519";
            break;
          case "format":
            out = '\u5E94\u5F53\u5339\u914D\u683C\u5F0F "' + e.params.format + '"';
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u5E94\u5F53\u662F " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u5E94\u5F53\u662F " + cond;
            break;
          case "if":
            out = '\u5E94\u5F53\u5339\u914D\u6A21\u5F0F "' + e.params.failingKeyword + '" ';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u5E94\u5F53\u4E3A " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u5E94\u591A\u4E8E " + n + " \u4E2A\u9879";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u5E94\u591A\u4E8E " + n + " \u4E2A\u5B57\u7B26";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u5E94\u6709\u591A\u4E8E " + n + " \u4E2A\u5C5E\u6027";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u5E94\u5F53\u4E3A " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u5E94\u5C11\u4E8E " + n + " \u4E2A\u9879";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u5E94\u5C11\u4E8E " + n + " \u4E2A\u5B57\u7B26";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u5E94\u6709\u5C11\u4E8E " + n + " \u4E2A\u5C5E\u6027";
            break;
          case "multipleOf":
            out = "\u5E94\u5F53\u662F " + e.params.multipleOf + " \u7684\u6574\u6570\u500D";
            break;
          case "not":
            out = '\u4E0D\u5E94\u5F53\u5339\u914D "not" schema';
            break;
          case "oneOf":
            out = '\u53EA\u80FD\u5339\u914D\u4E00\u4E2A "oneOf" \u4E2D\u7684 schema';
            break;
          case "pattern":
            out = '\u5E94\u5F53\u5339\u914D\u6A21\u5F0F "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = "\u5E94\u5F53\u6709\u5C5E\u6027\u5339\u914D\u6A21\u5F0F " + e.params.missingPattern;
            break;
          case "propertyNames":
            out = "\u5C5E\u6027\u540D \u65E0\u6548";
            break;
          case "required":
            out = "\u5E94\u5F53\u6709\u5FC5\u9700\u5C5E\u6027 " + e.params.missingProperty;
            break;
          case "type":
            out = "\u5E94\u5F53\u662F " + e.params.type + " \u7C7B\u578B";
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += " \u4E0D\u5141\u8BB8\u6709\u8D85\u8FC7 " + n + " \u4E2A\u5143\u7D20";
            break;
          case "unevaluatedProperties":
            out = "\u4E0D\u5141\u8BB8\u5B58\u5728\u672A\u6C42\u503C\u7684\u5C5E\u6027";
            break;
          case "uniqueItems":
            out = "\u4E0D\u5E94\u5F53\u542B\u6709\u91CD\u590D\u9879 (\u7B2C " + e.params.j + " \u9879\u4E0E\u7B2C " + e.params.i + " \u9879\u662F\u91CD\u590D\u7684)";
            break;
          default:
            out = '\u5E94\u5F53\u901A\u8FC7 "' + e.keyword + ' \u5173\u952E\u8BCD\u6821\u9A8C"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/zh-TW/index.js
var require_zh_TW = __commonJS({
  "node_modules/ajv-i18n/localize/zh-TW/index.js"(exports, module2) {
    "use strict";
    module2.exports = function localize_zh_TW(errors) {
      if (!(errors && errors.length))
        return;
      for (const e of errors) {
        let out;
        switch (e.keyword) {
          case "additionalItems":
          case "items":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u53EF\u4EE5\u8D85\u904E" + n + "\u500B\u5143\u7D20";
            break;
          case "additionalProperties":
            out = "\u4E0D\u53EF\u4EE5\u6709\u984D\u5916\u7684\u5C6C\u6027";
            break;
          case "anyOf":
            out = "\u4E0D\u7B26\u5408 anyOf \u6307\u5B9A\u7684\u6A21\u5F0F";
            break;
          case "const":
            out = "\u61C9\u8A72\u7B49\u65BC\u5E38\u6578";
            break;
          case "contains":
            out = "\u61C9\u8A72\u5305\u542B\u4E00\u500B\u6709\u6548\u5143\u7D20";
            break;
          case "dependencies":
          case "dependentRequired":
            out = "";
            var n = e.params.depsCount;
            out += "\u61C9\u8A72\u8981\u6709\u5C6C\u6027" + e.params.property + "\u7684\u4F9D\u8CF4\u5C6C\u6027" + e.params.deps;
            break;
          case "discriminator":
            switch (e.params.error) {
              case "tag":
                out = '\u6A19\u7C64 "' + e.params.tag + '" \u7684\u985E\u578B\u5FC5\u9808\u662F\u5B57\u4E32';
                break;
              case "mapping":
                out = '\u6A19\u7C64 "' + e.params.tag + '" \u5FC5\u9808\u5728 oneOf \u5176\u4E2D\u4E4B\u4E00';
                break;
              default:
                out = '\u61C9\u8A72\u901A\u904E "' + e.keyword + ' \u95DC\u9375\u8A5E\u6AA2\u9A57"';
            }
            break;
          case "enum":
            out = "\u61C9\u8A72\u8981\u5728\u9810\u8A2D\u7684\u503C\u4E4B\u4E2D";
            break;
          case "false schema":
            out = "\u5E03\u6797\u6A21\u5F0F\u4E0D\u6B63\u78BA";
            break;
          case "format":
            out = "\u61C9\u8A72\u8981\u7B26\u5408" + e.params.format + "\u683C\u5F0F";
            break;
          case "formatMaximum":
          case "formatExclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u61C9\u8A72\u662F " + cond;
            break;
          case "formatMinimum":
          case "formatExclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u61C9\u8A72\u662F " + cond;
            break;
          case "if":
            out = '\u61C9\u8A72\u7B26\u5408 "' + e.params.failingKeyword + '" schema';
            break;
          case "maximum":
          case "exclusiveMaximum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u61C9\u8A72\u8981 " + cond;
            break;
          case "maxItems":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u61C9\u8A72\u591A\u65BC " + n + " \u500B";
            break;
          case "maxLength":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u61C9\u8A72\u591A\u65BC " + n + " \u500B\u5B57\u5143";
            break;
          case "maxProperties":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u61C9\u8A72\u591A\u65BC " + n + " \u500B\u5C6C\u6027";
            break;
          case "minimum":
          case "exclusiveMinimum":
            out = "";
            var cond = e.params.comparison + " " + e.params.limit;
            out += "\u61C9\u8A72\u8981 " + cond;
            break;
          case "minItems":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u61C9\u8A72\u5C11\u65BC " + n + " \u500B";
            break;
          case "minLength":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u61C9\u8A72\u5C11\u65BC " + n + " \u500B\u5B57\u5143";
            break;
          case "minProperties":
            out = "";
            var n = e.params.limit;
            out += "\u4E0D\u61C9\u8A72\u5C11\u65BC " + n + " \u500B\u5C6C\u6027";
            break;
          case "multipleOf":
            out = "\u61C9\u8A72\u662F " + e.params.multipleOf + " \u7684\u6574\u6578\u500D";
            break;
          case "not":
            out = '\u4E0D\u61C9\u8A72\u7B26\u5408 "not" schema';
            break;
          case "oneOf":
            out = '\u53EA\u80FD\u7B26\u5408\u4E00\u500B "oneOf" \u4E2D\u7684 schema';
            break;
          case "pattern":
            out = '\u61C9\u8A72\u7B26\u5408\u6A21\u5F0F "' + e.params.pattern + '"';
            break;
          case "patternRequired":
            out = "\u61C9\u8A72\u6709\u5C6C\u6027\u5C0D\u61C9\u6A21\u5F0F " + e.params.missingPattern;
            break;
          case "propertyNames":
            out = "\u5C5E\u6027\u540D \u7121\u6548";
            break;
          case "required":
            out = "\u61C9\u8A72\u6709\u5FC5\u9808\u5C6C\u6027 " + e.params.missingProperty;
            break;
          case "type":
            out = "\u61C9\u8A72\u662F " + e.params.type + " \u985E\u578B";
            break;
          case "unevaluatedItems":
            out = "";
            var n = e.params.len;
            out += " \u7684\u5143\u7D20\u4E0D\u53EF\u4EE5\u8D85\u904E " + n + " \u500B";
            break;
          case "unevaluatedProperties":
            out = "\u4E0D\u61C9\u8A72\u6709\u672A\u9A57\u8B49\u7684\u5C6C\u6027";
            break;
          case "uniqueItems":
            out = "\u4E0D\u61C9\u8A72\u6709\u91CD\u8907\u9805\u76EE (\u7B2C " + e.params.j + " \u9805\u548C\u7B2C " + e.params.i + " \u9805\u662F\u91CD\u8907\u7684)";
            break;
          default:
            out = '\u61C9\u8A72\u901A\u904E "' + e.keyword + ' \u95DC\u9375\u8A5E\u6AA2\u9A57"';
        }
        e.message = out;
      }
    };
  }
});

// node_modules/ajv-i18n/localize/index.js
var require_localize = __commonJS({
  "node_modules/ajv-i18n/localize/index.js"(exports, module2) {
    "use strict";
    module2.exports = {
      en: require_en(),
      ar: require_ar(),
      ca: require_ca(),
      cs: require_cs(),
      de: require_de(),
      es: require_es(),
      fr: require_fr(),
      hu: require_hu(),
      id: require_id2(),
      it: require_it(),
      ja: require_ja(),
      ko: require_ko(),
      nb: require_nb(),
      nl: require_nl(),
      pl: require_pl(),
      "pt-BR": require_pt_BR(),
      ru: require_ru(),
      sk: require_sk(),
      sv: require_sv(),
      th: require_th(),
      zh: require_zh(),
      "zh-TW": require_zh_TW()
    };
  }
});

// node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate, compare) {
      return { validate, compare };
    }
    exports.fullFormats = {
      date: fmtDef(date, compareDate),
      time: fmtDef(time, compareTime),
      "date-time": fmtDef(date_time, compareDateTime),
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      byte,
      int32: { type: "number", validate: validateInt32 },
      int64: { type: "number", validate: validateInt64 },
      float: { type: "number", validate: validateNumber },
      double: { type: "number", validate: validateNumber },
      password: true,
      binary: true
    };
    exports.fastFormats = __spreadProps(__spreadValues({}, exports.fullFormats), {
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    });
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i;
    function time(str, withTimeZone) {
      const matches = TIME.exec(str);
      if (!matches)
        return false;
      const hour = +matches[1];
      const minute = +matches[2];
      const second = +matches[3];
      const timeZone = matches[5];
      return (hour <= 23 && minute <= 59 && second <= 59 || hour === 23 && minute === 59 && second === 60) && (!withTimeZone || timeZone !== "");
    }
    function compareTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3] + (a1[4] || "");
      t2 = a2[1] + a2[2] + a2[3] + (a2[4] || "");
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function date_time(str) {
      const dateTime = str.split(DATE_TIME_SEPARATOR);
      return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1], true);
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/code.js
var require_code3 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code3();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState = exports.UsedValueState || (exports.UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = __spreadProps(__spreadValues({}, opts), { _n: opts.lines ? line : code_1.nil });
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code3();
    var scope_1 = require_scope2();
    var code_2 = require_code3();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope2();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : __spreadValues({}, this.lhs.names);
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new If(not(cond), e instanceof If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a, _b;
        super.optimizeNames(names, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = __spreadProps(__spreadValues({}, opts), { _n: opts.lines ? "\n" : "" });
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      name(prefix) {
        return this._scope.name(prefix);
      }
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      else() {
        return this._elseNode(new Else());
      }
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      endFor() {
        return this._endBlockNode(For);
      }
      label(label) {
        return this._leafNode(new Label(label));
      }
      break(label) {
        return this._leafNode(new Break(label));
      }
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/util.js
var require_util3 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen2();
    var code_1 = require_code3();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : __spreadValues(__spreadValues({}, from), to),
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type = exports.Type || (exports.Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/names.js
var require_names2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var names = {
      data: new codegen_1.Name("data"),
      valCxt: new codegen_1.Name("valCxt"),
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      vErrors: new codegen_1.Name("vErrors"),
      errors: new codegen_1.Name("errors"),
      this: new codegen_1.Name("this"),
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/errors.js
var require_errors2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var names_1 = require_names2();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors2();
    var codegen_1 = require_codegen2();
    var names_1 = require_names2();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/rules.js
var require_rules2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: __spreadProps(__spreadValues({}, groups), { integer: true, boolean: true, null: true }),
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules2();
    var applicability_1 = require_applicability2();
    var errors_1 = require_errors2();
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType = exports.DataType || (exports.DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/code.js
var require_code4 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var names_1 = require_names2();
    var util_2 = require_util3();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen2();
    var names_1 = require_names2();
    var code_1 = require_code4();
    var errors_1 = require_errors2();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/ajv-formats/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse2 = __commonJS({
  "node_modules/ajv-formats/node_modules/json-schema-traverse/index.js"(exports, module2) {
    "use strict";
    var traverse = module2.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/resolve.js
var require_resolve2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util3();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse2();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let baseId2 = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          baseId2 = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = baseId2;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(baseId2 ? _resolve(baseId2, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/index.js
var require_validate2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema2();
    var dataType_1 = require_dataType2();
    var applicability_1 = require_applicability2();
    var dataType_2 = require_dataType2();
    var defaults_1 = require_defaults2();
    var keyword_1 = require_keyword2();
    var subschema_1 = require_subschema2();
    var codegen_1 = require_codegen2();
    var names_1 = require_names2();
    var resolve_1 = require_resolve2();
    var util_1 = require_util3();
    var errors_1 = require_errors2();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      it.dataTypes = it.dataTypes.filter((t) => includesType(types, t));
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = __spreadProps(__spreadValues(__spreadValues({}, this.it), subschema), { items: void 0, props: void 0 });
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve2();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/compile/index.js
var require_compile2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen2();
    var validation_error_1 = require_validation_error2();
    var names_1 = require_names2();
    var resolve_1 = require_resolve2();
    var util_1 = require_util3();
    var validate_1 = require_validate2();
    var SchemaEnv = class {
      constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/refs/data.json
var require_data2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/refs/data.json"(exports, module2) {
    module2.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_uri_all();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/core.js
var require_core5 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate2();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen2();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error2();
    var ref_error_1 = require_ref_error2();
    var rules_1 = require_rules2();
    var compile_1 = require_compile2();
    var codegen_2 = require_codegen2();
    var resolve_1 = require_resolve2();
    var dataType_1 = require_dataType2();
    var util_1 = require_util3();
    var $dataRefSchema = require_data2();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? __spreadProps(__spreadValues({}, o.code), { optimize, regExp }) : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = {};
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = __spreadValues(__spreadValues({}, opts), requiredOptions(opts));
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = __spreadValues({}, $dataRefSchema);
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = __spreadProps(__spreadValues({}, def), {
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        });
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    exports.default = Ajv;
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = __spreadValues({}, this.opts);
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: __spreadProps(__spreadValues({}, definition), {
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        })
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/id.js
var require_id3 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error2();
    var code_1 = require_code4();
    var codegen_1 = require_codegen2();
    var names_1 = require_names2();
    var compile_1 = require_compile2();
    var util_1 = require_util3();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/index.js
var require_core6 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id3();
    var ref_1 = require_ref2();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var ucs2length_1 = require_ucs2length2();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code4();
    var codegen_1 = require_codegen2();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        const regExp = $data ? (0, codegen_1._)`(new RegExp(${schemaCode}, ${u}))` : (0, code_1.usePattern)(cxt, schema);
        cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code4();
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/runtime/equal.js
var require_equal2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType2();
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var equal_1 = require_equal2();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var equal_1 = require_equal2();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var equal_1 = require_equal2();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        const eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${eql}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${eql}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation3 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber2();
    var multipleOf_1 = require_multipleOf2();
    var limitLength_1 = require_limitLength2();
    var pattern_1 = require_pattern2();
    var limitProperties_1 = require_limitProperties2();
    var required_1 = require_required2();
    var limitItems_1 = require_limitItems2();
    var uniqueItems_1 = require_uniqueItems2();
    var const_1 = require_const2();
    var enum_1 = require_enum2();
    var validation = [
      limitNumber_1.default,
      multipleOf_1.default,
      limitLength_1.default,
      pattern_1.default,
      limitProperties_1.default,
      required_1.default,
      limitItems_1.default,
      uniqueItems_1.default,
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var code_1 = require_code4();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items2();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items20202 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var code_1 = require_code4();
    var additionalItems_1 = require_additionalItems2();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var code_1 = require_code4();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
          const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
          cxt.mergeValidEvaluated(schCxt, valid);
        }, () => gen.var(valid, true));
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code4();
    var codegen_1 = require_codegen2();
    var names_1 = require_names2();
    var util_1 = require_util3();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate2();
    var code_1 = require_code4();
    var util_1 = require_util3();
    var additionalProperties_1 = require_additionalProperties2();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code4();
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var util_2 = require_util3();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util3();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code4();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util3();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var util_1 = require_util3();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util3();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator3 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems2();
    var prefixItems_1 = require_prefixItems2();
    var items_1 = require_items2();
    var items2020_1 = require_items20202();
    var contains_1 = require_contains2();
    var dependencies_1 = require_dependencies2();
    var propertyNames_1 = require_propertyNames2();
    var additionalProperties_1 = require_additionalProperties2();
    var properties_1 = require_properties2();
    var patternProperties_1 = require_patternProperties2();
    var not_1 = require_not2();
    var anyOf_1 = require_anyOf2();
    var oneOf_1 = require_oneOf2();
    var allOf_1 = require_allOf2();
    var if_1 = require_if2();
    var thenElse_1 = require_thenElse2();
    function getApplicator(draft2020 = false) {
      const applicator = [
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/format/format.js
var require_format4 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/format/index.js
var require_format5 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format4();
    var format = [format_1.default];
    exports.default = format;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft72 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core6();
    var validation_1 = require_validation3();
    var applicator_1 = require_applicator3();
    var format_1 = require_format5();
    var metadata_1 = require_metadata2();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError = exports.DiscrError || (exports.DiscrError = {}));
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator2 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen2();
    var types_1 = require_types2();
    var compile_1 = require_compile2();
    var util_1 = require_util3();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv, it.baseId, sch === null || sch === void 0 ? void 0 : sch.$ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
            }
            const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module2) {
    module2.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// node_modules/ajv-formats/node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "node_modules/ajv-formats/node_modules/ajv/dist/ajv.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var core_1 = require_core5();
    var draft7_1 = require_draft72();
    var discriminator_1 = require_discriminator2();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    module2.exports = exports = Ajv;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv;
    var validate_1 = require_validate2();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen2();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
  }
});

// node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "node_modules/ajv-formats/dist/limit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen2();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => codegen_1.str`should be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => codegen_1._`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    exports.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", codegen_1._`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data(codegen_1.or(codegen_1._`typeof ${fmt} != "object"`, codegen_1._`${fmt} instanceof RegExp`, codegen_1._`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        function validateFormat() {
          const format = fCxt.schema;
          const fmtDef = self.formats[format];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format,
            ref: fmtDef,
            code: opts.code.formats ? codegen_1._`${opts.code.formats}${codegen_1.getProperty(format)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        function compareCode(fmt) {
          return codegen_1._`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = (ajv) => {
      ajv.addKeyword(exports.formatLimitDefinition);
      return ajv;
    };
    exports.default = formatLimitPlugin;
  }
});

// node_modules/ajv-formats/dist/index.js
var require_dist = __commonJS({
  "node_modules/ajv-formats/dist/index.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen2();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = (ajv, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats(ajv, opts, formats_1.fullFormats, fullName);
        return ajv;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats(ajv, list, formats, exportName);
      if (opts.keywords)
        limit_1.default(ajv);
      return ajv;
    };
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats(ajv, list, fs, exportName) {
      var _a;
      var _b;
      (_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 ? _a : _b.formats = codegen_1._`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv.addFormat(f, fs[f]);
    }
    module2.exports = exports = formatsPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = formatsPlugin;
  }
});

// node_modules/nearley/lib/nearley.js
var require_nearley = __commonJS({
  "node_modules/nearley/lib/nearley.js"(exports, module2) {
    (function(root, factory) {
      if (typeof module2 === "object" && module2.exports) {
        module2.exports = factory();
      } else {
        root.nearley = factory();
      }
    })(exports, function() {
      function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;
        this.postprocess = postprocess;
        return this;
      }
      Rule.highestId = 0;
      Rule.prototype.toString = function(withCursorAt) {
        var symbolSequence = typeof withCursorAt === "undefined" ? this.symbols.map(getSymbolShortDisplay).join(" ") : this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(" ") + " \u25CF " + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(" ");
        return this.name + " \u2192 " + symbolSequence;
      };
      function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
      }
      State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
      };
      State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
          state.data = state.build();
          state.right = void 0;
        }
        return state;
      };
      State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
          children.push(node.right.data);
          node = node.left;
        } while (node.left);
        children.reverse();
        return children;
      };
      State.prototype.finish = function() {
        if (this.rule.postprocess) {
          this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
      };
      function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {};
        this.scannable = [];
        this.completed = {};
      }
      Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;
        for (var w = 0; w < states.length; w++) {
          var state = states[w];
          if (state.isComplete) {
            state.finish();
            if (state.data !== Parser.fail) {
              var wantedBy = state.wantedBy;
              for (var i = wantedBy.length; i--; ) {
                var left = wantedBy[i];
                this.complete(left, state);
              }
              if (state.reference === this.index) {
                var exp = state.rule.name;
                (this.completed[exp] = this.completed[exp] || []).push(state);
              }
            }
          } else {
            var exp = state.rule.symbols[state.dot];
            if (typeof exp !== "string") {
              this.scannable.push(state);
              continue;
            }
            if (wants[exp]) {
              wants[exp].push(state);
              if (completed.hasOwnProperty(exp)) {
                var nulls = completed[exp];
                for (var i = 0; i < nulls.length; i++) {
                  var right = nulls[i];
                  this.complete(state, right);
                }
              }
            } else {
              wants[exp] = [state];
              this.predict(exp);
            }
          }
        }
      };
      Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];
        for (var i = 0; i < rules.length; i++) {
          var r = rules[i];
          var wantedBy = this.wants[exp];
          var s = new State(r, 0, this.index, wantedBy);
          this.states.push(s);
        }
      };
      Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
      };
      function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
          if (!byName.hasOwnProperty(rule.name)) {
            byName[rule.name] = [];
          }
          byName[rule.name].push(rule);
        });
      }
      Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function(r) {
          return new Rule(r.name, r.symbols, r.postprocess);
        });
        var g = new Grammar(rules, start);
        g.lexer = lexer;
        return g;
      };
      function StreamLexer() {
        this.reset("");
      }
      StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
      };
      StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
          var ch = this.buffer[this.index++];
          if (ch === "\n") {
            this.line += 1;
            this.lastLineBreak = this.index;
          }
          return { value: ch };
        }
      };
      StreamLexer.prototype.save = function() {
        return {
          line: this.line,
          col: this.index - this.lastLineBreak
        };
      };
      StreamLexer.prototype.formatError = function(token, message) {
        var buffer = this.buffer;
        if (typeof buffer === "string") {
          var lines = buffer.split("\n").slice(Math.max(0, this.line - 5), this.line);
          var nextLineBreak = buffer.indexOf("\n", this.index);
          if (nextLineBreak === -1)
            nextLineBreak = buffer.length;
          var col = this.index - this.lastLineBreak;
          var lastLineDigits = String(this.line).length;
          message += " at line " + this.line + " col " + col + ":\n\n";
          message += lines.map(function(line, i) {
            return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
          }, this).join("\n");
          message += "\n" + pad("", lastLineDigits + col) + "^\n";
          return message;
        } else {
          return message + " at index " + (this.index - 1);
        }
        function pad(n, length) {
          var s = String(n);
          return Array(length - s.length + 1).join(" ") + s;
        }
      };
      function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
          var grammar = rules;
          var options = start;
        } else {
          var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;
        this.options = {
          keepHistory: false,
          lexer: grammar.lexer || new StreamLexer()
        };
        for (var key in options || {}) {
          this.options[key] = options[key];
        }
        this.lexer = this.options.lexer;
        this.lexerState = void 0;
        var column = new Column(grammar, 0);
        var table = this.table = [column];
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        column.process();
        this.current = 0;
      }
      Parser.fail = {};
      Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);
        var token;
        while (true) {
          try {
            token = lexer.next();
            if (!token) {
              break;
            }
          } catch (e) {
            var nextColumn = new Column(this.grammar, this.current + 1);
            this.table.push(nextColumn);
            var err = new Error(this.reportLexerError(e));
            err.offset = this.current;
            err.token = e.token;
            throw err;
          }
          var column = this.table[this.current];
          if (!this.options.keepHistory) {
            delete this.table[this.current - 1];
          }
          var n = this.current + 1;
          var nextColumn = new Column(this.grammar, n);
          this.table.push(nextColumn);
          var literal = token.text !== void 0 ? token.text : token.value;
          var value = lexer.constructor === StreamLexer ? token.value : token;
          var scannable = column.scannable;
          for (var w = scannable.length; w--; ) {
            var state = scannable[w];
            var expect = state.rule.symbols[state.dot];
            if (expect.test ? expect.test(value) : expect.type ? expect.type === token.type : expect.literal === literal) {
              var next = state.nextState({ data: value, token, isToken: true, reference: n - 1 });
              nextColumn.states.push(next);
            }
          }
          nextColumn.process();
          if (nextColumn.states.length === 0) {
            var err = new Error(this.reportError(token));
            err.offset = this.current;
            err.token = token;
            throw err;
          }
          if (this.options.keepHistory) {
            column.lexerState = lexer.save();
          }
          this.current++;
        }
        if (column) {
          this.lexerState = lexer.save();
        }
        this.results = this.finish();
        return this;
      };
      Parser.prototype.reportLexerError = function(lexerError) {
        var tokenDisplay, lexerMessage;
        var token = lexerError.token;
        if (token) {
          tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
          lexerMessage = this.lexer.formatError(token, "Syntax error");
        } else {
          tokenDisplay = "input (lexer error)";
          lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };
      Parser.prototype.reportError = function(token) {
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== void 0 ? token.value : token);
        var lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
      };
      Parser.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
        var lines = [];
        lines.push(lexerMessage);
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states.filter(function(state) {
          var nextSymbol = state.rule.symbols[state.dot];
          return nextSymbol && typeof nextSymbol !== "string";
        });
        if (expectantStates.length === 0) {
          lines.push("Unexpected " + tokenDisplay + ". I did not expect any more input. Here is the state of my parse table:\n");
          this.displayStateStack(lastColumn.states, lines);
        } else {
          lines.push("Unexpected " + tokenDisplay + ". Instead, I was expecting to see one of the following:\n");
          var stateStacks = expectantStates.map(function(state) {
            return this.buildFirstStateStack(state, []) || [state];
          }, this);
          stateStacks.forEach(function(stateStack) {
            var state = stateStack[0];
            var nextSymbol = state.rule.symbols[state.dot];
            var symbolDisplay = this.getSymbolDisplay(nextSymbol);
            lines.push("A " + symbolDisplay + " based on:");
            this.displayStateStack(stateStack, lines);
          }, this);
        }
        lines.push("");
        return lines.join("\n");
      };
      Parser.prototype.displayStateStack = function(stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
          var state = stateStack[j];
          var display = state.rule.toString(state.dot);
          if (display === lastDisplay) {
            sameDisplayCount++;
          } else {
            if (sameDisplayCount > 0) {
              lines.push("    ^ " + sameDisplayCount + " more lines identical to this");
            }
            sameDisplayCount = 0;
            lines.push("    " + display);
          }
          lastDisplay = display;
        }
      };
      Parser.prototype.getSymbolDisplay = function(symbol) {
        return getSymbolLongDisplay(symbol);
      };
      Parser.prototype.buildFirstStateStack = function(state, visited) {
        if (visited.indexOf(state) !== -1) {
          return null;
        }
        if (state.wantedBy.length === 0) {
          return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
          return null;
        }
        return [state].concat(childResult);
      };
      Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
      };
      Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;
        this.results = this.finish();
      };
      Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
          throw new Error("set option `keepHistory` to enable rewinding");
        }
        this.restore(this.table[index]);
      };
      Parser.prototype.finish = function() {
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1];
        column.states.forEach(function(t) {
          if (t.rule.name === start && t.dot === t.rule.symbols.length && t.reference === 0 && t.data !== Parser.fail) {
            considerations.push(t);
          }
        });
        return considerations.map(function(c) {
          return c.data;
        });
      };
      function getSymbolLongDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
          return symbol;
        } else if (type === "object") {
          if (symbol.literal) {
            return JSON.stringify(symbol.literal);
          } else if (symbol instanceof RegExp) {
            return "character matching " + symbol;
          } else if (symbol.type) {
            return symbol.type + " token";
          } else if (symbol.test) {
            return "token matching " + String(symbol.test);
          } else {
            throw new Error("Unknown symbol type: " + symbol);
          }
        }
      }
      function getSymbolShortDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
          return symbol;
        } else if (type === "object") {
          if (symbol.literal) {
            return JSON.stringify(symbol.literal);
          } else if (symbol instanceof RegExp) {
            return symbol.toString();
          } else if (symbol.type) {
            return "%" + symbol.type;
          } else if (symbol.test) {
            return "<" + String(symbol.test) + ">";
          } else {
            throw new Error("Unknown symbol type: " + symbol);
          }
        }
      }
      return {
        Parser,
        Grammar,
        Rule
      };
    });
  }
});

// node_modules/smtp-address-parser/dist/lib/grammar.js
var require_grammar = __commonJS({
  "node_modules/smtp-address-parser/dist/lib/grammar.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function id(d) {
      return d[0];
    }
    var deepFlatten = (arr) => [].concat(...arr.map((v) => Array.isArray(v) ? deepFlatten(v) : v));
    function flat_string(d) {
      if (d) {
        if (Array.isArray(d))
          return deepFlatten(d).join("");
        return d;
      }
      return "";
    }
    var grammar = {
      Lexer: void 0,
      ParserRules: [
        { "name": "Reverse_path", "symbols": ["Path"] },
        { "name": "Reverse_path$string$1", "symbols": [{ "literal": "<" }, { "literal": ">" }], "postprocess": (d) => d.join("") },
        { "name": "Reverse_path", "symbols": ["Reverse_path$string$1"] },
        { "name": "Forward_path$subexpression$1$subexpression$1", "symbols": [{ "literal": "<" }, /[pP]/, /[oO]/, /[sS]/, /[tT]/, /[mM]/, /[aA]/, /[sS]/, /[tT]/, /[eE]/, /[rR]/, { "literal": "@" }], "postprocess": function(d) {
          return d.join("");
        } },
        { "name": "Forward_path$subexpression$1", "symbols": ["Forward_path$subexpression$1$subexpression$1", "Domain", { "literal": ">" }] },
        { "name": "Forward_path", "symbols": ["Forward_path$subexpression$1"] },
        { "name": "Forward_path$subexpression$2", "symbols": [{ "literal": "<" }, /[pP]/, /[oO]/, /[sS]/, /[tT]/, /[mM]/, /[aA]/, /[sS]/, /[tT]/, /[eE]/, /[rR]/, { "literal": ">" }], "postprocess": function(d) {
          return d.join("");
        } },
        { "name": "Forward_path", "symbols": ["Forward_path$subexpression$2"] },
        { "name": "Forward_path", "symbols": ["Path"] },
        { "name": "Path$ebnf$1$subexpression$1", "symbols": ["A_d_l", { "literal": ":" }] },
        { "name": "Path$ebnf$1", "symbols": ["Path$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "Path$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "Path", "symbols": [{ "literal": "<" }, "Path$ebnf$1", "Mailbox", { "literal": ">" }] },
        { "name": "A_d_l$ebnf$1", "symbols": [] },
        { "name": "A_d_l$ebnf$1$subexpression$1", "symbols": [{ "literal": "," }, "At_domain"] },
        { "name": "A_d_l$ebnf$1", "symbols": ["A_d_l$ebnf$1", "A_d_l$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "A_d_l", "symbols": ["At_domain", "A_d_l$ebnf$1"] },
        { "name": "At_domain", "symbols": [{ "literal": "@" }, "Domain"] },
        { "name": "Domain$ebnf$1", "symbols": [] },
        { "name": "Domain$ebnf$1$subexpression$1", "symbols": [{ "literal": "." }, "sub_domain"] },
        { "name": "Domain$ebnf$1", "symbols": ["Domain$ebnf$1", "Domain$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Domain", "symbols": ["sub_domain", "Domain$ebnf$1"] },
        { "name": "sub_domain", "symbols": ["U_label"] },
        { "name": "Let_dig", "symbols": ["ALPHA_DIGIT"], "postprocess": id },
        { "name": "Ldh_str$ebnf$1", "symbols": [] },
        { "name": "Ldh_str$ebnf$1", "symbols": ["Ldh_str$ebnf$1", "ALPHA_DIG_DASH"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Ldh_str", "symbols": ["Ldh_str$ebnf$1", "Let_dig"] },
        { "name": "U_Let_dig", "symbols": ["ALPHA_DIGIT_U"], "postprocess": id },
        { "name": "U_Ldh_str$ebnf$1", "symbols": [] },
        { "name": "U_Ldh_str$ebnf$1", "symbols": ["U_Ldh_str$ebnf$1", "ALPHA_DIG_DASH_U"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "U_Ldh_str", "symbols": ["U_Ldh_str$ebnf$1", "U_Let_dig"] },
        { "name": "U_label$ebnf$1$subexpression$1", "symbols": ["U_Ldh_str"] },
        { "name": "U_label$ebnf$1", "symbols": ["U_label$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "U_label$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "U_label", "symbols": ["U_Let_dig", "U_label$ebnf$1"] },
        { "name": "address_literal$subexpression$1", "symbols": ["IPv4_address_literal"] },
        { "name": "address_literal$subexpression$1", "symbols": ["IPv6_address_literal"] },
        { "name": "address_literal$subexpression$1", "symbols": ["General_address_literal"] },
        { "name": "address_literal", "symbols": [{ "literal": "[" }, "address_literal$subexpression$1", { "literal": "]" }] },
        {
          "name": "non_local_part",
          "symbols": ["Domain"],
          "postprocess": function(d) {
            return { DomainName: flat_string(d[0]) };
          }
        },
        {
          "name": "non_local_part",
          "symbols": ["address_literal"],
          "postprocess": function(d) {
            return { AddressLiteral: flat_string(d[0]) };
          }
        },
        {
          "name": "Mailbox",
          "symbols": ["Local_part", { "literal": "@" }, "non_local_part"],
          "postprocess": function(d) {
            return { localPart: flat_string(d[0]), domainPart: flat_string(d[2]) };
          }
        },
        {
          "name": "Local_part",
          "symbols": ["Dot_string"],
          "postprocess": function(d) {
            return { DotString: flat_string(d[0]) };
          }
        },
        {
          "name": "Local_part",
          "symbols": ["Quoted_string"],
          "postprocess": function(d) {
            return { QuotedString: flat_string(d[0]) };
          }
        },
        { "name": "Dot_string$ebnf$1", "symbols": [] },
        { "name": "Dot_string$ebnf$1$subexpression$1", "symbols": [{ "literal": "." }, "Atom"] },
        { "name": "Dot_string$ebnf$1", "symbols": ["Dot_string$ebnf$1", "Dot_string$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Dot_string", "symbols": ["Atom", "Dot_string$ebnf$1"] },
        { "name": "Atom$ebnf$1", "symbols": [/[0-9A-Za-z!#$%&'*+\-/=?^_`{|}~\u0080-\uFFFF/]/] },
        { "name": "Atom$ebnf$1", "symbols": ["Atom$ebnf$1", /[0-9A-Za-z!#$%&'*+\-/=?^_`{|}~\u0080-\uFFFF/]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Atom", "symbols": ["Atom$ebnf$1"] },
        { "name": "Quoted_string$ebnf$1", "symbols": [] },
        { "name": "Quoted_string$ebnf$1", "symbols": ["Quoted_string$ebnf$1", "QcontentSMTP"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Quoted_string", "symbols": ["DQUOTE", "Quoted_string$ebnf$1", "DQUOTE"] },
        { "name": "QcontentSMTP", "symbols": ["qtextSMTP"] },
        { "name": "QcontentSMTP", "symbols": ["quoted_pairSMTP"] },
        { "name": "quoted_pairSMTP", "symbols": [{ "literal": "\\" }, /[\x20-\x7e]/] },
        { "name": "qtextSMTP", "symbols": [/[\x20-\x21\x23-\x5b\x5d-\x7e\u0080-\uFFFF]/], "postprocess": id },
        { "name": "IPv4_address_literal$macrocall$2", "symbols": [{ "literal": "." }, "Snum"] },
        { "name": "IPv4_address_literal$macrocall$1", "symbols": ["IPv4_address_literal$macrocall$2", "IPv4_address_literal$macrocall$2", "IPv4_address_literal$macrocall$2"] },
        { "name": "IPv4_address_literal", "symbols": ["Snum", "IPv4_address_literal$macrocall$1"] },
        { "name": "IPv6_address_literal$subexpression$1", "symbols": [/[iI]/, /[pP]/, /[vV]/, { "literal": "6" }, { "literal": ":" }], "postprocess": function(d) {
          return d.join("");
        } },
        { "name": "IPv6_address_literal", "symbols": ["IPv6_address_literal$subexpression$1", "IPv6_addr"] },
        { "name": "General_address_literal$ebnf$1", "symbols": ["dcontent"] },
        { "name": "General_address_literal$ebnf$1", "symbols": ["General_address_literal$ebnf$1", "dcontent"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "General_address_literal", "symbols": ["Standardized_tag", { "literal": ":" }, "General_address_literal$ebnf$1"] },
        { "name": "Standardized_tag", "symbols": ["Ldh_str"] },
        { "name": "dcontent", "symbols": [/[\x21-\x5a\x5e-\x7e]/], "postprocess": id },
        { "name": "Snum", "symbols": ["DIGIT"] },
        { "name": "Snum$subexpression$1", "symbols": [/[1-9]/, "DIGIT"] },
        { "name": "Snum", "symbols": ["Snum$subexpression$1"] },
        { "name": "Snum$subexpression$2", "symbols": [{ "literal": "1" }, "DIGIT", "DIGIT"] },
        { "name": "Snum", "symbols": ["Snum$subexpression$2"] },
        { "name": "Snum$subexpression$3", "symbols": [{ "literal": "2" }, /[0-4]/, "DIGIT"] },
        { "name": "Snum", "symbols": ["Snum$subexpression$3"] },
        { "name": "Snum$subexpression$4", "symbols": [{ "literal": "2" }, { "literal": "5" }, /[0-5]/] },
        { "name": "Snum", "symbols": ["Snum$subexpression$4"] },
        { "name": "IPv6_addr", "symbols": ["IPv6_full"] },
        { "name": "IPv6_addr", "symbols": ["IPv6_comp"] },
        { "name": "IPv6_addr", "symbols": ["IPv6v4_full"] },
        { "name": "IPv6_addr", "symbols": ["IPv6v4_comp"] },
        { "name": "IPv6_hex", "symbols": ["HEXDIG"] },
        { "name": "IPv6_hex$subexpression$1", "symbols": ["HEXDIG", "HEXDIG"] },
        { "name": "IPv6_hex", "symbols": ["IPv6_hex$subexpression$1"] },
        { "name": "IPv6_hex$subexpression$2", "symbols": ["HEXDIG", "HEXDIG", "HEXDIG"] },
        { "name": "IPv6_hex", "symbols": ["IPv6_hex$subexpression$2"] },
        { "name": "IPv6_hex$subexpression$3", "symbols": ["HEXDIG", "HEXDIG", "HEXDIG", "HEXDIG"] },
        { "name": "IPv6_hex", "symbols": ["IPv6_hex$subexpression$3"] },
        { "name": "IPv6_full$macrocall$2", "symbols": [{ "literal": ":" }, "IPv6_hex"] },
        { "name": "IPv6_full$macrocall$1", "symbols": ["IPv6_full$macrocall$2", "IPv6_full$macrocall$2", "IPv6_full$macrocall$2", "IPv6_full$macrocall$2", "IPv6_full$macrocall$2", "IPv6_full$macrocall$2", "IPv6_full$macrocall$2"] },
        { "name": "IPv6_full", "symbols": ["IPv6_hex", "IPv6_full$macrocall$1"] },
        { "name": "IPv6_comp$ebnf$1$subexpression$1$macrocall$2", "symbols": [{ "literal": ":" }, "IPv6_hex"] },
        { "name": "IPv6_comp$ebnf$1$subexpression$1$macrocall$1", "symbols": ["IPv6_comp$ebnf$1$subexpression$1$macrocall$2", "IPv6_comp$ebnf$1$subexpression$1$macrocall$2", "IPv6_comp$ebnf$1$subexpression$1$macrocall$2", "IPv6_comp$ebnf$1$subexpression$1$macrocall$2", "IPv6_comp$ebnf$1$subexpression$1$macrocall$2"] },
        { "name": "IPv6_comp$ebnf$1$subexpression$1", "symbols": ["IPv6_hex", "IPv6_comp$ebnf$1$subexpression$1$macrocall$1"] },
        { "name": "IPv6_comp$ebnf$1", "symbols": ["IPv6_comp$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "IPv6_comp$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "IPv6_comp$string$1", "symbols": [{ "literal": ":" }, { "literal": ":" }], "postprocess": (d) => d.join("") },
        { "name": "IPv6_comp$ebnf$2$subexpression$1$macrocall$2", "symbols": [{ "literal": ":" }, "IPv6_hex"] },
        { "name": "IPv6_comp$ebnf$2$subexpression$1$macrocall$1", "symbols": ["IPv6_comp$ebnf$2$subexpression$1$macrocall$2", "IPv6_comp$ebnf$2$subexpression$1$macrocall$2", "IPv6_comp$ebnf$2$subexpression$1$macrocall$2", "IPv6_comp$ebnf$2$subexpression$1$macrocall$2", "IPv6_comp$ebnf$2$subexpression$1$macrocall$2"] },
        { "name": "IPv6_comp$ebnf$2$subexpression$1", "symbols": ["IPv6_hex", "IPv6_comp$ebnf$2$subexpression$1$macrocall$1"] },
        { "name": "IPv6_comp$ebnf$2", "symbols": ["IPv6_comp$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "IPv6_comp$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "IPv6_comp", "symbols": ["IPv6_comp$ebnf$1", "IPv6_comp$string$1", "IPv6_comp$ebnf$2"] },
        { "name": "IPv6v4_full$macrocall$2", "symbols": [{ "literal": ":" }, "IPv6_hex"] },
        { "name": "IPv6v4_full$macrocall$1", "symbols": ["IPv6v4_full$macrocall$2", "IPv6v4_full$macrocall$2", "IPv6v4_full$macrocall$2", "IPv6v4_full$macrocall$2", "IPv6v4_full$macrocall$2"] },
        { "name": "IPv6v4_full", "symbols": ["IPv6_hex", "IPv6v4_full$macrocall$1", { "literal": ":" }, "IPv4_address_literal"] },
        { "name": "IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2", "symbols": [{ "literal": ":" }, "IPv6_hex"] },
        { "name": "IPv6v4_comp$ebnf$1$subexpression$1$macrocall$1", "symbols": ["IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2", "IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2", "IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2"] },
        { "name": "IPv6v4_comp$ebnf$1$subexpression$1", "symbols": ["IPv6_hex", "IPv6v4_comp$ebnf$1$subexpression$1$macrocall$1"] },
        { "name": "IPv6v4_comp$ebnf$1", "symbols": ["IPv6v4_comp$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "IPv6v4_comp$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "IPv6v4_comp$string$1", "symbols": [{ "literal": ":" }, { "literal": ":" }], "postprocess": (d) => d.join("") },
        { "name": "IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2", "symbols": [{ "literal": ":" }, "IPv6_hex"] },
        { "name": "IPv6v4_comp$ebnf$2$subexpression$1$macrocall$1", "symbols": ["IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2", "IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2", "IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2"] },
        { "name": "IPv6v4_comp$ebnf$2$subexpression$1", "symbols": ["IPv6_hex", "IPv6v4_comp$ebnf$2$subexpression$1$macrocall$1", { "literal": ":" }] },
        { "name": "IPv6v4_comp$ebnf$2", "symbols": ["IPv6v4_comp$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "IPv6v4_comp$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "IPv6v4_comp", "symbols": ["IPv6v4_comp$ebnf$1", "IPv6v4_comp$string$1", "IPv6v4_comp$ebnf$2", "IPv4_address_literal"] },
        { "name": "DIGIT", "symbols": [/[0-9]/], "postprocess": id },
        { "name": "ALPHA_DIGIT_U", "symbols": [/[0-9A-Za-z\u0080-\uFFFF]/], "postprocess": id },
        { "name": "ALPHA_DIGIT", "symbols": [/[0-9A-Za-z]/], "postprocess": id },
        { "name": "ALPHA_DIG_DASH", "symbols": [/[-0-9A-Za-z]/], "postprocess": id },
        { "name": "ALPHA_DIG_DASH_U", "symbols": [/[-0-9A-Za-z\u0080-\uFFFF]/], "postprocess": id },
        { "name": "HEXDIG", "symbols": [/[0-9A-Fa-f]/], "postprocess": id },
        { "name": "DQUOTE", "symbols": [{ "literal": '"' }], "postprocess": id }
      ],
      ParserStart: "Reverse_path"
    };
    exports.default = grammar;
  }
});

// node_modules/smtp-address-parser/dist/lib/index.js
var require_lib = __commonJS({
  "node_modules/smtp-address-parser/dist/lib/index.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.canonicalize = exports.canonicalize_quoted_string = exports.normalize = exports.normalize_dot_string = exports.parse = void 0;
    var nearley = require_nearley();
    var grammar_1 = __importDefault(require_grammar());
    grammar_1.default.ParserStart = "Mailbox";
    var grammar = nearley.Grammar.fromCompiled(grammar_1.default);
    function parse(address) {
      const parser = new nearley.Parser(grammar);
      parser.feed(address);
      if (parser.results.length !== 1) {
        throw new Error("address parsing failed: ambiguous grammar");
      }
      return parser.results[0];
    }
    exports.parse = parse;
    function normalize_dot_string(dot_string) {
      const tagless = function() {
        const plus_loc = dot_string.indexOf("+");
        if (plus_loc === -1) {
          return dot_string;
        }
        return dot_string.substr(0, plus_loc);
      }();
      const dotless = tagless.replace(/\./g, "");
      return dotless.toLowerCase();
    }
    exports.normalize_dot_string = normalize_dot_string;
    function normalize(address) {
      var _a, _b;
      const a = parse(address);
      const domain = (_a = a.domainPart.AddressLiteral) !== null && _a !== void 0 ? _a : a.domainPart.DomainName.toLowerCase();
      const local = (_b = a.localPart.QuotedString) !== null && _b !== void 0 ? _b : normalize_dot_string(a.localPart.DotString);
      return `${local}@${domain}`;
    }
    exports.normalize = normalize;
    function canonicalize_quoted_string(quoted_string) {
      const unquoted = quoted_string.substr(1).substr(0, quoted_string.length - 2);
      const unescaped = unquoted.replace(/(?:\\(.))/g, "$1");
      const reescaped = unescaped.replace(/(?:(["\\]))/g, "\\$1");
      return `"${reescaped}"`;
    }
    exports.canonicalize_quoted_string = canonicalize_quoted_string;
    function canonicalize(address) {
      var _a;
      const a = parse(address);
      const domain = (_a = a.domainPart.AddressLiteral) !== null && _a !== void 0 ? _a : a.domainPart.DomainName.toLowerCase();
      const local = a.localPart.QuotedString ? canonicalize_quoted_string(a.localPart.QuotedString) : a.localPart.DotString;
      return `${local}@${domain}`;
    }
    exports.canonicalize = canonicalize;
  }
});

// node_modules/extend/index.js
var require_extend = __commonJS({
  "node_modules/extend/index.js"(exports, module2) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    var toStr = Object.prototype.toString;
    var defineProperty = Object.defineProperty;
    var gOPD = Object.getOwnPropertyDescriptor;
    var isArray = function isArray2(arr) {
      if (typeof Array.isArray === "function") {
        return Array.isArray(arr);
      }
      return toStr.call(arr) === "[object Array]";
    };
    var isPlainObject = function isPlainObject2(obj) {
      if (!obj || toStr.call(obj) !== "[object Object]") {
        return false;
      }
      var hasOwnConstructor = hasOwn.call(obj, "constructor");
      var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
      if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
      }
      var key;
      for (key in obj) {
      }
      return typeof key === "undefined" || hasOwn.call(obj, key);
    };
    var setProperty = function setProperty2(target, options) {
      if (defineProperty && options.name === "__proto__") {
        defineProperty(target, options.name, {
          enumerable: true,
          configurable: true,
          value: options.newValue,
          writable: true
        });
      } else {
        target[options.name] = options.newValue;
      }
    };
    var getProperty = function getProperty2(obj, name) {
      if (name === "__proto__") {
        if (!hasOwn.call(obj, name)) {
          return void 0;
        } else if (gOPD) {
          return gOPD(obj, name).value;
        }
      }
      return obj[name];
    };
    module2.exports = function extend() {
      var options, name, src, copy, copyIsArray, clone;
      var target = arguments[0];
      var i = 1;
      var length = arguments.length;
      var deep = false;
      if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        i = 2;
      }
      if (target == null || typeof target !== "object" && typeof target !== "function") {
        target = {};
      }
      for (; i < length; ++i) {
        options = arguments[i];
        if (options != null) {
          for (name in options) {
            src = getProperty(target, name);
            copy = getProperty(options, name);
            if (target !== copy) {
              if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && isArray(src) ? src : [];
                } else {
                  clone = src && isPlainObject(src) ? src : {};
                }
                setProperty(target, { name, newValue: extend(deep, clone, copy) });
              } else if (typeof copy !== "undefined") {
                setProperty(target, { name, newValue: copy });
              }
            }
          }
        }
      }
      return target;
    };
  }
});

// node_modules/schemes/lib/iana-permanent.json
var require_iana_permanent = __commonJS({
  "node_modules/schemes/lib/iana-permanent.json"(exports, module2) {
    module2.exports = [
      {
        scheme: "aaa",
        description: "Diameter Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6733"
          }
        ]
      },
      {
        scheme: "aaas",
        description: "Diameter Protocol with Secure Transport",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6733"
          }
        ]
      },
      {
        scheme: "about",
        description: "about",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6694"
          }
        ]
      },
      {
        scheme: "acap",
        description: "application configuration access protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2244"
          }
        ]
      },
      {
        scheme: "acct",
        description: "acct",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7565"
          }
        ]
      },
      {
        scheme: "cap",
        description: "Calendar Access Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4324"
          }
        ]
      },
      {
        scheme: "cid",
        description: "content identifier",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2392"
          }
        ]
      },
      {
        scheme: "coap",
        description: "coap",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7252"
          }
        ]
      },
      {
        scheme: "coaps",
        description: "coaps",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7252"
          }
        ]
      },
      {
        scheme: "crid",
        description: "TV-Anytime Content Reference Identifier",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4078"
          }
        ]
      },
      {
        scheme: "data",
        description: "data",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2397"
          }
        ]
      },
      {
        scheme: "dav",
        description: "dav",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4918"
          }
        ]
      },
      {
        scheme: "dict",
        description: "dictionary service protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2229"
          }
        ]
      },
      {
        scheme: "dns",
        description: "Domain Name System",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4501"
          }
        ]
      },
      {
        scheme: "example",
        description: "example",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7595"
          }
        ]
      },
      {
        scheme: "file",
        description: "Host-specific file names",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc1738"
          }
        ]
      },
      {
        scheme: "ftp",
        description: "File Transfer Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc1738"
          }
        ]
      },
      {
        scheme: "geo",
        description: "Geographic Locations",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5870"
          }
        ]
      },
      {
        scheme: "go",
        description: "go",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3368"
          }
        ]
      },
      {
        scheme: "gopher",
        description: "The Gopher Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4266"
          }
        ]
      },
      {
        scheme: "h323",
        description: "H.323",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3508"
          }
        ]
      },
      {
        scheme: "http",
        description: "Hypertext Transfer Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7230"
          }
        ]
      },
      {
        scheme: "https",
        description: "Hypertext Transfer Protocol Secure",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7230"
          }
        ]
      },
      {
        scheme: "iax",
        description: "Inter-Asterisk eXchange Version 2",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5456"
          }
        ]
      },
      {
        scheme: "icap",
        description: "Internet Content Adaptation Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3507"
          }
        ]
      },
      {
        scheme: "im",
        description: "Instant Messaging",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3860"
          }
        ]
      },
      {
        scheme: "imap",
        description: "internet message access protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5092"
          }
        ]
      },
      {
        scheme: "info",
        description: 'Information Assets with Identifiers in Public Namespaces. \n       (section 3) defines an "info" registry \n        of public namespaces, which is maintained by NISO and can be accessed \n        from .',
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4452"
          }
        ]
      },
      {
        scheme: "ipp",
        description: "Internet Printing Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3510"
          }
        ]
      },
      {
        scheme: "ipps",
        description: "Internet Printing Protocol over HTTPS",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7472"
          }
        ]
      },
      {
        scheme: "iris",
        description: "Internet Registry Information Service",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3981"
          }
        ]
      },
      {
        scheme: "iris.beep",
        description: "iris.beep",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3983"
          }
        ]
      },
      {
        scheme: "iris.lwz",
        description: "iris.lwz",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4993"
          }
        ]
      },
      {
        scheme: "iris.xpc",
        description: "iris.xpc",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4992"
          }
        ]
      },
      {
        scheme: "iris.xpcs",
        description: "iris.xpcs",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4992"
          }
        ]
      },
      {
        scheme: "jabber",
        description: "jabber",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/perm/jabber"
      },
      {
        scheme: "ldap",
        description: "Lightweight Directory Access Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4516"
          }
        ]
      },
      {
        scheme: "mailto",
        description: "Electronic mail address",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6068"
          }
        ]
      },
      {
        scheme: "mid",
        description: "message identifier",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2392"
          }
        ]
      },
      {
        scheme: "msrp",
        description: "Message Session Relay Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4975"
          }
        ]
      },
      {
        scheme: "msrps",
        description: "Message Session Relay Protocol Secure",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4975"
          }
        ]
      },
      {
        scheme: "mtqp",
        description: "Message Tracking Query Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3887"
          }
        ]
      },
      {
        scheme: "mupdate",
        description: "Mailbox Update (MUPDATE) Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3656"
          }
        ]
      },
      {
        scheme: "news",
        description: "USENET news",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5538"
          }
        ]
      },
      {
        scheme: "nfs",
        description: "network file system protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2224"
          }
        ]
      },
      {
        scheme: "ni",
        description: "ni",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6920"
          }
        ]
      },
      {
        scheme: "nih",
        description: "nih",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6920"
          }
        ]
      },
      {
        scheme: "nntp",
        description: "USENET news using NNTP access",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5538"
          }
        ]
      },
      {
        scheme: "opaquelocktoken",
        description: "opaquelocktokent",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4918"
          }
        ]
      },
      {
        scheme: "pkcs11",
        description: "PKCS#11",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7512"
          }
        ]
      },
      {
        scheme: "pop",
        description: "Post Office Protocol v3",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2384"
          }
        ]
      },
      {
        scheme: "pres",
        description: "Presence",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3859"
          }
        ]
      },
      {
        scheme: "reload",
        description: "reload",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6940"
          }
        ]
      },
      {
        scheme: "rtsp",
        description: "Real-time Streaming Protocol (RTSP)",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2326"
          },
          {
            type: "draft",
            href: "http://www.iana.org/go/RFC-ietf-mmusic-rfc2326bis-40"
          }
        ]
      },
      {
        scheme: "rtsps",
        description: "Real-time Streaming Protocol (RTSP) over TLS",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2326"
          },
          {
            type: "draft",
            href: "http://www.iana.org/go/RFC-ietf-mmusic-rfc2326bis-40"
          }
        ]
      },
      {
        scheme: "rtspu",
        description: "Real-time Streaming Protocol (RTSP) over unreliable datagram transport",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2326"
          }
        ]
      },
      {
        scheme: "service",
        description: "service location",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2609"
          }
        ]
      },
      {
        scheme: "session",
        description: "session",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6787"
          }
        ]
      },
      {
        scheme: "shttp",
        description: "Secure Hypertext Transfer Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2660"
          }
        ]
      },
      {
        scheme: "sieve",
        description: "ManageSieve Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5804"
          }
        ]
      },
      {
        scheme: "sip",
        description: "session initiation protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3261"
          }
        ]
      },
      {
        scheme: "sips",
        description: "secure session initiation protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3261"
          }
        ]
      },
      {
        scheme: "sms",
        description: "Short Message Service",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5724"
          }
        ]
      },
      {
        scheme: "snmp",
        description: "Simple Network Management Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4088"
          }
        ]
      },
      {
        scheme: "soap.beep",
        description: "soap.beep",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4227"
          }
        ]
      },
      {
        scheme: "soap.beeps",
        description: "soap.beeps",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4227"
          }
        ]
      },
      {
        scheme: "stun",
        description: "stun",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7064"
          }
        ]
      },
      {
        scheme: "stuns",
        description: "stuns",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7064"
          }
        ]
      },
      {
        scheme: "tag",
        description: "tag",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4151"
          }
        ]
      },
      {
        scheme: "tel",
        description: "telephone",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3966"
          }
        ]
      },
      {
        scheme: "telnet",
        description: "Reference to interactive sessions",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4248"
          }
        ]
      },
      {
        scheme: "tftp",
        description: "Trivial File Transfer Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3617"
          }
        ]
      },
      {
        scheme: "thismessage",
        description: "multipart/related relative reference resolution",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2557"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/perm/thismessage"
      },
      {
        scheme: "tip",
        description: "Transaction Internet Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2371"
          }
        ]
      },
      {
        scheme: "tn3270",
        description: "Interactive 3270 emulation sessions",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6270"
          }
        ]
      },
      {
        scheme: "turn",
        description: "turn",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7065"
          }
        ]
      },
      {
        scheme: "turns",
        description: "turns",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7065"
          }
        ]
      },
      {
        scheme: "tv",
        description: "TV Broadcasts",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2838"
          }
        ]
      },
      {
        scheme: "urn",
        description: "Uniform Resource Names",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2141"
          },
          {
            type: "registry",
            href: "http://www.iana.org/assignments/urn-namespaces"
          }
        ]
      },
      {
        scheme: "vemmi",
        description: "versatile multimedia interface",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2122"
          }
        ]
      },
      {
        scheme: "vnc",
        description: "Remote Framebuffer Protocol",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/RFC-warden-appsawg-vnc-scheme-10"
          }
        ]
      },
      {
        scheme: "ws",
        description: "WebSocket connections",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6455"
          }
        ]
      },
      {
        scheme: "wss",
        description: "Encrypted WebSocket connections",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6455"
          }
        ]
      },
      {
        scheme: "xcon",
        description: "xcon",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6501"
          }
        ]
      },
      {
        scheme: "xcon-userid",
        description: "xcon-userid",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6501"
          }
        ]
      },
      {
        scheme: "xmlrpc.beep",
        description: "xmlrpc.beep",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3529"
          }
        ]
      },
      {
        scheme: "xmlrpc.beeps",
        description: "xmlrpc.beeps",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3529"
          }
        ]
      },
      {
        scheme: "xmpp",
        description: "Extensible Messaging and Presence Protocol",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5122"
          }
        ]
      },
      {
        scheme: "z39.50r",
        description: "Z39.50 Retrieval",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2056"
          }
        ]
      },
      {
        scheme: "z39.50s",
        description: "Z39.50 Session",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2056"
          }
        ]
      }
    ];
  }
});

// node_modules/schemes/lib/iana-provisional.json
var require_iana_provisional = __commonJS({
  "node_modules/schemes/lib/iana-provisional.json"(exports, module2) {
    module2.exports = [
      {
        scheme: "acr",
        description: "acr",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/acr"
      },
      {
        scheme: "adiumxtra",
        description: "adiumxtra",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/adiumxtra"
      },
      {
        scheme: "afp",
        description: "afp",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/afp"
      },
      {
        scheme: "afs",
        description: "Andrew File System global file names",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc1738"
          }
        ]
      },
      {
        scheme: "aim",
        description: "aim",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/aim"
      },
      {
        scheme: "appdata",
        description: "appdata",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/appdata"
      },
      {
        scheme: "apt",
        description: "apt",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/apt"
      },
      {
        scheme: "attachment",
        description: "attachment",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/attachment"
      },
      {
        scheme: "aw",
        description: "aw",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/aw"
      },
      {
        scheme: "barion",
        description: "barion",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/barion"
      },
      {
        scheme: "beshare",
        description: "beshare",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/beshare"
      },
      {
        scheme: "bitcoin",
        description: "bitcoin",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/bitcoin"
      },
      {
        scheme: "blob",
        description: "blob",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/blob"
      },
      {
        scheme: "bolo",
        description: "bolo",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/bolo"
      },
      {
        scheme: "callto",
        description: "callto",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/callto"
      },
      {
        scheme: "chrome",
        description: "chrome",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/chrome"
      },
      {
        scheme: "chrome-extension",
        description: "chrome-extension",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/chrome-extension"
      },
      {
        scheme: "com-eventbrite-attendee",
        description: "com-eventbrite-attendee",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/com-eventbrite-attendee"
      },
      {
        scheme: "content",
        description: "content",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/content"
      },
      {
        scheme: "cvs",
        description: "cvs",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/cvs"
      },
      {
        scheme: "dis",
        description: "dis",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/dis"
      },
      {
        scheme: "dlna-playcontainer",
        description: "dlna-playcontainer",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/dlna-playcontainer"
      },
      {
        scheme: "dlna-playsingle",
        description: "dlna-playsingle",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/dlna-playsingle"
      },
      {
        scheme: "dntp",
        description: "dntp",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/dntp"
      },
      {
        scheme: "dtn",
        description: "DTNRG research and development",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5050"
          }
        ]
      },
      {
        scheme: "dvb",
        description: "dvb",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-mcroberts-uri-dvb"
          }
        ]
      },
      {
        scheme: "ed2k",
        description: "ed2k",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ed2k"
      },
      {
        scheme: "facetime",
        description: "facetime",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/facetime"
      },
      {
        scheme: "feed",
        description: "feed",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/feed"
      },
      {
        scheme: "feedready",
        description: "feedready",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/feedready"
      },
      {
        scheme: "finger",
        description: "finger",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/finger"
      },
      {
        scheme: "fish",
        description: "fish",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/fish"
      },
      {
        scheme: "gg",
        description: "gg",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/gg"
      },
      {
        scheme: "git",
        description: "git",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/git"
      },
      {
        scheme: "gizmoproject",
        description: "gizmoproject",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/gizmoproject"
      },
      {
        scheme: "gtalk",
        description: "gtalk",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/gtalk"
      },
      {
        scheme: "ham",
        description: "ham",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7046"
          }
        ]
      },
      {
        scheme: "hcp",
        description: "hcp",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/hcp"
      },
      {
        scheme: "icon",
        description: "icon",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-lafayette-icon-uri-scheme"
          }
        ]
      },
      {
        scheme: "iotdisco",
        description: "iotdisco",
        reference: [
          {
            type: "uri",
            href: "http://www.iana.org/assignments/uri-schemes/prov/iotdisco.pdf"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/prov/iotdisco"
      },
      {
        scheme: "ipn",
        description: "ipn",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6260"
          }
        ]
      },
      {
        scheme: "irc",
        description: "irc",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/irc"
      },
      {
        scheme: "irc6",
        description: "irc6",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/irc6"
      },
      {
        scheme: "ircs",
        description: "ircs",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ircs"
      },
      {
        scheme: "isostore",
        description: "isostore",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/isostore"
      },
      {
        scheme: "itms",
        description: "itms",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/itms"
      },
      {
        scheme: "jar",
        description: "jar",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/jar"
      },
      {
        scheme: "jms",
        description: "Java Message Service",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6167"
          }
        ]
      },
      {
        scheme: "keyparc",
        description: "keyparc",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/keyparc"
      },
      {
        scheme: "lastfm",
        description: "lastfm",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/lastfm"
      },
      {
        scheme: "ldaps",
        description: "ldaps",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ldaps"
      },
      {
        scheme: "magnet",
        description: "magnet",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/magnet"
      },
      {
        scheme: "maps",
        description: "maps",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/maps"
      },
      {
        scheme: "market",
        description: "market",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/market"
      },
      {
        scheme: "message",
        description: "message",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/message"
      },
      {
        scheme: "mms",
        description: "mms",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/mms"
      },
      {
        scheme: "ms-access",
        description: "ms-access",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-access"
      },
      {
        scheme: "ms-drive-to",
        description: "ms-drive-to",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-drive-to"
      },
      {
        scheme: "ms-enrollment",
        description: "ms-enrollment",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-enrollment"
      },
      {
        scheme: "ms-excel",
        description: "ms-excel",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-excel"
      },
      {
        scheme: "ms-getoffice",
        description: "ms-getoffice",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-getoffice"
      },
      {
        scheme: "ms-help",
        description: "ms-help",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-help"
      },
      {
        scheme: "ms-infopath",
        description: "ms-infopath",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-infopath"
      },
      {
        scheme: "ms-media-stream-id",
        description: "ms-media-stream-id",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-media-stream-id"
      },
      {
        scheme: "ms-powerpoint",
        description: "ms-powerpoint",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-powerpoint"
      },
      {
        scheme: "ms-project",
        description: "ms-project",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-project"
      },
      {
        scheme: "ms-publisher",
        description: "ms-publisher",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-publisher"
      },
      {
        scheme: "ms-search-repair",
        description: "ms-search-repair",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-search-repair"
      },
      {
        scheme: "ms-secondary-screen-controller",
        description: "ms-secondary-screen-controller",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-secondary-screen-controller"
      },
      {
        scheme: "ms-secondary-screen-setup",
        description: "ms-secondary-screen-setup",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-secondary-screen-setup"
      },
      {
        scheme: "ms-settings",
        description: "ms-settings",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings"
      },
      {
        scheme: "ms-settings-airplanemode",
        description: "ms-settings-airplanemode",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-airplanemode"
      },
      {
        scheme: "ms-settings-bluetooth",
        description: "ms-settings-bluetooth",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-bluetooth"
      },
      {
        scheme: "ms-settings-camera",
        description: "ms-settings-camera",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-camera"
      },
      {
        scheme: "ms-settings-cellular",
        description: "ms-settings-cellular",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-cellular"
      },
      {
        scheme: "ms-settings-cloudstorage",
        description: "ms-settings-cloudstorage",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-cloudstorage"
      },
      {
        scheme: "ms-settings-connectabledevices",
        description: "ms-settings-connectabledevices",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-connectabledevices"
      },
      {
        scheme: "ms-settings-displays-topology",
        description: "ms-settings-displays-topology",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-displays-topology"
      },
      {
        scheme: "ms-settings-emailandaccounts",
        description: "ms-settings-emailandaccounts",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-emailandaccounts"
      },
      {
        scheme: "ms-settings-language",
        description: "ms-settings-language",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-language"
      },
      {
        scheme: "ms-settings-location",
        description: "ms-settings-location",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-location"
      },
      {
        scheme: "ms-settings-lock",
        description: "ms-settings-lock",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-lock"
      },
      {
        scheme: "ms-settings-nfctransactions",
        description: "ms-settings-nfctransactions",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-nfctransactions"
      },
      {
        scheme: "ms-settings-notifications",
        description: "ms-settings-notifications",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-notifications"
      },
      {
        scheme: "ms-settings-power",
        description: "ms-settings-power",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-power"
      },
      {
        scheme: "ms-settings-privacy",
        description: "ms-settings-privacy",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-privacy"
      },
      {
        scheme: "ms-settings-proximity",
        description: "ms-settings-proximity",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-proximity"
      },
      {
        scheme: "ms-settings-screenrotation",
        description: "ms-settings-screenrotation",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-screenrotation"
      },
      {
        scheme: "ms-settings-wifi",
        description: "ms-settings-wifi",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-wifi"
      },
      {
        scheme: "ms-settings-workplace",
        description: "ms-settings-workplace",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-settings-workplace"
      },
      {
        scheme: "ms-spd",
        description: "ms-spd",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-spd"
      },
      {
        scheme: "ms-transit-to",
        description: "ms-transit-to",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-transit-to"
      },
      {
        scheme: "ms-visio",
        description: "ms-visio",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-visio"
      },
      {
        scheme: "ms-walk-to",
        description: "ms-walk-to",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-walk-to"
      },
      {
        scheme: "ms-word",
        description: "ms-word",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ms-word"
      },
      {
        scheme: "msnim",
        description: "msnim",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/msnim"
      },
      {
        scheme: "mumble",
        description: "mumble",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/mumble"
      },
      {
        scheme: "mvn",
        description: "mvn",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/mvn"
      },
      {
        scheme: "notes",
        description: "notes",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/notes"
      },
      {
        scheme: "oid",
        description: "oid",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-larmouth-oid-iri"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/prov/oid"
      },
      {
        scheme: "palm",
        description: "palm",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/palm"
      },
      {
        scheme: "paparazzi",
        description: "paparazzi",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/paparazzi"
      },
      {
        scheme: "platform",
        description: "platform",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/platform"
      },
      {
        scheme: "proxy",
        description: "proxy",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/proxy"
      },
      {
        scheme: "psyc",
        description: "psyc",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/psyc"
      },
      {
        scheme: "query",
        description: "query",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/query"
      },
      {
        scheme: "redis",
        description: "redis",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/redis"
      },
      {
        scheme: "rediss",
        description: "rediss",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/rediss"
      },
      {
        scheme: "res",
        description: "res",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/res"
      },
      {
        scheme: "resource",
        description: "resource",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/resource"
      },
      {
        scheme: "rmi",
        description: "rmi",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/rmi"
      },
      {
        scheme: "rsync",
        description: "rsync",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5781"
          }
        ]
      },
      {
        scheme: "rtmfp",
        description: "rtmfp",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc7425"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/prov/rtmfp"
      },
      {
        scheme: "rtmp",
        description: "rtmp",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/rtmp"
      },
      {
        scheme: "secondlife",
        description: "query",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/secondlife"
      },
      {
        scheme: "sftp",
        description: "query",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/sftp"
      },
      {
        scheme: "sgn",
        description: "sgn",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/sgn"
      },
      {
        scheme: "skype",
        description: "skype",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/skype"
      },
      {
        scheme: "smb",
        description: "smb",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/smb"
      },
      {
        scheme: "smtp",
        description: "smtp",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-melnikov-smime-msa-to-mda"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/prov/smtp"
      },
      {
        scheme: "soldat",
        description: "soldat",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/soldat"
      },
      {
        scheme: "spotify",
        description: "spotify",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/spotify"
      },
      {
        scheme: "ssh",
        description: "ssh",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ssh"
      },
      {
        scheme: "steam",
        description: "steam",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/steam"
      },
      {
        scheme: "submit",
        description: "submit",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-melnikov-smime-msa-to-mda"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/prov/submit"
      },
      {
        scheme: "svn",
        description: "svn",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/svn"
      },
      {
        scheme: "teamspeak",
        description: "teamspeak",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/teamspeak"
      },
      {
        scheme: "teliaeid",
        description: "teliaeid",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/teliaeid"
      },
      {
        scheme: "things",
        description: "things",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/things"
      },
      {
        scheme: "tool",
        description: "tool",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/tool"
      },
      {
        scheme: "udp",
        description: "udp",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/udp"
      },
      {
        scheme: "unreal",
        description: "unreal",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/unreal"
      },
      {
        scheme: "ut2004",
        description: "ut2004",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ut2004"
      },
      {
        scheme: "v-event",
        description: "v-event",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-menderico-v-event-uri"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/prov/v-event"
      },
      {
        scheme: "ventrilo",
        description: "ventrilo",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ventrilo"
      },
      {
        scheme: "view-source",
        description: "view-source",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/view-source"
      },
      {
        scheme: "webcal",
        description: "webcal",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/webcal"
      },
      {
        scheme: "wpid",
        description: "wpid",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/wpid"
      },
      {
        scheme: "wtai",
        description: "wtai",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/wtai"
      },
      {
        scheme: "wyciwyg",
        description: "wyciwyg",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/wyciwyg"
      },
      {
        scheme: "xfire",
        description: "xfire",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/xfire"
      },
      {
        scheme: "xri",
        description: "xri",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/xri"
      },
      {
        scheme: "ymsgr",
        description: "ymsgr",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/prov/ymsgr"
      }
    ];
  }
});

// node_modules/schemes/lib/iana-historical.json
var require_iana_historical = __commonJS({
  "node_modules/schemes/lib/iana-historical.json"(exports, module2) {
    module2.exports = [
      {
        scheme: "fax",
        description: "fax",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2806"
          },
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3966"
          }
        ]
      },
      {
        scheme: "filesystem",
        description: "filesystem",
        reference: [],
        template: "http://www.iana.org/assignments/uri-schemes/historic/filesystem"
      },
      {
        scheme: "mailserver",
        description: "Access to data available from mail servers",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc6196"
          }
        ]
      },
      {
        scheme: "modem",
        description: "modem",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2806"
          },
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3966"
          }
        ]
      },
      {
        scheme: "pack",
        description: "pack",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-shur-pack-uri-scheme"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/historic/pack"
      },
      {
        scheme: "prospero",
        description: "Prospero Directory Service",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4157"
          }
        ]
      },
      {
        scheme: "snews",
        description: "NNTP over SSL/TLS",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc5538"
          }
        ]
      },
      {
        scheme: "videotex",
        description: "videotex",
        reference: [
          {
            type: "draft",
            href: "http://www.iana.org/go/draft-mavrakis-videotex-url-spec"
          },
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2122"
          },
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc3986"
          }
        ],
        template: "http://www.iana.org/assignments/uri-schemes/historic/videotex"
      },
      {
        scheme: "wais",
        description: "Wide Area Information Servers",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc4156"
          }
        ]
      },
      {
        scheme: "z39.50",
        description: "Z39.50 information access",
        reference: [
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc1738"
          },
          {
            type: "rfc",
            href: "http://www.iana.org/go/rfc2056"
          }
        ]
      }
    ];
  }
});

// node_modules/schemes/lib/unofficial.json
var require_unofficial = __commonJS({
  "node_modules/schemes/lib/unofficial.json"(exports, module2) {
    module2.exports = [
      {
        scheme: "android-app"
      },
      {
        scheme: "webpack"
      },
      {
        scheme: "s3",
        description: "Amazon Web Services S3 bucket"
      },
      {
        scheme: "gs",
        description: "Google Cloud Storage"
      },
      {
        scheme: "mqtt",
        description: "Message Queuing Telemetry Transport Protocol"
      },
      {
        scheme: "modbus+tcp",
        description: "Modbus over TCP"
      }
    ];
  }
});

// node_modules/schemes/index.js
var require_schemes = __commonJS({
  "node_modules/schemes/index.js"(exports, module2) {
    "use strict";
    var extend = require_extend();
    var data = {
      permanent: require_iana_permanent(),
      provosional: require_iana_provisional(),
      historical: require_iana_historical()
    };
    var allByName = {};
    Object.keys(data).forEach(function(type) {
      data[type].forEach(function(schemeObj) {
        allByName[schemeObj.scheme] = extend(schemeObj, { type });
      });
    });
    data.unofficial = require_unofficial().filter(function(item) {
      return !allByName[item.scheme];
    });
    data.unofficial.forEach(function(schemeObj) {
      allByName[schemeObj.scheme] = extend(schemeObj, { type: "unofficial" });
    });
    module2.exports = extend(data, { allByName });
  }
});

// node_modules/ajv-formats-draft2019/formats/iri.js
var require_iri = __commonJS({
  "node_modules/ajv-formats-draft2019/formats/iri.js"(exports, module2) {
    var { parse } = require_uri_all();
    var { addressParser } = require_lib();
    var schemes = require_schemes();
    function validate(address) {
      try {
        addressParser(address);
        return true;
      } catch (err) {
        return false;
      }
    }
    module2.exports = (value) => {
      const iri = parse(value);
      if (iri.scheme === "mailto" && iri.to.every(validate)) {
        return true;
      }
      if (iri.reference === "absolute" && schemes.allByName[iri.scheme]) {
        return true;
      }
      return false;
    };
  }
});

// node_modules/ajv-formats-draft2019/formats/duration.js
var require_duration = __commonJS({
  "node_modules/ajv-formats-draft2019/formats/duration.js"(exports, module2) {
    module2.exports = /^P(?!$)(\d+(?:\.\d+)?Y)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?W)?(\d+(?:\.\d+)?D)?(T(?=\d)(\d+(?:\.\d+)?H)?(\d+(?:\.\d+)?M)?(\d+(?:\.\d+)?S)?)?$/;
  }
});

// node_modules/ajv-formats-draft2019/formats/idn-email.js
var require_idn_email = __commonJS({
  "node_modules/ajv-formats-draft2019/formats/idn-email.js"(exports, module2) {
    var { parse } = require_lib();
    module2.exports = (value) => {
      try {
        parse(value);
        return true;
      } catch (err) {
        return false;
      }
    };
  }
});

// node_modules/ajv-formats-draft2019/formats/idn-hostname.js
var require_idn_hostname = __commonJS({
  "node_modules/ajv-formats-draft2019/formats/idn-hostname.js"(exports, module2) {
    var { toASCII } = require("punycode");
    var hostnameRegex = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i;
    module2.exports = (value) => {
      const hostname = toASCII(value);
      return hostname.replace(/\.$/, "").length <= 253 && hostnameRegex.test(hostname);
    };
  }
});

// node_modules/ajv-formats-draft2019/formats/iri-reference.js
var require_iri_reference = __commonJS({
  "node_modules/ajv-formats-draft2019/formats/iri-reference.js"(exports, module2) {
    var { parse } = require_uri_all();
    var { addressParser } = require_lib();
    var schemes = require_schemes();
    function validate(address) {
      try {
        addressParser(address);
        return true;
      } catch (err) {
        return false;
      }
    }
    module2.exports = (value) => {
      const iri = parse(value);
      if (iri.scheme === "mailto" && iri.to.every(validate)) {
        return true;
      }
      if (iri.reference === "absolute" && iri.path !== void 0 && schemes.allByName[iri.scheme]) {
        return true;
      }
      if (iri.scheme && !schemes.allByName[iri.scheme]) {
        return false;
      }
      return iri.path !== void 0 && (iri.reference === "relative" || iri.reference === "same-document" || iri.reference === "uri");
    };
  }
});

// node_modules/ajv-formats-draft2019/formats/index.js
var require_formats2 = __commonJS({
  "node_modules/ajv-formats-draft2019/formats/index.js"(exports, module2) {
    module2.exports.iri = require_iri();
    module2.exports.duration = require_duration();
    module2.exports["idn-email"] = require_idn_email();
    module2.exports["idn-hostname"] = require_idn_hostname();
    module2.exports["iri-reference"] = require_iri_reference();
  }
});

// node_modules/ajv-formats-draft2019/index.js
var require_ajv_formats_draft2019 = __commonJS({
  "node_modules/ajv-formats-draft2019/index.js"(exports, module2) {
    var formats = require_formats2();
    module2.exports = (ajv, options = {}) => {
      const allFormats = Object.keys(formats);
      let formatsToInstall = allFormats;
      if (options.formats) {
        if (!Array.isArray(options.formats))
          throw new Error("options.formats must be an array");
        formatsToInstall = options.formats;
      }
      allFormats.filter((format) => formatsToInstall.includes(format)).forEach((key) => {
        ajv.addFormat(key, formats[key]);
      });
      return ajv;
    };
  }
});

// node_modules/@middy/validator/index.js
var require_validator = __commonJS({
  "node_modules/@middy/validator/index.js"(exports, module2) {
    "use strict";
    var {
      createError
    } = require_util();
    var _ajv = require__();
    var localize = require_localize();
    var formats = require_dist();
    var formatsDraft2019 = require_ajv_formats_draft2019();
    var Ajv = _ajv.default;
    var ajv;
    var ajvDefaults = {
      strict: true,
      coerceTypes: "array",
      allErrors: true,
      useDefaults: "empty",
      messages: false
    };
    var defaults = {
      inputSchema: void 0,
      outputSchema: void 0,
      ajvOptions: {},
      ajvInstance: void 0,
      defaultLanguage: "en",
      i18nEnabled: true
    };
    var validatorMiddleware = (opts = {}) => {
      let {
        inputSchema,
        outputSchema,
        ajvOptions,
        ajvInstance,
        defaultLanguage,
        i18nEnabled
      } = __spreadValues(__spreadValues({}, defaults), opts);
      inputSchema = compile(inputSchema, ajvOptions, ajvInstance);
      outputSchema = compile(outputSchema, ajvOptions, ajvInstance);
      const validatorMiddlewareBefore = async (request) => {
        const valid = inputSchema(request.event);
        if (!valid) {
          const error = createError(400, "Event object failed validation");
          request.event.headers = __spreadValues({}, request.event.headers);
          if (i18nEnabled) {
            const language = chooseLanguage(request.event, defaultLanguage);
            localize[language](inputSchema.errors);
          }
          error.details = inputSchema.errors;
          throw error;
        }
      };
      const validatorMiddlewareAfter = async (request) => {
        const valid = outputSchema(request.response);
        if (!valid) {
          const error = createError(500, "Response object failed validation");
          error.details = outputSchema.errors;
          error.response = request.response;
          throw error;
        }
      };
      return {
        before: inputSchema ? validatorMiddlewareBefore : void 0,
        after: outputSchema ? validatorMiddlewareAfter : void 0
      };
    };
    var compile = (schema, ajvOptions, ajvInstance = null) => {
      if (typeof schema === "function" || !schema)
        return schema;
      const options = __spreadValues(__spreadValues({}, ajvDefaults), ajvOptions);
      if (!ajv) {
        ajv = ajvInstance !== null && ajvInstance !== void 0 ? ajvInstance : new Ajv(options);
        formats(ajv);
        formatsDraft2019(ajv);
      } else if (!ajvInstance) {
        ajv.opts = __spreadValues(__spreadValues({}, ajv.opts), options);
      }
      return ajv.compile(schema);
    };
    var languageNormalizationMap = {
      pt: "pt-BR",
      "pt-br": "pt-BR",
      pt_BR: "pt-BR",
      pt_br: "pt-BR",
      "zh-tw": "zh-TW",
      zh_TW: "zh-TW",
      zh_tw: "zh-TW"
    };
    var normalizePreferredLanguage = (lang) => {
      var _languageNormalizatio;
      return (_languageNormalizatio = languageNormalizationMap[lang]) !== null && _languageNormalizatio !== void 0 ? _languageNormalizatio : lang;
    };
    var availableLanguages = Object.keys(localize);
    var chooseLanguage = ({
      preferredLanguage
    }, defaultLanguage) => {
      if (preferredLanguage) {
        const lang = normalizePreferredLanguage(preferredLanguage);
        if (availableLanguages.includes(lang)) {
          return lang;
        }
      }
      return defaultLanguage;
    };
    module2.exports = validatorMiddleware;
  }
});

// node_modules/@middy/util/codes.json
var require_codes2 = __commonJS({
  "node_modules/@middy/util/codes.json"(exports, module2) {
    module2.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "306": "(Unused)",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Unordered Collection",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});

// node_modules/@middy/util/index.js
var require_util4 = __commonJS({
  "node_modules/@middy/util/index.js"(exports, module2) {
    "use strict";
    var {
      Agent
    } = require("https");
    var awsClientDefaultOptions = {
      httpOptions: {
        agent: new Agent({
          secureProtocol: "TLSv1_2_method"
        })
      }
    };
    var createPrefetchClient = (options) => {
      const awsClientOptions = __spreadValues(__spreadValues({}, awsClientDefaultOptions), options.awsClientOptions);
      const client = new options.AwsClient(awsClientOptions);
      if (options.awsClientCapture) {
        return options.awsClientCapture(client);
      }
      return client;
    };
    var createClient = async (options, request) => {
      let awsClientCredentials = {};
      if (options.awsClientAssumeRole) {
        if (!request)
          throw new Error("Request required when assuming role");
        awsClientCredentials = await getInternal({
          credentials: options.awsClientAssumeRole
        }, request);
      }
      awsClientCredentials = __spreadValues(__spreadValues({}, awsClientCredentials), options.awsClientOptions);
      return createPrefetchClient(__spreadProps(__spreadValues({}, options), {
        awsClientOptions: awsClientCredentials
      }));
    };
    var canPrefetch = (options) => {
      return !(options !== null && options !== void 0 && options.awsClientAssumeRole) && !(options !== null && options !== void 0 && options.disablePrefetch);
    };
    var getInternal = async (variables, request) => {
      if (!variables || !request)
        return {};
      let keys = [];
      let values = [];
      if (variables === true) {
        keys = values = Object.keys(request.internal);
      } else if (typeof variables === "string") {
        keys = values = [variables];
      } else if (Array.isArray(variables)) {
        keys = values = variables;
      } else if (typeof variables === "object") {
        keys = Object.keys(variables);
        values = Object.values(variables);
      }
      const promises = [];
      for (const internalKey of values) {
        var _valuePromise;
        const pathOptionKey = internalKey.split(".");
        const rootOptionKey = pathOptionKey.shift();
        let valuePromise = request.internal[rootOptionKey];
        if (typeof ((_valuePromise = valuePromise) === null || _valuePromise === void 0 ? void 0 : _valuePromise.then) !== "function") {
          valuePromise = Promise.resolve(valuePromise);
        }
        promises.push(valuePromise.then((value) => pathOptionKey.reduce((p, c) => p === null || p === void 0 ? void 0 : p[c], value)));
      }
      values = await Promise.allSettled(promises);
      const errors = values.filter((res) => res.status === "rejected").map((res) => res.reason.message);
      if (errors.length)
        throw new Error(JSON.stringify(errors));
      return keys.reduce((obj, key, index) => __spreadProps(__spreadValues({}, obj), {
        [sanitizeKey(key)]: values[index].value
      }), {});
    };
    var sanitizeKeyPrefixLeadingNumber = /^([0-9])/;
    var sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g;
    var sanitizeKey = (key) => {
      return key.replace(sanitizeKeyPrefixLeadingNumber, "_$1").replace(sanitizeKeyRemoveDisallowedChar, "_");
    };
    var cache = {};
    var processCache = (options, fetch = () => void 0, request) => {
      const {
        cacheExpiry,
        cacheKey
      } = options;
      if (cacheExpiry) {
        const cached = getCache(cacheKey);
        const unexpired = cached && (cacheExpiry < 0 || cached.expiry > Date.now());
        if (unexpired && cached.modified) {
          const value2 = fetch(request, cached.value);
          cache[cacheKey] = {
            value: __spreadValues(__spreadValues({}, cached.value), value2),
            expiry: cached.expiry
          };
          return cache[cacheKey];
        }
        if (unexpired) {
          return __spreadProps(__spreadValues({}, cached), {
            cache: true
          });
        }
      }
      const value = fetch(request);
      const expiry = Date.now() + cacheExpiry;
      if (cacheExpiry) {
        cache[cacheKey] = {
          value,
          expiry
        };
      }
      return {
        value,
        expiry
      };
    };
    var getCache = (key) => {
      return cache[key];
    };
    var modifyCache = (cacheKey, value) => {
      if (!cache[cacheKey])
        return;
      cache[cacheKey] = __spreadProps(__spreadValues({}, cache[cacheKey]), {
        value,
        modified: true
      });
    };
    var clearCache = (keys = null) => {
      var _keys;
      keys = (_keys = keys) !== null && _keys !== void 0 ? _keys : Object.keys(cache);
      if (!Array.isArray(keys))
        keys = [keys];
      for (const cacheKey of keys) {
        cache[cacheKey] = void 0;
      }
    };
    var jsonSafeParse = (string, reviver) => {
      if (typeof string !== "string")
        return string;
      const firstChar = string[0];
      if (firstChar !== "{" && firstChar !== "[" && firstChar !== '"')
        return string;
      try {
        return JSON.parse(string, reviver);
      } catch (e) {
      }
      return string;
    };
    var normalizeHttpResponse = (response) => {
      var _response$headers, _response;
      if (response === void 0) {
        response = {};
      } else if (Array.isArray(response) || typeof response !== "object" || response === null) {
        response = {
          body: response
        };
      }
      response.headers = (_response$headers = (_response = response) === null || _response === void 0 ? void 0 : _response.headers) !== null && _response$headers !== void 0 ? _response$headers : {};
      return response;
    };
    var statuses = require_codes2();
    var {
      inherits
    } = require("util");
    var createErrorRegexp = /[^a-zA-Z]/g;
    var createError = (code, message, properties = {}) => {
      const name = statuses[code].replace(createErrorRegexp, "");
      const className = name.substr(-5) !== "Error" ? name + "Error" : name;
      function HttpError(message2) {
        const msg = message2 !== null && message2 !== void 0 ? message2 : statuses[code];
        const err = new Error(msg);
        Error.captureStackTrace(err, HttpError);
        Object.setPrototypeOf(err, HttpError.prototype);
        Object.defineProperty(err, "message", {
          enumerable: true,
          configurable: true,
          value: msg,
          writable: true
        });
        Object.defineProperty(err, "name", {
          enumerable: false,
          configurable: true,
          value: className,
          writable: true
        });
        return err;
      }
      inherits(HttpError, Error);
      const desc = Object.getOwnPropertyDescriptor(HttpError, "name");
      desc.value = className;
      Object.defineProperty(HttpError, "name", desc);
      Object.assign(HttpError.prototype, {
        status: code,
        statusCode: code,
        expose: code < 500
      }, properties);
      return new HttpError(message);
    };
    module2.exports = {
      createPrefetchClient,
      createClient,
      canPrefetch,
      getInternal,
      sanitizeKey,
      processCache,
      getCache,
      modifyCache,
      clearCache,
      jsonSafeParse,
      normalizeHttpResponse,
      createError
    };
  }
});

// node_modules/@middy/http-json-body-parser/index.js
var require_http_json_body_parser = __commonJS({
  "node_modules/@middy/http-json-body-parser/index.js"(exports, module2) {
    "use strict";
    var mimePattern = /^application\/(.+\+)?json(;.*)?$/;
    var defaults = {
      reviver: void 0
    };
    var httpJsonBodyParserMiddleware = (opts = {}) => {
      const options = __spreadValues(__spreadValues({}, defaults), opts);
      const httpJsonBodyParserMiddlewareBefore = async (request) => {
        var _headers$ContentType;
        const {
          headers,
          body
        } = request.event;
        const contentTypeHeader = (_headers$ContentType = headers === null || headers === void 0 ? void 0 : headers["Content-Type"]) !== null && _headers$ContentType !== void 0 ? _headers$ContentType : headers === null || headers === void 0 ? void 0 : headers["content-type"];
        if (mimePattern.test(contentTypeHeader)) {
          try {
            const data = request.event.isBase64Encoded ? Buffer.from(body, "base64").toString() : body;
            request.event.rawBody = body;
            request.event.body = JSON.parse(data, options.reviver);
          } catch (err) {
            const {
              createError
            } = require_util4();
            throw createError(422, "Content type defined as JSON but an invalid JSON was provided");
          }
        }
      };
      return {
        before: httpJsonBodyParserMiddlewareBefore
      };
    };
    module2.exports = httpJsonBodyParserMiddleware;
  }
});

// src/functions/hello/handler.ts
var handler_exports = {};
__export(handler_exports, {
  main: () => main
});

// src/libs/apiGateway.ts
var formatJSONResponse = (response) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};

// src/libs/lambda.ts
var import_core = __toESM(require_core());
var import_validator = __toESM(require_validator());
var import_http_json_body_parser = __toESM(require_http_json_body_parser());
var middyfy = (handler, { schema } = {}) => {
  const wrappedHandler = (0, import_core.default)(handler).use((0, import_http_json_body_parser.default)());
  if (schema) {
    wrappedHandler.use((0, import_validator.default)({
      inputSchema: {
        type: "object",
        properties: {
          body: schema
        }
      }
    }));
  }
  return wrappedHandler;
};

// src/functions/hello/handler.ts
var hello = async (event) => {
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event
  });
};
var main = middyfy(hello);
module.exports = __toCommonJS(handler_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
//# sourceMappingURL=handler.js.map
