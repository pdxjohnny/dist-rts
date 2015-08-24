"use strict";

class make_extra {
  constructor() {
  }
  get_mouse_pos(event) {
    var x;
    var y;
    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
      y = event.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    return {
      x: x,
      y: y
    };
  }
  on_cords(cords, object) {
    if (typeof cords.x !== "undefined" && typeof cords.y !== "undefined" &&
      typeof object.x !== "undefined" && typeof object.y !== "undefined" &&
      typeof object.image !== "undefined" && object.image != false) {
      if (cords.x >= (object.x - object.image.width / 2) &&
        cords.x <= (object.x + object.image.width / 2) &&
        cords.y >= (object.y - object.image.height / 2) &&
        cords.y <= (object.y + object.image.height / 2)) {
        return true;
      }
    }
    return false;
  }
  in_cords(start, end, object) {
    if (typeof start.x !== "undefined" && typeof start.y !== "undefined" &&
      typeof end.x !== "undefined" && typeof end.y !== "undefined" &&
      typeof object.x !== "undefined" && typeof object.y !== "undefined" &&
      typeof object.image !== "undefined" && object.image != false) {
      if (end.x < start.x && end.y < start.y) {
        return this.in_cords(end, start, object);
      } else if (end.x > start.x && end.y < start.y) {
        var temp = start.x;
        start.x = end.x;
        end.x = temp;
        return this.in_cords(start, end, object);
      } else if (end.x < start.x && end.y > start.y) {
        var temp = start.y;
        start.y = end.y;
        end.y = temp;
        return this.in_cords(start, end, object);
      } else if ((start.x <= (object.x - object.image.width / 2) &&
          start.y <= (object.y - object.image.height / 2) &&
          end.x >= (object.x + object.image.width / 2) &&
          end.y >= (object.y + object.image.height / 2)) ||
        (start.x <= object.x &&
          start.y <= object.y &&
          end.x >= object.x &&
          end.y >= object.y)) {
        return true;
      }
    }
    return false;
  }
  clone(obj) {
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
  }
}

var extra = new make_extra();
