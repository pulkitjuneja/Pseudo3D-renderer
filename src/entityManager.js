import entity from './entity.js'

class entityManager {
  constructor() {
    this._entities = [];
  }

  addEntity(ent) {
    // console.log(ent.__proto)
    // if (!(ent.prototype instanceof entity)) {
    //   throw "object is not an entity"
    // }
    this._entities.push(ent)
  }

  removeEntity(entity) {
    this._entities.filter((current) => {
      return current.id != entity.id;
    })
  }

  findByName(name) {
    
    const result = this._entities.find((ent) => {
      return ent.name === name;
    })
    return result;
  }

  update() {
    this._entities.forEach(entity => entity.update());
  }
}

export default new entityManager();