class PdfImage {
  constructor(uri, width = 500, height = 500, depth = 0.33) {
    this.uri = uri;
    this.width = width;
    this.height = height;
    this.depth = depth;
  }
}

module.exports = PdfImage;
