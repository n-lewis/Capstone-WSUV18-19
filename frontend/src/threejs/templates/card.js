import Sheet from './sheet';

class Card {
  constructor(canvas, imgGroup) {
    this.imgGroup = imgGroup;
    this.canvas = canvas;
    console.log(imgGroup);
    this.width = this.imgGroup[0].width;
    this.height = this.imgGroup[0].height;
    this.depth = this.imgGroup[0].depth;

    this.buildCard();
  }

  buildCard() {
    this.canvas.deleteObjects();
    const card = new Sheet((this.imgGroup[0]) ? this.imgGroup[0].uri : null,
      (this.imgGroup[1]) ? this.imgGroup[1].uri : null,
      this.width, this.height, this.depth);

    this.canvas.scene.add(card.sheet);
    this.canvas.camera.position.z = (1 * Math.max(this.width, this.height));
  }
}

module.exports = Card;
