document.addEventListener("DOMContentLoaded", function() {
    new Game('renderCanvas');
}, false);

Game = function(canvasID) {
    // Canvas et engine defini ici
    var canvas = document.getElementById(canvasID);
    var engine = new BABYLON.Engine(canvas, true);
    this.engine = engine;
    var _this = this;
    _this.actualTime = Date.now();

    // On initie la scene avec une fonciton associe a l'pbjet Game
    this.scene = this._initScene(engine);

    // Creer joueur
    var _player = new Player(_this, canvas);

    // Creer arena
    var _arena = new Arena(_this);

    // Permet au jeu de tourner
    engine.runRenderLoop(function () {
        // recuperer le ratio par les fps
        _this.fps = Math.round(1000/engine.getDeltaTime());

        // Checker le mouvement du joueur en lui envoyant le ration de deplacement
        _player._checkMove((_this.fps)/60);

        _this.scene.render();

        // Si launchBullets est a true, on tire
        if(_player.camera.weapons.launchBullets === true){
            _player.camera.weapons.launchFire();
    }
    });

    // Ajuste la vue 3D si la fenetre est agrandi ou diminue
    window.addEventListener("resize", function() {
        if (engine) {
            engine.resize();
        }
    }, false);
};

Game.prototype = {
    // Prototype d'initialisation de la scene
    _initScene : function(engine) {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.9, 0.9, 0.9);
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        scene.collisionEnabled = true;
        return scene;
    }
};

function degToRad(deg) {
    return (Math.PI * deg) / 180
}

function radToDeg(rad) {
    return (rad * 180) / Math.PI
}

