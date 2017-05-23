import * as PIXI from 'pixi.js'
import entity from './entity.js'
import map from './Models/map.js'

export default class mapHandler extends entity {

  constructor(mainContainer) {
    super("mapHandler");
    this.container = new PIXI.Graphics();
    this.map = map.points;
    this.mapWidth = map.points[0].length;
    this.mapHeight = map.points.length;
    this.miniMapScale = 4;
    this.drawMiniMap();
    this.container.position = new PIXI.Point(800 - this.mapWidth * this.miniMapScale, 600 - this.mapHeight * this.miniMapScale)
    mainContainer.addChild(this.container);
  }

  update() {
    this.container.clear();
    this.drawMiniMap();
  }

  drawMiniMap() {
    this.container.lineStyle(4, 0xFF3300, 1);

    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        let wall = this.map[y][x];
        if (wall > 0) {
          this.container.beginFill(0x66CCFF);
          this.container.drawRect(x * this.miniMapScale, y * this.miniMapScale, this.miniMapScale, this.miniMapScale)
        }
      }
    }
    this.container.endFill();
  }

}