function singleSelect(evt) {
  var mouseAt = getMousePos(evt);
  var none = true;
  for (var i in meL.units) {
    if (onCords(mouseAt, meL.units[i])) {
      if (meL.units[i].selected) {
        meL.units[i].selected = false;
        meL.units[i].des = {};
        if (typeof meL.units[i].ship.options !== "undefined")
          meL.units[i].ship.options();
      } else if (none) {
        meL.units[i].selected = true;
        if (typeof meL.units[i].ship.options !== "undefined")
          meL.units[i].ship.options();
        none = false;
      }
    }
  }
  if (none) {
    var atLeastOne = false;
    for (var i in meL.units) {
      if (meL.units[i].selected) atLeastOne = true;
    }
    if (atLeastOne) {
      meL.des = mouseAt;
      for (var i in meL.units) {
        if (meL.units[i].selected &&
          typeof meL.des.x !== "undefined" &&
          typeof meL.des.y !== "undefined") {
          meL.units[i].des = {};
          meL.units[i].des.x = meL.des.x;
          meL.units[i].des.y = meL.des.y;
          delete meL.units[i].path;
        }
      }
    } else meL.des = {};
  }
  displaySelected();
}

function selectStructure(evt) {
  var mouseAt = getMousePos(evt);
  var none = true;
  for (var i in game.structuresL) {
    if (onCords(mouseAt, game.structuresL[i])) {
      if (game.structuresL[i].selected) {
        game.structuresL[i].selected = false;
        $('#bottomLeft').html("");
      } else if (none) {
        game.structuresL[i].selected = true;
        game.structuresL[i].ship.options();
        none = false;
      }
    }
  }
  if (none) {
    for (var i in game.structuresL) {
      game.structuresL[i].selected = false;
    }
    //for ( var i in meL.units ){
    //meL.units[i].selected = false;
    //	}
  }
  displaySelected();
}

function unselectAll() {
  for (var i in meL.units) {
    meL.units[i].selected = false;
  }
  for (var i in game.structuresL) {
    game.structuresL[i].selected = false;
  }
  meL.des = {};
  $('#bottomLeft').html("");
  displaySelected();
}

function multiSelect(e) {
  meL.selectBoxStart = getMousePos(e);
  $(canvas).mousemove(function (e) {
    meL.selectBoxEnd = getMousePos(e);
  });
  $(canvas).mouseup(function (e) {
    for (var i in meL.units) {
      if (inCords(meL.selectBoxStart, meL.selectBoxEnd, meL.units[i])) {
        if (meL.units[i].selected) {
          meL.units[i].des = {};
        } else {
          meL.units[i].selected = true;
          delete meL.units[i].path;
        }
      }
    }
    displaySelected();
    meL.selectBoxStart = false;
    meL.selectBoxEnd = false;
    return false;
  });
}

$(canvas).mousedown(function (e) {
  switch (e.which) {
  case 1:
    $('#bottomLeft').html("");
    singleSelect(e);
    multiSelect(e);
    selectStructure(e);
    break;
  case 2:
    console.log('Middle Mouse button pressed.');
    break;
  case 3:
    unselectAll();
    break;
  default:
    console.log('You have a strange Mouse!');
  }
});
