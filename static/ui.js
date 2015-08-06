ui = {};
ui.grid = function (box_width, box_height, end_column) {
  var margin = (game.canvas.height % box_height) / 2;
  this.grid = [];
  var column = 0;
  if (typeof end_column !== "undefined")
    var end_at_width = end_column * (box_width - 1);
  else
    var end_at_width = game.canvas.width - box_width;
  for (var x = 0; x <= end_at_width; x += box_width) {
    var row = 0;
    for (var y = margin; y <= game.canvas.height - margin - box_height; y += box_height) {
      var box = {
        top: {
          x: x,
          y: y
        },
        bottom: {
          x: x + box_width,
          y: y + box_height
        },
        row: row,
        column: column
      };
      this.grid.push(box);
      row++;
    }
    column++;
  }
  this.last_row = row;
  this.last_column = column;
  return this;
}

ui.grid.prototype.get_box = function (row, column) {
  for (var box in this.grid) {
    if (this.grid[box].row == row &&
      this.grid[box].column == column)
      return this.grid[box];
  }
};
