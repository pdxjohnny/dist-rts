CanvasRenderingContext2D.prototype.drawRotatedImage = function (image, x, y, angle) {
  // save the current co-ordinate system
  // before we screw with it
  this.save();

  // move to the middle of where we want to draw our image
  this.translate(x, y);

  // rotate around that point, converting our
  // angle from degrees to radians
  this.rotate(angle * (Math.PI / 180));

  // draw it up and to the left by half the width
  // and height of the image
  this.drawImage(image, -(image.width / 2), -(image.height / 2));

  // and restore the co-ords to how they were when we began
  this.restore();
}

CanvasRenderingContext2D.prototype.drawRotatedRect = function (x1, y1, x2, y2, angle) {
  // save the current co-ordinate system
  // before we screw with it
  this.save();

  // Find the middle
  var x = x1 + (x2 / 2);
  var y = y1 + (y2 / 2);

  // Add 180 to the angle because i dont know
  angle += 180;

  // move to the middle of where we want to draw our image
  this.translate(x, y);

  // rotate around that point, converting our
  // angle from degrees to radians
  this.rotate(angle * (Math.PI / 180));

  // Draw the rectange
  this.beginPath();
  this.rect(0, 0, x2, y2);
  this.stroke();

  // and restore the co-ords to how they were when we began
  this.restore();
}

CanvasRenderingContext2D.prototype.clear = function (canvas_div) {
  this.clearRect(0, 0, canvas_div.width, canvas_div.height);
}
