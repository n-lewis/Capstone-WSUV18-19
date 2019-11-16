import Sheet from './sheet';

class HalfFold {
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

    if (this.landscape) {
      this.trans = [-this.width / 4, 0, 0];
      this.repeat = [0.5, 1];
      this.offset = [[0, 0], [0.5, 0]];

      this.foldLine = this.width / 2;
    } else {
      this.trans = [0, -this.height / 4, 0];
      this.repeat = [1, 0.5];
      this.offset = [[0, 0], [0, 0.5]];

      this.foldLine = this.height / 2;
    }

    this.buildHalfFold();
  }

  buildHalfFold() {
    this.canvas.deleteObjects();
    if (this.landscape) {
      this.side0 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null,
        this.foldLine, this.height, this.depth, this.repeat, this.offset, this.trans);
      this.trans[0] = this.trans[0] * -1;
      this.side1 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null,
        this.foldLine, this.height, this.depth, this.repeat,
        this.offset.slice().reverse(), this.trans);
    } else {
      this.side0 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null,
        this.width, this.foldLine, this.depth, this.repeat, [[0, 0], [0, 0]], this.trans);
      this.trans[1] = this.trans[1] * -1;
      this.side1 = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
        (this.imgGroup[1]) ? this.imgGroup[1].uri : null,
        this.width, this.foldLine, this.depth, this.repeat,
        [[0, 0.5], [0, 0.5]], this.trans);
    }

    this.canvas.scene.add(this.side0.sheet);

    this.side0.sheet.add(this.side1.sheet);
    this.canvas.camera.position.z = (1 * Math.max(this.width, this.height));

    this.canvas.render();
  }

  setPercentFold(percent) {
    if (this.landscape) {
      const angle = 1.55 * percent;
      this.side0.sheet.rotation.y = angle;
      this.side1.sheet.rotation.y = -2 * angle;
      this.canvas.render();
    } else {
      const angle = 1.55 * percent;
      this.side0.sheet.rotation.x = -angle;
      this.side1.sheet.rotation.x = 2 * angle;
      this.canvas.render();
    }
  }

  setLandscape() {
    this.landscape = !this.landscape;
    this.buildHalfFold();
  }
}

module.exports = HalfFold;
