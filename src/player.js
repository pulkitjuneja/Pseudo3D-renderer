import * as PIXI from 'pixi.js'
import entity from './entity'



export default class player extends entity {

  constructor(mainScene) {
    super("player");
    this.posX = 0;
    this.posY = 0;
    this.rotation = 0;
    this.speed = 0;
    this.movSpeed = 1;
    this.direction = 0;
    this.rotationSpeed = 6 * Math.PI / 180
    this.sprite = PIXI.Sprite.fromImage('images/ghost.png');
    this.sprite.anchor = new PIXI.Point(0.5, 0.5);
    this.bindKeys();
    mainScene.addChild(this.sprite);
  }

  update() {
    this.move();
    this.updateSprite();
  }

  updateSprite() {
    this.sprite.position = new PIXI.Point(this.posX, this.posY);
    this.sprite.rotation = this.rotation;
  }

  move() {
    const moveStep = this.speed * this.movSpeed;
    this.rotation += this.direction * this.rotationSpeed;

    this.posX = this.posX + Math.cos(this.rotation) * moveStep;
    this.posY = this.posY + Math.sin(this.rotation) * moveStep;
  }

  bindKeys() {
    const onKeyDown = (e) => {
      console.log("keydown");
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