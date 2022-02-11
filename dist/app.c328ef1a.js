// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"views/pages/Error404.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const Error404 = {
  allowAccess: async () => true,
  render: async () => {
    const view =
    /*html*/
    `
      <h1>Not Found</h1>
    `;
    return view;
  },
  postRender: async () => {}
};
var _default = Error404;
exports.default = _default;
},{}],"services/expensesApi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const expensesApi = {
  getTotals: async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      };
      const res = await fetch(`${window.env.API_URL}/total`, options);
      const json = await res.json();
      return json;
    } catch (err) {
      console.log("Error getting total", err);
    }
  },
  getReports: async () => {
    try {
      const token = await window.auth0Client.getTokenSilently();
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      const res = await fetch(`${window.env.API_URL}/reports`, options);
      const json = await res.json();
      return json;
    } catch (err) {
      console.log("Error getting reports", err);
    }
  }
};
var _default = expensesApi;
exports.default = _default;
},{}],"views/pages/Home.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expensesApi = _interopRequireDefault(require("../../services/expensesApi.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Home = {
  allowAccess: async () => true,
  render: async () => {
    const summary = await _expensesApi.default.getTotals();
    const view =
    /*html*/
    `
    <h1>Home Page</h1>
    <p id="user-greet">Hello, ${window.user.name}</p>
    <p>So far, this app has been used to manage:</p>
    <div id="summary">
    <ul>
      <li><strong id="expenses-count">${summary.count}</strong> expenses</li>
      <li>$<strong id="expenses-total">
      ${summary.total.toFixed(2)}
      </strong> dollars</li>
    </ul>
    </div>    
    `;
    return view;
  },
  postRender: async () => {}
};
var _default = Home;
exports.default = _default;
},{"../../services/expensesApi.js":"services/expensesApi.js"}],"views/components/Table.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const format = data => {
  if (typeof data === "number") return `$${data.toFixed(2)}`;
  if (data instanceof Date) return data.toLocaleDateString("en-US");
  return data;
};

const Data = data =>
/*html*/
`<td>${format(data)}</td>`;

const Body = data => data.map(data =>
/*html*/
`<tr>
   ${Object.keys(data).map(k => Data(data[k])).join("\n ")}
  </tr>`).join("\n ");

const Header = labels =>
/*html*/
`
<tr>
  ${labels.map(l =>
/*html*/
`<th><strong>${l}</strong></th>`).join("\n ")}
</tr>
`;

const Table = {
  render: async data =>
  /*html*/
  `
  <table border="1">
    ${Header(Object.keys(data[0]))}
    ${Body(data)}
  </table>
  `,
  postRender: async () => {}
};
var _default = Table;
exports.default = _default;
},{}],"views/pages/Expenses.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _expensesApi = _interopRequireDefault(require("../../services/expensesApi.js"));

var _Table = _interopRequireDefault(require("../components/Table.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Expenses = {
  allowAccess: async () => window.auth0Client.isAuthenticated(),
  render: async () => {
    const expenses = await _expensesApi.default.getReports();
    const view =
    /*html*/
    `
    <h1>Expense Report</h1>
    <p id="user-greet">Hello, ${window.user.name}</p>
    <p>These are your expenses:</p>
    ${await _Table.default.render(expenses)}
    `;
    return view;
  },
  postRender: async () => {}
};
var _default = Expenses;
exports.default = _default;
},{"../../services/expensesApi.js":"services/expensesApi.js","../components/Table.js":"views/components/Table.js"}],"images/auth0.png":[function(require,module,exports) {
module.exports = "/auth0.baba6d95.png";
},{}],"images/profile.png":[function(require,module,exports) {
module.exports = "/profile.8eeaf93c.png";
},{}],"views/components/Navbar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _auth = _interopRequireDefault(require("../../images/auth0.png"));

var _profile = _interopRequireDefault(require("../../images/profile.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// default user
window.user = {
  name: "Anonymous",
  picture: _profile.default
};
const Navbar = {
  render: async () => {
    const isAuthenticated = await window.auth0Client.isAuthenticated();
    const view =
    /*html*/
    `
    <li class="logo">
      <a href="#">
        <img src="${_auth.default}" alt="Auth0" />
      </a>
    </li>
    <li>
      <a id="home-link" href="#">Home</a>
    </li>
    <li>
      <a id="expenses-link" href="#expenses">Expenses</a>
    </li>
    <li>
    <a id="expenses-link" href="#tokens">Tokens</a>
    </li>
    <li class="spacer" />
    <li id="log-out" style="display: ${isAuthenticated ? "block" : "none"}">
      <a href="#"> Logout</a>
    </li>
    <li id="log-in" style="display: ${isAuthenticated ? "none" : "block"}">
      <a href="#"> Login</a>
    </li>
    <li class="profile">
      <img src="${window.user.picture}" />
    </li>
    `;
    return view;
  },
  postRender: async () => {
    document.getElementById("log-in").addEventListener("click", async e => {
      e.preventDefault();
      await window.auth0Client.loginWithRedirect();
    });
    document.getElementById("log-out").addEventListener("click", e => {
      e.preventDefault();
      window.auth0Client.logout({
        returnTo: window.env.APP_URL
      });
    });
  }
};
var _default = Navbar;
exports.default = _default;
},{"../../images/auth0.png":"images/auth0.png","../../images/profile.png":"images/profile.png"}],"images/icon-id-token.svg":[function(require,module,exports) {
module.exports = "/icon-id-token.98a09512.svg";
},{}],"images/icon-access-token.svg":[function(require,module,exports) {
module.exports = "/icon-access-token.72d214ff.svg";
},{}],"views/pages/Tokens.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iconIdToken = _interopRequireDefault(require("../../images/icon-id-token.svg"));

var _iconAccessToken = _interopRequireDefault(require("../../images/icon-access-token.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Tokens = {
  allowAccess: async () => window.auth0Client.isAuthenticated(),
  render: async () => {
    const token = await window.auth0Client.getTokenSilently();
    const claims = await window.auth0Client.getIdTokenClaims();
    console.log(claims);
    const view =
    /*html*/
    `
      <h1>
        Tokens
      </h1>
      <p id="user-greet">Hello, ${window.user.name}. Here's some tokens.</p>
      
      <p>ID token:
        <a href=https://jwt.io?token=${claims.__raw}><img src=${_iconIdToken.default} /></a>
      </p>
      <p>Access token:
        <a href=https://jwt.io?token=${token}><img src=${_iconAccessToken.default} /></a>
      </p>
      `;
    return view;
  },
  postRender: async () => {}
};
var _default = Tokens;
exports.default = _default;
},{"../../images/icon-id-token.svg":"images/icon-id-token.svg","../../images/icon-access-token.svg":"images/icon-access-token.svg"}],"router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Error = _interopRequireDefault(require("./views/pages/Error404"));

var _Home = _interopRequireDefault(require("./views/pages/Home"));

var _Expenses = _interopRequireDefault(require("./views/pages/Expenses"));

var _Navbar = _interopRequireDefault(require("./views/components/Navbar"));

var _Tokens = _interopRequireDefault(require("./views/pages/Tokens"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = {
  "/": _Home.default,
  expenses: _Expenses.default,
  tokens: _Tokens.default
};
const navbar = document.getElementById("navbar");
const content = document.getElementById("content");

const router = async () => {
  //check the query string of the current URL for an authorization code
  //if so, tell the auth0 client to handle redirect callback obv.
  if (new URLSearchParams(window.location.search).has("code")) {
    await window.auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  } //if the user has been authenticated, fetch user profile and attach to windows instances with getUser()


  if (await window.auth0Client.isAuthenticated()) window.user = await window.auth0Client.getUser();
  const request = location.hash.slice(1).toLowerCase() || "/";
  const page = routes[request] || _Error.default;

  if (await page.allowAccess()) {
    content.innerHTML = await page.render();
    await page.postRender();
  } else {
    window.history.replaceState({}, document.title, "/");
  }

  navbar.innerHTML = await _Navbar.default.render();
  await _Navbar.default.postRender();
};

var _default = router;
exports.default = _default;
},{"./views/pages/Error404":"views/pages/Error404.js","./views/pages/Home":"views/pages/Home.js","./views/pages/Expenses":"views/pages/Expenses.js","./views/components/Navbar":"views/components/Navbar.js","./views/pages/Tokens":"views/pages/Tokens.js"}],"app.js":[function(require,module,exports) {
"use strict";

var _router = _interopRequireDefault(require("./router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(async function () {
  const domain = window.env.AUTH0_DOMAIN;
  const client_id = window.env.CLIENT_ID;
  const redirect_uri = window.env.APP_URL;
  window.auth0Client = await createAuth0Client({
    domain,
    client_id,
    redirect_uri,
    audience: "https://expenses-api",
    scope: "openid email profile read:reports"
  }); // handle user navigation

  window.addEventListener("hashchange", _router.default);
  window.addEventListener("load", _router.default); //handle user reload of browser

  if (sessionStorage.getItem("reload")) await (0, _router.default)();
  sessionStorage.setItem("reload", "true");
})();
},{"./router":"router.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55195" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.c328ef1a.js.map