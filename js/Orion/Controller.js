(function(){
    'use strict';
    /**
     * Controller Class
     *
     * @class
     * @name O.Game.Controller
     * @extends O.Game
     *
     * @constructor
     * @param options config settings of the game class
     * @param dependencies instances of other classes
     *
     * @exports Config as O.Game.Controller
     */
	var Controller = O.Class.extend(O.Game, 'O.Game.Controller', function Controller(options, dependencies) {
		
		this.dependencies = dependencies;
        this.options = O.Utils.extend({}, this.options, options);

        this.canvas = O.Injector.dependencies.canvas;
        this.context =  O.Injector.dependencies.context;
        this.gl = this.context;

        this.input = new O.Game.Controller.Input;
        this.direction = {};

		this.init();
	});

    Controller.prototype.init = function() {
		document.addEventListener("triggerkeydownEvent", this.move.bind(this));
		document.addEventListener("triggerkeyupEvent", this.stop.bind(this));
	}

    Controller.prototype.move = function(details) {

		if(details.detail.keyCode === 87 || details.detail.keyCode === 38){
			O.Logger.log("Moving Forward");
			this.direction.W = true;
		}

		if(details.detail.keyCode === 83 || details.detail.keyCode === 40){
			O.Logger.log("Moving Backwards");
			this.direction.S = true;
		}

		if(details.detail.keyCode === 65 || details.detail.keyCode === 37){
			O.Logger.log("Moving Left");
			this.direction.A = true;
		}

		if(details.detail.keyCode === 68 || details.detail.keyCode === 39){
			O.Logger.log("Moving Right");
			this.direction.D = true;
		}

	}

    Controller.prototype.stop = function(details) {

		if(details.detail.keyCode === 87 || details.detail.keyCode === 38){
			O.Logger.log("Moving Forward");
			this.direction.W = false;
		}

		if(details.detail.keyCode === 83 || details.detail.keyCode === 40){
			O.Logger.log("Moving Backwards");
			this.direction.S = false;
		}

		if(details.detail.keyCode === 65 || details.detail.keyCode === 37){
			O.Logger.log("Moving Left");
			this.direction.A = false;
		}

		if(details.detail.keyCode === 68 || details.detail.keyCode === 39){
			O.Logger.log("Moving Right");
			this.direction.D = false;
		}
	}

})();