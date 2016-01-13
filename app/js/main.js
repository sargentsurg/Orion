//From Engine
import Config from 'Orion/Config';
import Game from 'Orion/Game';


//current game
import welcomeScene from 'scenes/welcomeScene';

class Main {
    constructor() {

      // Config engine first listing images and shaders
      Config.set({
          engine: "3d",
          controller: true,
          textures: [
            ['base', 'img/baseTexture.png'],
            ['frinlet', 'img/character.png'],
            ['stormtrooper', 'img/stormtrooper.png']
          ],
          shaders: [
            ['frag','js/shaders/frag.glsl'],
            ['vert','js/shaders/vert.glsl'],
            ['frag','js/shaders/atmosphereFrag.glsl'],
            ['vert','js/shaders/atmosphereVert.glsl']
          ],
          models: [
            ['frinlet','js/models/frinlet.json'],
            ['stormtrooper','js/models/stormtrooper.json'],
            ['cube','js/models/cube.json']
          ]
      });

      this.init();
    }

    init() {
        this.game = new Game;
        this.welcomeScene = this.game.addScene(new welcomeScene({sceneName: "Welcome"}));
    }
}

window.Main = new Main;