import Sheet from './sheet';

class GateFold {
  constructor(canvas, imgGroup) {
    this.imgGroup = imgGroup;
    this.canvas = canvas;

    this.width = this.imgGroup[0].width;
    this.height = this.imgGroup[0].height;
    this.depth = this.imgGroup[0].depth;

    if (this.width > this.height) {
      this.landscape = true;
    } else {
      this.landscape = false;
    }

    this.buildGateFold();
  }

  buildGateFold() {
    this.canvas.deleteObjects();
    if (this.landscape) {
      this.side0 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width / 4,
        this.height, this.depth, [0.25, 1], [[0.75, 0], [0, 0]], [(this.width / 8), 0, 0]);
      this.side1 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width / 2,
        this.height, this.depth, [0.5, 1], [[0.25, 0], [0.25, 0]], [0, 0, 0]);
      this.side2 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width / 4,
        this.height, this.depth, [0.25, 1], [[0, 0], [0.75, 0]], [-(this.width / 8), 0, 0]);
      this.side0.sheet.position.set((this.width / 4), 0, 0);
      this.side2.sheet.position.set(-(this.width / 4), 0, 0);
    } else {
      this.side0 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width,
        this.height / 4, this.depth, [1, 0.25], [[0, 0.75], [0, 0.75]], [0, (this.height / 8), 0]);
      this.side1 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width,
        this.height / 2, this.depth, [1, 0.5], [[0, 0.25], [0, 0.25]], [0, 0, 0]);
      this.side2 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width,
        this.height / 4, this.depth, [1, 0.25], [[0, 0], [0, 0]], [0, -(this.height / 8), 0]);
      this.side0.sheet.position.set(0, (this.height / 4), 0);
      this.side2.sheet.position.set(0, -(this.height / 4), 0);
    }

    this.canvas.scene.add(this.side1.sheet);
    this.side1.sheet.add(this.side0.sheet);
    this.side1.sheet.add(this.side2.sheet);

    this.canvas.camera.position.z = (1 * Math.max(this.width, this.height));

    this.canvas.render();
  }

  // Angle can be 0 - 1
  setPercentFold(percent) {
    const angle = 3.1 * percent;
    if (this.landscape) {
      if (angle < 1.55) {
        this.side0.sheet.rotation.y = -2 * angle;
        this.side2.sheet.rotation.y = 0;
      } else {
        this.side0.sheet.rotation.y = -3.1;
        this.side2.sheet.rotation.y = 2 * (angle - 1.55);
      }
    } else if (angle < 1.55) {
      this.side0.sheet.rotation.x = 2 * angle;
      this.side2.sheet.rotation.x = -0;
    } else {
      this.side0.sheet.rotation.x = 3.1;
      this.side2.sheet.rotation.x = -2 * (angle - 1.55);
    }
    this.canvas.render();
  }
}

module.exports = GateFold;
