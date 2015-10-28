import Entity from "Orion/Entity";
import Utils from "Orion/Utils";
import Resources from 'Orion/Resource';
import Shader from 'Orion/Shader';
import Injector from 'Orion/Injector';

class Cube extends Entity {

    init() {
        //variables
        this.mvMatrix = mat4.create();
        this.pMatrix = mat4.create();
        this.vertextPositionBuffer = null;

        //init
        this.gl = Injector.dependencies.gl;
        this.initShaders(this.gl);

        this.shadersReady = false;
    }

    initShaders(gl){

      //creates an instance of the shader class to load shader
      this.shader = new Shader;

        //get shaders from html script tag
        this.shader.load(
          [
            ['js/shaders/frag.glsl', 'frag'],
            ['js/shaders/vert.glsl', 'vert']
          ]
        );

        this.shader.onReady(this.initProgram.bind(this));
    }

    initProgram(){

      let gl = this.gl;

      //create gl program
      this.shaderProgram = gl.createProgram();
      // console.log(this.shader)

      //attach the shaders to the program
      gl.attachShader(this.shaderProgram, this.shader.shaderCache["vert"]);
      gl.attachShader(this.shaderProgram, this.shader.shaderCache["frag"]);
      gl.linkProgram(this.shaderProgram);

      if(!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)){
          throw new Error('Could not initialise shaders');
      }else{
        // is used to enable drawing by the class
        this.shadersReady = true;
      }

      this.initBuffers(gl);
    }

    initBuffers(gl){

        // create buffer for vertices to be stored in
        this.vertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

        //vertices
        let vertices = new Float32Array([
            1.0, 1.0, 0.0, //v0
            -1.0, 1.0, 0.0, //v1
            1.0, -1.0, 0.0, //v2
            -1.0, -1.0, 0.0 //v3?
        ]);

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        //once buffer is setup use program
        gl.useProgram(this.shaderProgram);

        //setup uniforms/attributes
        this.setupUniformsNAttribs(gl);

        // this should be
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = vertices.length/this.vertexPositionBuffer.itemSize;
    }

    setupUniformsNAttribs(gl) {

      //get color uniform
      this.shaderProgram.color = gl.getUniformLocation(this.shaderProgram, 'color');


      //set color r,g,b,a
      gl.uniform4fv(this.shaderProgram.color, [Math.random(), Math.random(), Math.random(), 1.0]);

      this.shaderProgram.position = gl.getAttribLocation(this.shaderProgram, 'position');
      gl.enableVertexAttribArray(this.shaderProgram.position); // <--- ?
      gl.vertexAttribPointer(this.shaderProgram.position, 2, gl.FLOAT, false, 0, 0);
    }

    setMatrixUniforms(gl) {
      gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
      gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }

    update() {

    }

    draw() {
        if(this.shadersReady){
          var gl = this.gl;

          gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

          // reset background to a grey color
          gl.clearColor(0.5, 0.5, 0.5, 1);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


          // mat4.perspective(this.pMatrix, 40, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
          // mat4.identity(this.mvMatrix);

          // sets z to -7
          // mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0, -7.0]);

          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
          gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

          this.setMatrixUniforms(gl);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexPositionBuffer.numItems);
        }
    }
}

export default Cube;
