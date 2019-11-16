import Sheet from './sheet';

class Magazine {
  constructor(canvas, imgGroup) {
    this.imgGroup = imgGroup;
    this.canvas = canvas;

    this.width = this.imgGroup[0].width;
    this.height = this.imgGroup[0].height;
    this.depth = this.imgGroup[0].depth;

    this.blank = new Sheet(null, null, this.width, this.height, this.depth);
    this.pages = [];
    this.buildPages();
    console.log(this.pages[0]);
    this.buildMagazine();
  }

  buildPages() {
    for (let i = 0; i < this.imgGroup.length + 1; i += 2) {
      const page = new Sheet((this.imgGroup[i]) ? this.imgGroup[i].uri : null,
        (this.imgGroup[i + 1]) ? this.imgGroup[i + 1].uri : null,
        this.depth, this.height, this.depth);
      this.pages.push(page);
    }
  }

  buildMagazine() {
    this.canvas.deleteObjects();
    this.canvas.scene.add(this.pages[0].sheet);
    for (let i = 1; i < this.pages; i += 1) {
      this.pages[0].sheet.add(this.pages[i].sheet);
      this.pages[i].sheet.rotation.y = 2.14 - (i * 0.02);
    }

    this.canvas.camera.position.z = (1 * Math.max(this.width, this.height));
    this.canvas.render();
  }

  setPage(leftPageNum) {
    this.canvas.render();
  }
}

module.exports = Magazine;
