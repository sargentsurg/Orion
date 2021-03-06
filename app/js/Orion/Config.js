import Utils from './Utils';

class Config {
  constructor() {
    this.version = '0.0.1';
    this.engine = '2d';
    this.controller = false;
    this.images = [];
    this.textures = [];
    this.shaders = [];
    this.models = [];
  }

  set(obj) {
    Utils.extend(this, obj);
  }

  get(prop) {
    return this[prop];
  }
}

// initalized automatically
export default new Config();
