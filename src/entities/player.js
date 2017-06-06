import * as PIXI from 'pixi.js'
import entity from '../entity'
import entityManager from '../entityManager'


export default class player extends entity {

  constructor(mainScene) {
    super("player");
    this.posX = 15;
    this.posY = 10;
    this.rotation = 0;
    this.speed = 0;
    this.movSpeed = 0.18;
    this.direction = 0;
    this.rotationSpeed = 3 * Math.PI / 180
    //this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache["images/ghost.png"]);
    //this.sprite.anchor = new PIXI.Point(0.5, 0.5);
    this.bindKeys();
    //mainScene.addChild(this.sprite);
  }

  update() {
    if (this.mapRef == undefined)
      this.mapRef = entityManager.findByName("miniMapHandler");
    this.move();
    //this.updateSprite();
  }

  updateSprite() {
    this.sprite.position = new PIXI.Point(this.posX, this.posY);
    this.sprite.rotation = this.rotation;
  }

  move() {
    const moveStep = this.speed * this.movSpeed;
    this.rotation += this.direction * this.rotationSpeed;

    let newX = this.posX + Math.cos(this.rotation) * moveStep;
    let newY = this.posY + Math.sin(this.rotation) * moveStep;

    if (!this.isBlocking(newX, newY)) {
      this.posX = newX;
      this.posY = newY;
    }
  }

  isBlocking(newX, newY) {
    const arrPosX = Math.floor(newX)
    const arrPosY = Math.floor(newY)

    if (arrPosY < 0 || arrPosY >= this.mapRef.mapHeight || arrPosX < 0 || arrPosX >= this.mapRef.mapWidth)
      return true;
    return (this.mapRef.map[arrPosY][arrPosX] != 0);
  }

  bindKeys() {
    const onKeyDown = (e) => {
      e = e || window.event;
      switch (e.keyCode) {
        case 38:
          this.speed = 1; break;
        case 40:
          this.speed = -1; break;
        case 37:
          this.direction = -1; break;
        case 39:
          this.direction = 1; break;
      }
    };
    const onKeyUp = (e) => {
      e = e || window.event
      switch (e.keyCode) {
        case 38:
        case 40:
          this.speed = 0; break;
        case 37:
        case 39:
          this.direction = 0; break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  }

}