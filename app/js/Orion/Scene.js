import Utils from 'Orion/Utils';

class Scene {
    constructor(options, dependencies){
        this.dependencies = dependencies;
        this.options = Utils.extend(this.options, options);

        this.buffered = this.options.buffer || false;
        this.uuid = this.options.uuid ||  Utils.generateUUID();

        this.entityList = [];

        this.init();
    }

    init(){

    }

    addEntity(entity) {
        console.log("Add Entity - "+ entity);
        this.entityList.push(entity);
        return entity;
    }

    update(){
        if( this.entityList.length > 0){
            this.entityList.forEach(function(item, i){
                item.update();
            });
        }
    }

    draw(){
        if( this.entityList.length > 0){
            this.entityList.forEach(function(item, i){
                item.draw();
            });
        }
    }
}

export default Scene;