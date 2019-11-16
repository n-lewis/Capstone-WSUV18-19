import * as THREE from 'three';

class Sheet {
  constructor(imgFront, imgBack, width, height, depth, repeat = null, offset = null, trans = null) {
    this.sheet = null;
    this.imgFront = imgFront;
    this.imgBack = imgBack;
    this.width = width;
    this.height = height;
    this.depth = depth;

    // Optionals
    // [x,y] should contain a 1 in most circumstances range 0 - 1
    this.repeat = repeat;
    // [[x,y],[j,k]] first set if for front, second set is for the back range 0 - 1
    this.offset = offset;
    // [x,y,z] most cases x will be translated half the width negative or positive
    this.trans = trans;

    const sheetGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);

    let textureBack = null;
    let textureFront = null;

    // Optionals are passed in: Used for folded sheets
    if (this.trans) {
      sheetGeometry.translate(this.trans[0], this.trans[1], this.trans[2]);
      if (imgFront === null) {
        textureFront = { color: 'white' };
      } else {
        textureFront = { map: new THREE.TextureLoader().load(this.imgFront, (t) => {
          const texture = t;
          texture.wrapS = texture.wrapT;
          texture.wrapS = THREE.RepeatWrapping;
          texture.repeat.set(this.repeat[0], this.repeat[1]);
          texture.rotation = 0;
          texture.offset.set(this.offset[0][0], this.offset[0][1]);
        }) };
      }

      if (imgBack === null) {
        textureBack = { color: 'white' };
      } else {
        textureBack = { map: new THREE.TextureLoader().load(this.imgBack, (t) => {
          const texture = t;
          texture.wrapS = texture.wrapT;
          texture.wrapS = THREE.RepeatWrapping;
          texture.repeat.set(this.repeat[0], this.repeat[1]);
          texture.rotation = 0;
          texture.offset.set(this.offset[1][0], this.offset[1][1]);
        }) };
      }
      // No optionals
    } else {
      if (imgFront === null) {
        textureFront = { color: 'white' };
      } else {
        textureFront = { map: new THREE.TextureLoader().load(this.imgFront) };
      }

      if (imgBack === null) {
        textureBack = { color: 'white' };
      } else {
        textureBack = { map: new THREE.TextureLoader().load(this.imgBack) };
      }
    }

    const sheetMaterials = [
      new THREE.MeshBasicMaterial({ color: 'white' }),
      new THREE.MeshBasicMaterial({ color: 'white' }),
      new THREE.MeshBasicMaterial({ color: 'white' }),
      new THREE.MeshBasicMaterial({ color: 'white' }),
      new THREE.MeshBasicMaterial(textureFront),
      new THREE.MeshBasicMaterial(textureBack),
    ];
    this.sheet = new THREE.Mesh(sheetGeometry, sheetMaterials);
  }
}

module.exports = Sheet;
