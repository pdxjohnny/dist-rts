"use strict";

class Options {
  constructor(args) {
    this.id = null;
    this.div = null;
    this.opts = [];
    for (var i in args) {
      this[i] = args[i];
    }
    Object.defineProperty(this, "options", {
      set: function (opts) {
        this.change_options(opts);
        return this.opts;
      },
      get: function () {
        return this.opts;
      }
    });
    this.change_div(args);
  }
  change_div(args) {
    this.id = args.id;
    this.div = document.getElementById(this.id);
  }
  change_options(options) {
    this.opts = options;
    this.update_div();
  }
  update_div() {
    if (this.div != null) {
      this.div.innerHTML = "";
      for (var i = 0; i < this.opts.length; i++) {
        this.div.appendChild(this.opts[i]);
      }
    }
  }
}
