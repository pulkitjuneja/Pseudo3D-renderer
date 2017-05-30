import * as PIXI from "pixi.js";
import entityManager from "./entityManager"
import miniMapHandler from './entities/mapHandler.js'
import player from './entities/player'
import mapRenderer from './entities/maprenderer'
import config from './config/config'

class gameEngine {

  initRenderer() {
    const renderer = PIXI.autoDetectRenderer(config.screen.width, config.screen.height, {
      antialias: false,
      transparent: false,
      resolution: 1
    });
    renderer.view.className = "renderArea";
    document.getElementById("main").appendChild(renderer.view);
    return renderer;
  }

  start() {
    this.renderer = this.initRenderer();
    this.mainScene = new PIXI.Container();
    entityManager.addEntity(new player(this.mainScene));
    entityManager.addEntity(new miniMapHandler(this.mainScene));
    entityManager.addEntity(new mapRenderer(this.mainScene));
    this.gameLoop(-1)
  }

  gameLoop() {
    requestAnimationFrame(this.gameLoop.bind(this));
    entityManager.update();
    this.renderer.render(this.mainScene)
  }

}

export default gameEngine;