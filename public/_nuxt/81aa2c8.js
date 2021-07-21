(window.webpackJsonp = window.webpackJsonp || []).push([
  [3],
  {
    581: function (t, e, r) {
      "use strict";
      r(59), r(154), r(51), r(159), r(67), r(61), r(60);
      var n = r(1),
        o = r(35),
        c = r(157),
        l = r(160);
      function d(object, t) {
        var e = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(object);
          t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(object, t).enumerable;
            })),
            e.push.apply(e, r);
        }
        return e;
      }
      function f(t) {
        for (var i = 1; i < arguments.length; i++) {
          var source = null != arguments[i] ? arguments[i] : {};
          i % 2
            ? d(Object(source), !0).forEach(function (e) {
                Object(n.a)(t, e, source[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(
                t,
                Object.getOwnPropertyDescriptors(source)
              )
            : d(Object(source)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(source, e)
                );
              });
        }
        return t;
      }
      e.a = Object(o.a)(c.a, Object(l.b)("form")).extend({
        name: "v-form",
        provide: function () {
          return { form: this };
        },
        inheritAttrs: !1,
        props: {
          disabled: Boolean,
          lazyValidation: Boolean,
          readonly: Boolean,
          value: Boolean
        },
        data: function () {
          return { inputs: [], watchers: [], errorBag: {} };
        },
        watch: {
          errorBag: {
            handler: function (t) {
              var e = Object.values(t).includes(!0);
              this.$emit("input", !e);
            },
            deep: !0,
            immediate: !0
          }
        },
        methods: {
          watchInput: function (input) {
            var t = this,
              e = function (input) {
                return input.$watch(
                  "hasError",
                  function (e) {
                    t.$set(t.errorBag, input._uid, e);
                  },
                  { immediate: !0 }
                );
              },
              r = {
                _uid: input._uid,
                valid: function () {},
                shouldValidate: function () {}
              };
            return (
              this.lazyValidation
                ? (r.shouldValidate = input.$watch(
                    "shouldValidate",
                    function (n) {
                      n &&
                        (t.errorBag.hasOwnProperty(input._uid) ||
                          (r.valid = e(input)));
                    }
                  ))
                : (r.valid = e(input)),
              r
            );
          },
          validate: function () {
            return (
              0 ===
              this.inputs.filter(function (input) {
                return !input.validate(!0);
              }).length
            );
          },
          reset: function () {
            this.inputs.forEach(function (input) {
              return input.reset();
            }),
              this.resetErrorBag();
          },
          resetErrorBag: function () {
            var t = this;
            this.lazyValidation &&
              setTimeout(function () {
                t.errorBag = {};
              }, 0);
          },
          resetValidation: function () {
            this.inputs.forEach(function (input) {
              return input.resetValidation();
            }),
              this.resetErrorBag();
          },
          register: function (input) {
            this.inputs.push(input), this.watchers.push(this.watchInput(input));
          },
          unregister: function (input) {
            var t = this.inputs.find(function (i) {
              return i._uid === input._uid;
            });
            if (t) {
              var e = this.watchers.find(function (i) {
                return i._uid === t._uid;
              });
              e && (e.valid(), e.shouldValidate()),
                (this.watchers = this.watchers.filter(function (i) {
                  return i._uid !== t._uid;
                })),
                (this.inputs = this.inputs.filter(function (i) {
                  return i._uid !== t._uid;
                })),
                this.$delete(this.errorBag, t._uid);
            }
          }
        },
        render: function (t) {
          var e = this;
          return t(
            "form",
            {
              staticClass: "v-form",
              attrs: f({ novalidate: !0 }, this.attrs$),
              on: {
                submit: function (t) {
                  return e.$emit("submit", t);
                }
              }
            },
            this.$slots.default
          );
        }
      });
    },
    844: function (t, e, r) {
      "use strict";
      r.r(e);
      r(52);
      var n = r(12),
        o = {
          layout: "signin",
          data: function () {
            return {
              valid: !0,
              patientID: "",
              inputRules: [
                function (t) {
                  return !!t || "Patient ID is required";
                }
              ]
            };
          },
          mounted: function () {
            console.log("http://localhost:8000");
          },
          methods: {
            validate: function () {
              var t = this;
              return Object(n.a)(
                regeneratorRuntime.mark(function e() {
                  return regeneratorRuntime.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          t.$refs.form.validate(),
                            t.$router.push({
                              name: "patient-id",
                              params: { id: t.patientID }
                            });
                        case 2:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                })
              )();
            },
            clear: function () {
              this.patientID = "";
            }
          }
        },
        c = r(42),
        l = r(48),
        d = r.n(l),
        f = r(332),
        h = r(146),
        v = r(117),
        m = r(337),
        w = r(581),
        O = r(338),
        _ = r(836),
        component = Object(c.a)(
          o,
          function () {
            var t = this,
              e = t.$createElement,
              r = t._self._c || e;
            return r(
              "div",
              [
                r(
                  "nuxt-link",
                  { attrs: { justify: "right", to: "/reports" } },
                  [
                    r(
                      "v-btn",
                      { staticClass: "mr-4", attrs: { color: "secondary" } },
                      [t._v(" Reports ")]
                    )
                  ],
                  1
                ),
                t._v(" "),
                r(
                  "v-row",
                  { attrs: { justify: "center" } },
                  [
                    r(
                      "v-col",
                      { attrs: { cols: "12", sm: "10", md: "8", lg: "6" } },
                      [
                        r(
                          "v-card",
                          {
                            staticClass: "mx-auto pa-5",
                            attrs: { "max-width": "600" }
                          },
                          [
                            r(
                              "v-card-title",
                              { staticClass: "text-h5 font-weight-bold" },
                              [t._v("Patient ID")]
                            ),
                            t._v(" "),
                            r(
                              "v-form",
                              {
                                ref: "form",
                                attrs: { "lazy-validation": "" },
                                model: {
                                  value: t.valid,
                                  callback: function (e) {
                                    t.valid = e;
                                  },
                                  expression: "valid"
                                }
                              },
                              [
                                r("v-text-field", {
                                  attrs: {
                                    rules: t.inputRules,
                                    required: "",
                                    label: "Please enter Patient ID",
                                    "prepend-icon": "mdi-user",
                                    "full-width": ""
                                  },
                                  model: {
                                    value: t.patientID,
                                    callback: function (e) {
                                      t.patientID = e;
                                    },
                                    expression: "patientID"
                                  }
                                }),
                                t._v(" "),
                                r(
                                  "div",
                                  { staticClass: "pt-3 text-right" },
                                  [
                                    r(
                                      "v-btn",
                                      {
                                        staticClass: "mr-4",
                                        attrs: {
                                          disabled: !t.valid,
                                          color: "primary"
                                        },
                                        on: { click: t.validate }
                                      },
                                      [
                                        t._v(
                                          "\n              Submit\n            "
                                        )
                                      ]
                                    ),
                                    t._v(" "),
                                    r(
                                      "v-btn",
                                      {
                                        staticClass: "mr-4",
                                        attrs: { color: "error" },
                                        on: { click: t.clear }
                                      },
                                      [t._v("Clear ")]
                                    )
                                  ],
                                  1
                                )
                              ],
                              1
                            )
                          ],
                          1
                        )
                      ],
                      1
                    )
                  ],
                  1
                )
              ],
              1
            );
          },
          [],
          !1,
          null,
          null,
          null
        );
      e.default = component.exports;
      d()(component, {
        VBtn: f.a,
        VCard: h.a,
        VCardTitle: v.b,
        VCol: m.a,
        VForm: w.a,
        VRow: O.a,
        VTextField: _.a
      });
    }
  }
]);
