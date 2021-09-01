/*! For license information please see index.js.LICENSE.txt */
(() => {
    "use strict";
    var t = [, t => {
            t.exports = require("tree-snap-shot")
        }, (t, e, o) => {
            o.r(e), o.d(e, {
                default: () => u
            }), e = o(1);
            var n = o.n(e);

            function r(t, e, o) {
                return e in t ? Object.defineProperty(t, e, {
                    value: o,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : t[e] = o, t
            }

            function i(t) {
                return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                    return typeof t
                } : function (t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                })(t)
            }(e = function () {
                function t() {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), r(this, "logIndex", 0), r(this, "branch", "master"), r(this, "el", null), r(this, "backup", null), r(this, "currentLogs", {}), r(this, "logs", {})
                }
                var e;
                return (e = [{
                    key: "init",
                    value: function (t) {
                        return "string" != typeof t && "number" != typeof t || (this.branch = t), null !== (t = this.backup) && void 0 !== t && t.clear && this.backup.clear(), this.backup = null, this.el = null, this.currentLogs = this.logs[this.branch] = {}, this
                    }
                }, {
                    key: "rm",
                    value: function () {}
                }, {
                    key: "commit",
                    value: function (t) {
                        if (!this.el) return this;
                        var e;
                        n().deepEqual(this.backup, this.el) || (null !== (e = (o = this.backup).clear) && void 0 !== e && e.call(o), this.backup = n().toImmutable(this.el));
                        var o = {
                            index: this.logIndex,
                            timestamp: (new Date).getTime(),
                            value: this.backup
                        };
                        return this.currentLogs[t] = o, this.logIndex++, this
                    }
                }, {
                    key: "merge",
                    value: function () {}
                }, {
                    key: "log",
                    value: function (t) {}
                }, {
                    key: "status",
                    value: function () {}
                }, {
                    key: "diff",
                    value: function () {}
                }, {
                    key: "reset",
                    value: function (t, e) {
                        var o;
                        (t = null === (e = this.logs[void 0 === e ? this.branch : e]) || void 0 === e ? void 0 : e[t]) && n().compare(this.backup, t.value).exportLog((function (t) {
                            o = t
                        })).replay(o, this.el)
                    }
                }, {
                    key: "revert",
                    value: function () {}
                }]) && function (t, e) {
                    for (var o = 0; o < e.length; o++) {
                        var n = e[o];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
                    }
                }(t.prototype, e), t
            }()).prototype.pipe = function (t) {
                var e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "master";
                if (t && "object" != i(t)) throw new Error("只能绑定 typeof == “object” 普通对象或数组");
                if (!e || "string" != typeof e && "number" != typeof e) throw new Error("branchId类型只能是(string/number)");
                return this.branch = e, this.el = t, this.backup = n().toImmutable(t), this.logs[this.branch] ? this.currentLogs = this.logs[this.branch] : this.currentLogs = this.logs[this.branch] = {}, this
            };
            const u = e
        }],
        e = {};

    function o(n) {
        var r = e[n];
        return void 0 !== r || (r = e[n] = {
            exports: {}
        }, t[n](r, r.exports, o)), r.exports
    }
    o.amdO = {}, o.n = t => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return o.d(e, {
            a: e
        }), e
    }, o.d = (t, e) => {
        for (var n in e) o.o(e, n) && !o.o(t, n) && Object.defineProperty(t, n, {
            enumerable: !0,
            get: e[n]
        })
    }, o.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), o.r = t => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    };
    var n = {};
    (() => {
        o.r(n);
        var t, e, r = o(2);

        function i(t) {
            return (i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            })(t)
        }
        t = void 0, e = function (t) {
            var e = r.default;
            t.default = e
        }, "object" === ("undefined" == typeof exports ? "undefined" : i(exports)) ? e(exports) : "function" == typeof define && o.amdO ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).DataTimeLine = {})
    })()
})();