Player = function(game, canvas) {
    // _this est l'accès à la caméraà l'interieur de Player
    var _this = this;

    // Le jeu, chargé dans l'objet Player
    this.game = game;

    _this.angularSensibility = 200;
    this.speed = 0.8;

    // Si le tir est activee ou non
    this.weaponShoot = false;

    // Axe de mouvement X et Z
    this.axisMovement = [false,false,false,false];

    window.addEventListener("keyup", function(evt) {
        
        switch(evt.key){
            case "w":
            _this.camera.axisMovement[0] = false;
            break;
            case "s":
            _this.camera.axisMovement[1] = false;
            break;
            case "a":
            _this.camera.axisMovement[2] = false;
            break;
            case "d":
            _this.camera.axisMovement[3] = false;
            break;
        }
    }, false);
    
    // Quand les touches sont relachés
    window.addEventListener("keydown", function(evt) {
        switch(evt.key){
            case "w":
            _this.camera.axisMovement[0] = true;
            break;
            case "s":
            _this.camera.axisMovement[1] = true;
            break;
            case "a":
            _this.camera.axisMovement[2] = true;
            break;
            case "d":
            _this.camera.axisMovement[3] = true;
            break;
        }
    }, false);

    window.addEventListener("mousemove", function(evt){
        if(_this.rotEngaged === true){
            _this.camera.playerBox.rotation.y+=evt.movementX * 0.001 * (_this.angularSensibility / 250);
            var nextRotationX = _this.camera.rotation.x + (evt.movementY * 0.001 * (this.angularSensibility / 250));
            if( nextRotationX < degToRad(90) && nextRotationX > degToRad(-90)){
                _this.camera.rotation.x+=evt.movementY * 0.001 * (_this.angularSensibility / 250);
            }
        }
        
    }, false);

    // On récupère le canvas de la scène 
    var canvas = this.game.scene.getEngine().getRenderingCanvas();

    // On affecte le clic et on vérifie qu'il est bien utilisé dans la scène (_this.controlEnabled)
    canvas.addEventListener("mousedown", function(evt) {
        if (_this.controlEnabled && !_this.weponShoot) {
            _this.weponShoot = true;
            _this.handleUserMouseDown();
        }
    }, false);

    // On fait pareil quand l'utilisateur relache le clic de la souris
    canvas.addEventListener("mouseup", function(evt) {
        if (_this.controlEnabled && _this.weponShoot) {
            _this.weponShoot = false;
            _this.handleUserMouseUp();
        }
    }, false);
        
    // Initialisation de la caméra
    this._initCamera(this.game.scene, canvas); 
    
    // Le joueur doit cliquer dans la scene pour que controlEnable soit change
    this.controlEnabled = false;

    // On lance l'event _initPointerLock pour checker le clic dans la scene
    this._initPointerLock();

};



Player.prototype = {
    _initCamera : function(scene, canvas) {
        // // On cree la camera
        // this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(-20, 5, 0), scene);

        // // On affecte le mouvement de la camera au canvas
        // // this.camera.attachControl(canvas, true);

        // // Camera ArcRotate
        // // var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0,0,0), scene);
        // // camera.attachControl(canvas, true);

        // //Axe de mouvement X et Z
        // this.camera.axisMovement = [false,false,false,false];

        // // Si le joueur est en vie ou non
        // this.isAlive = true;

        // // On demande a la camera de regarder au point zero de la scene
        // this.camera.setTarget(BABYLON.Vector3.Zero());

        // // Appel de la creation des armes
        // this.camera.weapons = new Weapons(this);

        var playerBox = BABYLON.Mesh.CreateBox("headMainPlayer", 3, scene);
        playerBox.position = new BABYLON.Vector3(-20, 5, 0);
        playerBox.ellipsoid = new BABYLON.Vector3(2, 2, 2);

        // On crée la caméra
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, 0), scene);
        this.camera.playerBox = playerBox
        this.camera.parent = this.camera.playerBox;

        // Ajout des collisions avec playerBox
        this.camera.playerBox.checkCollisions = true;
        this.camera.playerBox.applyGravity = true;

        // Si le joueur est en vie ou non
        this.isAlive = true;

        // Pour savoir que c'est le joueur principal
        this.camera.isMain = true;

        // On crée les armes !
        this.camera.weapons = new Weapons(this);

        // On ajoute l'axe de mouvement
        this.camera.axisMovement = [false,false,false,false];

        var hitBoxPlayer = BABYLON.Mesh.CreateBox("hitBoxPlayer", 3, scene);
        hitBoxPlayer.parent = this.camera.playerBox;
        hitBoxPlayer.scaling.y = 2;
        hitBoxPlayer.isPickable = true;
        hitBoxPlayer.isMain = true;

    },

    _initPointerLock : function() {
        var _this = this;
        
        // Requete pour la capture du pointeur
        var canvas = this.game.scene.getEngine().getRenderingCanvas();
        canvas.addEventListener("click", function(evt) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);
    
        // Evenement pour changer le paramètre de rotation
        var pointerlockchange = function (event) {
            _this.controlEnabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);
            if (!_this.controlEnabled) {
                _this.rotEngaged = false;
            } else {
                _this.rotEngaged = true;
            }
        };
        
        // Event pour changer l'état du pointeur, sous tout les types de navigateur
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    },

    _checkMove : function(ratioFps) {
        let relativeSpeed = this.speed / ratioFps;
        if(this.camera.axisMovement[0]){
            forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(forward);
        }
        if(this.camera.axisMovement[1]){
            backward = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(backward);
        }
        if(this.camera.axisMovement[2]){
            left = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
                0, 
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(left);
        }
        if(this.camera.axisMovement[3]){
            right = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
                0, 
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(right);
        }
        this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0,(-1.5) * relativeSpeed ,0));
    },

    handleUserMouseDown : function() {
        if(this.isAlive === true){
            this.camera.weapons.fire();
        }
    },
    
    handleUserMouseUp : function() {
        if(this.isAlive === true){
            this.camera.weapons.stopFire();
        }
    },

};
