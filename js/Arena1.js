Arena = function(game) {
    // Appel des variables necessaires
    this.game = game;
    var scene = game.scene;

    // Creation de notre lumiere principale
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 20, 0), scene);
    light.diffuse = new BABYLON.Color3(1,1,1);
    light.specular = new BABYLON.Color3(1,1,1);

    // Lumiere directionnelle
    // var light1 = new BABYLON.DirectionalLight("Dir1", new BABYLON.Vector3(0, -1, 0), scene);
    // light1.diffuse = new BABYLON.Color3(1,1,1);
    // light1.specular = new BABYLON.Color3(1,1,1);

    // Lumiere ponctuelle
    // var light1 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(1, 10, 1), scene);
    // light1.diffuse = new BABYLON.Color3(1, 1, 1);
    // light1.specular = new BABYLON.Color3(1, 1, 1);

    // Spot light
    // var light1 = new BABYLON.SpotLight("Spot1", new BABYLON.Vector3(0,30,-10), new BABYLON.Vector3(0,-1,0), 0.8, 2, scene);
    // light1.diffuse = new BABYLON.Color3(1,1,1);
    // light1.specular = new BABYLON.Color3(1,1,1);

    // // Creons une sphere
    // var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // // Remontons le sur l'axe y de la moitie de sa hauteur
    // sphere.position.y = 1;

    // Material pour le sol
    var materialGround = new BABYLON.StandardMaterial("wallTexture", scene);
    materialGround.diffuseTexture = new BABYLON.Texture("http://img15.hostingpics.net/pics/176585veryolddrywoodplanks201309301225005850.jpg", scene);
    materialGround.diffuseTexture.uScale = 4.0;
    materialGround.diffuseTexture.vScale = 4.0;

    // Material pour les objet
    var materialWall = new BABYLON.StandardMaterial("groundTexture", scene);
    materialWall.diffuseTexture = new BABYLON.Texture("http://texturelib.com/Textures/brick/medieval/brick_medieval_0068_01_preview.jpg", scene);

    // Ajoutons un sol pour situer la sphere dans l'espace
    var ground = BABYLON.Mesh.CreateGround("ground1", 20, 20, 2, scene);
    ground.scaling = new BABYLON.Vector3(2, 10, 3);
    ground.scaling.z = 2;
    ground.material = materialGround;

    // Notre premier cube qui va servir de modele
    var mainBox = BABYLON.Mesh.CreateBox("box1", 3, scene);
    mainBox.scaling.y = 1;
    mainBox.position = new BABYLON.Vector3(5, ((3/2) * mainBox.scaling.y), 5);
    mainBox.rotation.y = (Math.PI * 45) / 180;
    mainBox.material = materialWall;

    // Les trois clones
    var mainBox2 = mainBox.clone("box2");
    mainBox2.scaling.y = 2;
    mainBox2.position = new BABYLON.Vector3(5, ((3/2) * mainBox2.scaling.y), -5);

    var mainBox3 = mainBox.clone("box3");
    mainBox3.scaling.y = 3;
    mainBox3.position = new BABYLON.Vector3(-5, ((3/2) * mainBox3.scaling.y), -5);

    var mainBox4 = mainBox.clone("box4");
    mainBox4.scaling.y = 4;
    mainBox4.position = new BABYLON.Vector3(-5, ((3/2) * mainBox4.scaling.y), 5);


    // Cylindre -> 20 de hauteur, 5 de diametre en haut et en bas, 20 de tesselation et 4 de subdivision
    var cylindre = BABYLON.Mesh.CreateCylinder("cyl1", 20, 5, 5, 20, 4, scene);
    cylindre.position.y = 20/2;
    cylindre.material = materialWall;

};

