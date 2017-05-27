import * as PIXI from 'pixi.js'
import entity from '../entity.js'
import map from '../Models/map.js'
import entityManager from '../entityManager'

export default class miniMapHandler extends entity {

  constructor(mainContainer) {
    super("miniMapHandler");
    this.container = new PIXI.Graphics();
    this.map = map.points;
    this.mapWidth = map.points[0].length;
    this.mapHeight = map.points.length;
    this.miniMapScale = 6;
    this.drawMiniMap();
    console.log(this.mapWidth,this.mapHeight);
    this.container.position = new PIXI.Point(800 - this.mapWidth * this.miniMapScale, 600 - this.mapHeight * this.miniMapScale)
    mainContainer.addChild(this.container);
  }

  update() {
    if (this.playerRef == undefined) {
      this.playerRef = entityManager.findByName("player");
    }
    this.container.clear();
    this.drawMiniMap();
    this.drawPlayer();
  }

  // castRays () {
  //   let stripIdx = 0 
  //   for (let i = 0 ; i <numStrips)
  // }

  drawPlayer() {
    this.container.beginFill(0xFFFFFF);
    this.container.drawCircle(this.playerRef.posX, this.playerRef.posY, 2);
    this.container.endFill();
    this.container.moveTo(this.playerRef.posX, this.playerRef.posY);
    this.container.lineStyle(2,0xFFFFFF,1);
    const lineEndX = this.playerRef.posX + Math.cos(this.playerRef.rotation)*10
    const lineEndY = this.playerRef.posY + Math.sin(this.playerRef.rotation)*10
    this.container.lineTo (lineEndX, lineEndY);
  }

  drawMiniMap() {
    this.container.beginFill(0xFF3300);
    this.container.lineStyle(1,0xFFFFFF,1)
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        let wall = this.map[y][x];
        if (wall > 0) {
          this.container.drawRect(x * this.miniMapScale, y * this.miniMapScale, this.miniMapScale, this.miniMapScale)
        }
      }
    }
    this.container.endFill();
  }

}