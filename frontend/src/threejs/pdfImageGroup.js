import PdfImage from './pdfImage';

class PdfImageGroup {
  constructor(imageGroup, images) {
    this.images = [];
    this.name = imageGroup.name;
    this.nPages = imageGroup.Pages;
    this.created = imageGroup.created;
    if (images.length < 1) {
      return -1;
    }
    for (let i = 0; i < images.length; i += 1) {
      console.log(imageGroup);
      if (imageGroup.metadata && imageGroup.metadata.imageMetadata &&
        imageGroup.metadata.imageMetadata.length > i) {
        console.log('help');
        this.images.push(new PdfImage(images[i].uri, imageGroup.metadata.imageMetadata[i].width,
          imageGroup.metadata.imageMetadata[i].height, 0.35));
      } else {
        this.images.push(new PdfImage(images[i].uri, 255, 330, 0.35));
      }
    }
  }
}

module.exports = PdfImageGroup;
