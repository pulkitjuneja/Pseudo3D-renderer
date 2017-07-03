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
    this.viewDist = 700;
    this.strips = [];
    this.numStrips = config.screen.width / this.stripWidth;
    mainScene.addChild(this.container);
    this.initImageStrips();
  }

  initImageStrips() {
    //let stripTex = PIXI.utils.TextureCache["images/walls.png"]
    let initialFrame = new PIXI.Rectangle(0, 0, 4, 4);
    for (let i = 0; i < this.numStrips; i++) {
      let stripTex = new PIXI.Texture(PIXI.BaseTexture.fromImage('images/walls.png'), initialFrame);
      this.strips[i] = new PIXI.Sprite(stripTex);
      this.strips[i].width = 4;
      this.strips[i].height = 0;
      this.strips[i].x = i * this.stripWidth;
      this.strips[i].y = 0;
      this.container.addChild(this.strips[i]);
    }
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
      this.castSingleRay(this.playerRef.rotation + rayAngle, i);
    }
  }

  castSingleRay(rayAngle, stripIndex) {
    let twoPI = Math.PI * 2;

    rayAngle %= twoPI;
    if (rayAngle < 0) rayAngle += twoPI;

    let dist = 0;
    let xhit = 0, yhit = 0;
    let wallType = 0;
    let textureX;

    let right = (rayAngle > twoPI * 0.75 || rayAngle < twoPI * 0.25);
    let up = (rayAngle < 0 || rayAngle > Math.PI);

    let angleSin = Math.sin(rayAngle);
    let angleCos = Math.cos(rayAngle);

    let slope = angleSin / angleCos;
    let dX = right ? 1 : -1;
    let dY = dX * slope;

    let x = right ? Math.ceil(this.playerRef.posX) : Math.floor(this.playerRef.posX);
    let y = this.playerRef.posY + (x - this.playerRef.posX) * slope;

    while (x >= 0 && x < this.mapRef.mapWidth && y >= 0 && y < this.mapRef.mapHeight) {
      let wallX = Math.floor(x + (right ? 0 : -1));
      let wallY = Math.floor(y);
      if (this.mapRef.map[wallY][wallX] > 0) {
        let distX = x - this.playerRef.posX;
        let distY = y - this.playerRef.posY;
        wallType = this.mapRef.map[wallY][wallX];
        dist = distX * distX + distY * distY;
        xhit = x; yhit = y;
        textureX = y % 1;
        if (!right) textureX = 1 - textureX;
        break;
      }
      x += dX;
      y += dY;
    }

    slope = angleCos / angleSin
    dY = up ? -1 : 1;
    dX = dY * slope;
    y = up ? Math.floor(this.playerRef.posY) : Math.ceil(this.playerRef.posY);
    x = this.playerRef.posX + (y - this.playerRef.posY) * slope;

    while (x >= 0 && x < this.mapRef.mapWidth && y >= 0 && y < this.mapRef.mapHeight) {
      let wallX = Math.floor(x);
      let wallY = Math.floor(y + (up ? -1 : 0));
      if (this.mapRef.map[wallY][wallX] > 0) {
        let distX = x - this.playerRef.posX;
        let distY = y - this.playerRef.posY;
        let blockdist = distX * distX + distY * distY;
        if (dist == 0 || blockdist < dist) {
          dist = blockdist;
          wallType = this.mapRef.map[wallY][wallX];
          xhit = x; yhit = y;
          textureX = x % 1;
          if (up) textureX = 1 - textureX;
        }
        break;
      }

      x += dX;
      y += dY;
    }


    if (dist != 0) {
      this.mapRef.drawRay(xhit, yhit);
      dist = Math.sqrt(dist);
      dist = dist * Math.cos(this.playerRef.rotation - rayAngle);
      let stripHeight = Math.round(this.viewDist / dist);
      this.strips[stripIndex].height = stripHeight;
      var mult = 1
      // if (stripIndex % 15)
      //   mult *= -1
      this.strips[stripIndex].y = (config.screen.height - stripHeight) / 2 ; 
      this.strips[stripIndex].texture.frame = new PIXI.Rectangle(textureX*64, (wallType-1)*64, this.stripWidth, 64);
    }
  }
}
