"use strict";

class Option {
  constructor(name) {
    var div = document.createElement("div");
    var column_one = document.createElement("div");
    var column_two = new Image();
    var column_three = document.createElement("div");
    div.id = name;
    div.className = "opt big";
    div.appendChild(column_one);
    div.appendChild(column_two);
    div.appendChild(column_three);
    div.title_div = column_one;
    div.image_div = column_two;
    div.text_div = column_three;
    div.title_div.className = "title";
    div.image_div.className = "opt_img";

    for (var i in this) {
      if (typeof this[i] === "function") {
        div[i] = this[i].bind(div);
      } else {
        div[i] = this[i];
      }
    }

    Object.defineProperty(div, "title", {
      set: function (name) {
        this.title_name = name;
        this.title_div.innerHTML = name
        return this.title_div;
      },
      get: function (name) {
        return this.title_name;
      }
    });

    Object.defineProperty(div, "image", {
      set: function (name) {
        this.image_name = name;
        this.image_div.src = name;
        return this.image_div;
      },
      get: function (name) {
        return this.image_name;
      }
    });

    Object.defineProperty(div, "text", {
      set: function (name) {
        this.text_name = name;
        this.text_div.innerHTML = name;
        return this.text_div;
      },
      get: function (name) {
        return this.text_name;
      }
    });

    // Set the name and image
    div.title = name;
    return div;
  }
  update(object) {
    for (var prop in object) {
      this[prop.toLowerCase()] = object[prop];
    }
  }
}
