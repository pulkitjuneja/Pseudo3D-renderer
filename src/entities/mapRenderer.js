import entity from '../entity'
import entityManager from '../entityManager'
import * as PIXI from 'pixi.js'
import config from '../config/config'



export default class mapRenderer extends entity {
  constructor(mainScene) {
    super("mapRenderer");
    this.init = false
    this.container = new PIXI.Container();
    this.stripWidth = 1 // no. of pixels in each strip 
    this.viewDist = 50;
    this.numStrips = config.screen.width / this.stripWidth;
  }

  initFunc() {
    this.playerRef = entityManager.findByName('player');
    this.mapRef = entityManager.findByName('miniMapHandler');
    this.init = true;
  }

  update() {
    if (!this.init) {
      this.initFunc();
    }
    this.castRays();
  }

  castRays() {
    let stripIdx = 0;
     for (let i = 0; i < this.numStrips; i++) {
      let rayScreenPos = (-this.numStrips / 2 + i) * this.stripWidth;
      let rayViewDist = Math.sqrt(rayScreenPos * rayScreenPos + this.viewDist * this.viewDist);
      let rayAngle = Math.asin(rayScreenPos / rayViewDist);
      this.castSingleRay(this.playerRef.rotation + rayAngle);
    }
  }

  castSingleRay(rayAngle) {
    let twoPI = 6.28;

    rayAngle %= twoPI;
    if (rayAngle < 0) rayAngle += twoPI;

    let right = (rayAngle > twoPI * 0.75 || rayAngle < twoPI * 0.25);
    let up = (rayAngle < 0 || rayAngle > Math.PI);
    let angleSin = Math.sin(rayAngle);
    let angleCos = Math.cos(rayAngle);
    let slope = angleSin / angleCos;
    let dX = right ? 1 : -1;
    let dY = dX * slope;

    let x = right ? Math.ceil(this.playerRef.posX) : Math.floor(this.playerRef.posX);
    let y = this.playerRef.posY + (x - this.playerRef.posX) * slope;

    while (x / this.mapRef.miniMapScale >= 0 && x / this.mapRef.miniMapScale < this.mapRef.mapWidth && y / this.mapRef.miniMapScale >= 0 && y / this.mapRef.miniMapScale < this.mapRef.mapHeight) {
      let wallX = Math.floor(x / this.mapRef.miniMapScale);
      let wallY = Math.floor(y / this.mapRef.miniMapScale);
      if (this.mapRef.map[wallY][wallX] > 0) {
        let distX = x - this.playerRef.posX;
        let distY = y - this.playerRef.posY;

        let dist = distX * distX + distY * distY;

        this.mapRef.drawRay(x, y);
        break;
      }

      x += dX;
      y += dY;
    }

  }

}