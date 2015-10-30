import Utils from 'Orion/Utils';
import Injector from "Orion/Injector";
import Input from "Orion/Input";

export default class Controller {
    constructor(options, dependencies) {

        this.dependencies = dependencies;
        this.options = Utils.extend(this.options, options);

        this.canvas = Injector.dependencies.canvas;
        this.context = Injector.dependencies.context;

        this.buffered = this.options.buffer || false;
        this.rotate = this.options.rotate || 0;
        this.uuid = this.options.uuid || Utils.generateUUID();
        this.x = this.options.x || 0;
        this.y = this.options.y || 0;
        this.z = this.options.z || 0;

        this.input = new Input;
        this.direction = {};
        this.keysPressed = {};

        this.direction.W = false;
        this.direction.A = false;
        this.direction.S = false;
        this.direction.D = false;
        
        this.mouse = {};
        this.mouse.down = {};
        this.mouse.isDown = false;

        this.init();
    }

    init() {
        document.addEventListener("triggerKeydownEvent", this.move.bind(this));
        document.addEventListener("triggerKeyupEvent", this.stop.bind(this));
        
        document.addEventListener("triggerMousedownEvent", (e) => {
            this.mouse.down.x = e.detail.page.x;
            this.mouse.down.y = e.detail.page.y;
            this.mouse.isDown = true;
            
        });
        
        document.addEventListener("triggerMouseupEvent", (e) => {
            this.mouse.isDown = false;
        });
        
        document.addEventListener("triggerMousemoveEvent", (e) => {
            this.mouse.x = e.detail.page.x;
            this.mouse.y = e.detail.page.y;
        });
    }
    

    move(details) {

        if (details.detail.keyCode === 87 || details.detail.keyCode === 38) {
            this.direction.W = true;
        }

        if (details.detail.keyCode === 83 || details.detail.keyCode === 40) {
            // console.log("Moving Backwards");
            this.direction.S = true;
        }

        if (details.detail.keyCode === 65 || details.detail.keyCode === 37) {
            // console.log("Moving Left");
            this.direction.A = true;
        }

        if (details.detail.keyCode === 68 || details.detail.keyCode === 39) {
            // console.log("Moving Right");
            this.direction.D = true;
        }

    }

    stop(details) {

        if (details.detail.keyCode === 87 || details.detail.keyCode === 38) {
            this.direction.W = false;
        }

        if (details.detail.keyCode === 83 || details.detail.keyCode === 40) {
            // console.log("Moving Backwards");
            this.direction.S = false;
        }

        if (details.detail.keyCode === 65 || details.detail.keyCode === 37) {
            // console.log("Moving Left");
            this.direction.A = false;
        }

        if (details.detail.keyCode === 68 || details.detail.keyCode === 39) {
            // console.log("Moving Right");
            this.direction.D = false;
        }
    }
}
