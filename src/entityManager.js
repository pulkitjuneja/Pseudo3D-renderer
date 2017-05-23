import * as PIXI from "pixi.js";


class entityManager {
  constructor() {
    this._entities = [];
  }

  addEntity(entity) {
    if (!(entity.constructor.name == 'entity')) {
      throw "object is not an entity"
    }
    this._entities.push(entity)
  }

  removeEntity(entity) {
    this._entities.filter((current) => {
      return current.id != entity.id;
    })
  }

  update() {
    this._entities.forEach(entity => entity.update());
  }
}