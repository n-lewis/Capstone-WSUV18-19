import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';

class Canvas {
  constructor(container) {
    /* -- -- -- CONST VALS FOR INIT -- -- -- */
    this.CAMERA_POS_Z = 500;
    this.ROTATE_SPEED = 4.0;
    this.ZOOM_SPEED = 20.2;
    this.PAN_SPEED = 5.5;
    /* -- -- -- -- -- -- -- -- -- -- -- -- -- */

    this.camera = new THREE.PerspectiveCamera(75,
      container.offsetWidth / container.offsetHeight, 0.1, 10000);
    this.camera.position.z = this.CAMERA_POS_Z;

    this.controls = new TrackballControls(this.camera, container);

    // Values for this.camera speeds
    this.controls.rotateSpeed = this.ROTATE_SPEED;
    this.controls.zoomSpeed = this.ZOOM_SPEED;
    this.controls.panSpeed = this.PAN_SPEED;
    this.controls.maxDistance = 6999;
    this.controls.minDistance = 100;

    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.keys = [65, 83, 68];

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xA4A4A4);

    let light = new THREE.DirectionalLight(0xffffff); // WHITE
    light.position.set(1, 1, 1);
    this.scene.add(light);
    light = new THREE.DirectionalLight(0x002288); // NAVY_BLUE
    light.position.set(-1, -1, -1);
    this.scene.add(light);
    light = new THREE.AmbientLight(0x222222); // DARK_GRAY
    this.scene.add(light);

    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    this.controls.addEventListener('change', () => { this.renderer.render(this.scene, this.camera); });

    container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.camera.aspect = container.offsetWidth / container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
      this.controls.handleResize();
      this.render();
    }, false);

    // Terrible hack. Resize if we click collapse/expand. Note repeated code
    document.getElementById('collapse-expand').addEventListener('click', () => {
      this.camera.aspect = container.offsetWidth / container.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
      this.controls.handleResize();
      this.render();
    }, false);


    this.render();
    this.animate(); // Must be last in the constructor.
  }

  // Animates the canvas
  animate() {
    window.requestAnimationFrame(() => this.animate());
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(() => this.render);
  }

  // function for deleting all objects on canvas
  deleteObjects() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.controls.reset();
  }
}

module.exports = Canvas;
