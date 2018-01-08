import Config from "./Config";
import Injector from "./Injector";

class Texture {

    constructor() {
        this.textureCache = {};
        this.allTextureCompiled = false;
        this.textureCount = 0;
    }

    load(multipleArrayOfTextures) {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            for (let item of multipleArrayOfTextures) {
                this._load(item[0], item[1]); // go through array pass Name and URL
            }
        });
    }

    _load(name, url) {
        console.log("Texture: Fetching - ", url);

        this.textureCache[name] = {};
        this.textureCache[name].ready = false;
        this.textureCache[name].texture =  Injector.get("gl").createTexture();
        this.textureCache[name].image = new Image();
        this.textureCache[name].image.onload = () => {
            this.handleTextureLoaded(name);
        };
        
        this.textureCache[name].image.src = url;
    }

    handleTextureLoaded(name) {
         Injector.get("gl").bindTexture( Injector.get("gl").TEXTURE_2D, this.textureCache[name].texture);
         Injector.get("gl").texImage2D( Injector.get("gl").TEXTURE_2D, 0,  Injector.get("gl").RGBA,  Injector.get("gl").RGBA,  Injector.get("gl").UNSIGNED_BYTE, this.textureCache[name].image);
         Injector.get("gl").texParameteri( Injector.get("gl").TEXTURE_2D,  Injector.get("gl").TEXTURE_MAG_FILTER,  Injector.get("gl").LINEAR);
         Injector.get("gl").texParameteri( Injector.get("gl").TEXTURE_2D,  Injector.get("gl").TEXTURE_MIN_FILTER,  Injector.get("gl").LINEAR_MIPMAP_NEAREST);
         Injector.get("gl").generateMipmap( Injector.get("gl").TEXTURE_2D);
         Injector.get("gl").bindTexture( Injector.get("gl").TEXTURE_2D, null);

        this.textureCache[name].compiledTexture = this.textureCache[name].texture;
        this.textureCache[name].ready = true;
        this.textureCache[name].id = this.textureCount;
        this.textureCount++;

        // after texture was setup
         Injector.get("gl").bindTexture( Injector.get("gl").TEXTURE_2D, null);
         Injector.get("gl").activeTexture( Injector.get("gl").TEXTURE0 + this.textureCache[name].id);
         Injector.get("gl").bindTexture( Injector.get("gl").TEXTURE_2D, this.textureCache[name].compiledTexture);

        // check if all are completed
        if (this.isReady()) {
            console.log("Texture: All textures compiled");
            this.resolve();
        }
    }

    isReady(){
        this.allTextureCompiled = true;
        for (let prop in this.textureCache) {

            if (this.textureCache.hasOwnProperty(prop)) {

                if (this.textureCache[prop].ready === false) {
                    this.allTextureCompiled = false;
                    break;
                }
            }
        }
        return this.allTextureCompiled;
    }
}



export default new Texture;