import Entity from "./Entity";
import Injector from "./Injector";
import Models from "./Model";
import Texture from "./Texture";
import Utils from "./Utils";

import * as glMatrix from "gl-matrix";

class WebGLObject extends Entity {
  init(options = {}) {
    //merge it
    this.options = Utils.extend(this.options, options);

    // variables
    this.mvMatrix = glMatrix.mat4.create();
    this.texture = this.options.texture || "base";
    this.model = this.options.model || this.model || "cube";
    this.playable = this.options.playable || false;

    // movement Variable
    this.speed = this.options.speed || 8.05;
    this.color = this.options.color || [1.0, 1.0, 1.0, 1.0];
    this.scale = this.options.scale || { x: 1, y: 1, z: 1 };
    this.theta = 0;

    this.programName = this.options.programName || "baseProgram";

    // Run only after shaders are ready!
    if (!Models.bufferedModels[this.model]) this.initBuffers();
  }

  initBuffers() {
    // add textures
    Injector.get("gl").activeTexture(Injector.get("gl").TEXTURE0 + Texture.textureCache.get(this.texture).id);
    Injector.get("gl").bindTexture(Injector.get("gl").TEXTURE_2D, Texture.textureCache.get(this.texture).compiledTexture);

    // create buffer for vertices to be stored in
    let vertBuffer = Injector.get("gl").createBuffer();
    let uvBuffer = Injector.get("gl").createBuffer();
    let colorBuffer = Injector.get("gl").createBuffer();
    let normalBuffer = Injector.get("gl").createBuffer();
    let indexBuffer = Injector.get("gl").createBuffer();

    let polyCount = Models.modelCache.get(this.model).verts.length / 3;

    if (Models.modelCache.get(this.model).vColor === undefined) {
      Models.modelCache.get(this.model).vColor = Utils.fillArrayWith([1, 1, 1], polyCount);
    }

    if (Models.modelCache.get(this.model).normals === undefined) {
      Models.modelCache.get(this.model).normals = Utils.fillArrayWith([0, 0, 0], polyCount);
    }

    if (Models.modelCache.get(this.model).uv === undefined) {
      Models.modelCache.get(this.model).uv = Utils.fillArrayWith([0, 0, 0], polyCount * (2 / 3));
    }

    // if (Models.modelCache.get(this.model).indices === undefined) {}

    // vertices
    let vertices = new Float32Array(Models.modelCache.get(this.model).verts);
    let uvs = new Float32Array(Models.modelCache.get(this.model).uv);
    let normals = new Float32Array(Models.modelCache.get(this.model).normals);
    let colors = new Float32Array(Models.modelCache.get(this.model).vColor);
    let indices = new Uint16Array(Models.modelCache.get(this.model).indices);

    // bind vert buffers and add vertices to it
    Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, vertBuffer);
    Injector.get("gl").bufferData(Injector.get("gl").ARRAY_BUFFER, vertices, Injector.get("gl").STATIC_DRAW);

    // bind uv buffer
    Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, uvBuffer);
    Injector.get("gl").bufferData(Injector.get("gl").ARRAY_BUFFER, uvs, Injector.get("gl").STATIC_DRAW);

    // bind color buffer
    Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, colorBuffer);
    Injector.get("gl").bufferData(Injector.get("gl").ARRAY_BUFFER, colors, Injector.get("gl").STATIC_DRAW);

    // bind normals buffer
    Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, normalBuffer);
    Injector.get("gl").bufferData(Injector.get("gl").ARRAY_BUFFER, normals, Injector.get("gl").STATIC_DRAW);

    // bind indices buffer
    // Injector.get("gl").bindBuffer(Injector.get("gl").ELEMENT_ARRAY_BUFFER, indexBuffer);
    // Injector.get("gl").bufferData(Injector.get("gl").ELEMENT_ARRAY_BUFFER, indices, Injector.get("gl").STATIC_DRAW);

    // this should be
    vertBuffer.itemSize = 3;
    vertBuffer.numItems = vertices.length / vertBuffer.itemSize;

    Models.bufferedModels.set(this.model, {});
    Models.bufferedModels.get(this.model).numItems = vertBuffer.numItems;
    Models.bufferedModels.get(this.model).verts = vertBuffer;
    Models.bufferedModels.get(this.model).uvs = uvBuffer;
    Models.bufferedModels.get(this.model).vColor = colorBuffer;
    Models.bufferedModels.get(this.model).normals = normalBuffer;
    // Models.bufferedModels.get(this.model).indices = indexBuffer;
  }

  update() {}

  draw() {
    //console.log(Injector.get(this.programName));
    Injector.get(this.programName).use();

    if (this.programName === "baseProgram") {
      Injector.get("gl").uniform4fv(Injector.get(this.programName).shaderProgram.color, this.color);

      if (!Injector.get("game").isVrStarted) {
        glMatrix.mat4.identity(this.mvMatrix);
        glMatrix.mat4.translate(this.mvMatrix, this.mvMatrix, [this.x, 0.0, this.z]);
        glMatrix.mat4.scale(this.mvMatrix, this.mvMatrix, [this.scale.x, this.scale.y, this.scale.z]);
        glMatrix.mat4.rotate(this.mvMatrix, this.mvMatrix, this.rotation.y, [0.0, 1.0, 0.0]);
        glMatrix.mat4.rotate(this.mvMatrix, this.mvMatrix, this.rotation.x, [1.0, 0.0, 0.0]);
        glMatrix.mat4.rotate(this.mvMatrix, this.mvMatrix, this.rotation.z, [0.0, 0.0, 1.0]);

        Injector.get("gl").activeTexture(Injector.get("gl").TEXTURE0 + Texture.textureCache.get(this.texture).id);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).verts);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.position, 3, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).uvs);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.uv, 2, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).vColor);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.vColor, 3, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).normals);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.normals, 3, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").uniformMatrix4fv(Injector.get(this.programName).shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        Injector.get("gl").uniform1i(Injector.get(this.programName).shaderProgram.samplerUniform, Texture.textureCache.get(this.texture).id);
      } else {
        Injector.get("gl").activeTexture(Injector.get("gl").TEXTURE0 + Texture.textureCache.get(this.texture).id);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).verts);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.position, 3, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).uvs);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.uv, 2, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).vColor);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.vColor, 3, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").bindBuffer(Injector.get("gl").ARRAY_BUFFER, Models.bufferedModels.get(this.model).normals);
        Injector.get("gl").vertexAttribPointer(Injector.get(this.programName).shaderProgram.normals, 3, Injector.get("gl").FLOAT, false, 0, 0);

        Injector.get("gl").uniform1i(Injector.get(this.programName).shaderProgram.samplerUniform, Texture.textureCache.get(this.texture).id);

        // left eye
        Injector.get("gl").uniformMatrix4fv(Injector.get(this.programName).shaderProgram.mvMatrixUniform, false, Injector.get("vr").frameData.leftViewMatrix);
        Injector.get("gl").drawArrays(Injector.get("gl").TRIANGLES, 0, Models.bufferedModels.get(this.model).numItems);

        // right eye
        Injector.get("gl").uniformMatrix4fv(Injector.get(this.programName).shaderProgram.mvMatrixUniform, false, Injector.get("vr").frameData.rightViewMatrix);
        Injector.get("gl").drawArrays(Injector.get("gl").TRIANGLES, 0, Models.bufferedModels.get(this.model).numItems);
        // Injector.get("gl").flush();
      }
    }

    // draw to canvas
    // console.log(Models.bufferedModels.get(this.model).numItems);
    // Injector.get("gl").drawArrays(Injector.get("gl").TRIANGLES, 0, Models.bufferedModels.get(this.model).numItems);
    Injector.get("gl").flush();

    // Utils.resizeCanvasToDisplaySize(Injector.get("canvas"));
    // Injector.get("gl").drawElements(Injector.get("gl").TRIANGLES, Models.modelCache.get(this.model).verts.length, Injector.get("gl").UNSIGNED_BYTE, 0);
  }
}

export default WebGLObject;
