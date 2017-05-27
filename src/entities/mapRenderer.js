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
  }

  castRays() {
    let stripIdx = 0;
    for (let i = 0; i < this.numStrips; i++) {
      let rayScreenPos = -this.numStrips / 2 + i * this.stripWidth;
    }
  }

}