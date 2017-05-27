import entity from '../entity'
import entityManager from '../entityManager'
import * as PIXI from 'pixi.js'
import config from '../config/config'

export default class mapRenderer extends entity {
  constructor(mainScene) {
    super("mapRenderer");
    this.init = false
    this.container = new PIXI.Container();
    this.stripWidth = 4 // no. of pixels in each strip 
    this.viewDist = 50;
    this.numStrips = config.screen.width / this.stripWidth;
  }

  init() {
    this.playerRef = entityManager.findByName('player');
    this.mapRef = entityManager.findByName('miniMapHandler');
    this.init = true;
  }

  update() {
    if (!this.init) {
      this.init();
    }
    this.castRays();
  }

  castRays() {
    let stripIdx = 0;
    for (let i = 0; i < this.numStrips; i++) {
      let rayScreenPos = (-this.numStrips / 2) + i * this.stripWidth;
      let rayViewDist = Math.sqrt(rayScreenPos*rayScreenPos + this.viewDist*this.viewDist);
      let rayAngle = Math.asin(rayScreenPos/rayViewDist);
      this.castSingleRay(this.playerRef.rotation + rayAngle);
    }
  }

  castSingleRay (angle) {

  }

}