import Sheet from './sheet';

class TriFold {
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

    this.buildTriFold();
  }

  buildTriFold() {
    this.canvas.deleteObjects();
    if (this.landscape) {
      this.side0 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width * 0.325,
        this.height, this.depth, [0.325, 1], [[0.675, 0], [0, 0]], [(this.width * 0.1625), 0, 0]);
      this.side1 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width * 0.35,
        this.height, this.depth, [0.35, 1], [[0.325, 0], [0.325, 0]], [0, 0, 0]);
      this.side2 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width * 0.325,
        this.height, this.depth, [0.325, 1], [[0, 0], [0.675, 0]], [-(this.width * 0.1625), 0, 0]);
      this.side0.sheet.position.set((this.width * 0.175), 0, 0);
      this.side2.sheet.position.set(-(this.width * 0.175), 0, 0);
    } else {
      this.side0 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width,
        this.height * 0.325, this.depth, [1, 0.325], [[0, 0.675], [0, 0.675]],
        [0, (this.height * 0.1625), 0]);
      this.side1 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width,
        this.height * 0.35, this.depth, [1, 0.35], [[0, 0.325], [0, 0.325]], [0, 0, 0]);
      this.side2 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null, this.width,
        this.height * 0.325, this.depth, [1, 0.325], [[0, 0], [0, 0]],
        [0, -(this.height * 0.1625), 0]);
      this.side0.sheet.position.set(0, (this.height * 0.175), 0);
      this.side2.sheet.position.set(0, -(this.height * 0.175), 0);
    }
    this.canvas.scene.add(this.side1.sheet);
    this.side1.sheet.add(this.side0.sheet);
    this.side1.sheet.add(this.side2.sheet);

    this.canvas.camera.position.z = (1 * Math.max(this.width, this.height));

    this.canvas.render();
  }

  // Angle can be 0 - 1
  setPercentFold(percent) {
    const angle = 2.92 * percent;
    if (this.landscape) {
      if (angle < 1.555) {
        this.side0.sheet.rotation.y = -2 * angle;
        this.side2.sheet.rotation.y = 0;
      } else {
        this.side0.sheet.rotation.y = -3.11;
        this.side2.sheet.rotation.y = 2 * (angle - 1.555);
      }
    } else if (angle < 1.555) {
      this.side0.sheet.rotation.x = 2 * angle;
      this.side2.sheet.rotation.x = 0;
    } else {
      this.side0.sheet.rotation.x = 3.11;
      this.side2.sheet.rotation.x = -2 * (angle - 1.555);
    }
    this.canvas.render();
  }
}

module.exports = TriFold;
