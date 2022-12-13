// Required by Webpack - do not touch
import * as dat from "dat.gui";

require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Sophia Heaton"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`


import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export function outside(){
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene();
    let renderer = new THREE.WebGLRenderer({canvas});
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0xEEEEEE);
    let axes = new THREE.AxesHelper(10);

    scene.add(axes);

    let cameraControls = new OrbitControls(camera, renderer.domElement);
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera);
    })



    //Controls the Lighting based on time of day
    let controls = {
        MidDay: true
    }
    let gui = new dat.GUI();
    document.querySelector('aside').appendChild(gui.domElement);
    gui.add(controls, 'MidDay').onChange(mid_day);

    let spotLight = new THREE.SpotLight(0xf5f7e4);
    spotLight.position.set(100, 200, 0);
    let ambientLight = new THREE.AmbientLight(0xf9fcdc);


    scene.add(spotLight);
    scene.add(ambientLight);

    let spotLight2 = new THREE.SpotLight(0x3b98a8);
    spotLight2.position.set(100, 201, 0);
    let ambientLight2 = new THREE.AmbientLight(0x318a99);
    scene.add(spotLight2);
    scene.add(ambientLight2);

    mid_day();
    function mid_day () {
        if (controls.MidDay) {
            spotLight.intensity = 1;
            ambientLight.intensity = 1;
            spotLight2.intensity = 0;
            ambientLight2.intensity = 0;
        }
        else {
            spotLight.intensity = 0;
            ambientLight.intensity = 0;
            spotLight2.intensity = .7;
            ambientLight2.intensity = .5;
        }
    }

    //Populate the scene
    function objects() {
        outsidewalls(20.1, 10, 1, scene, true); //Outside Wall Right
        outsidewalls(-100, 10, 1, scene); //Outside Wall Left
        outsidewalls1(10, 10, 0.3, scene); //Outside Wall Back
        outsidewalls1(9.9, 10, 100.2, scene); //Outside Wall Front
        pillars(0, 10, 0, scene); //Outside Pillars
        floor(10, 0.1, 9.78, scene); //Floor
        ceiling(10, 19.9, 9.78, scene); //Ceiling
        //Outside Windows
        let movement = 0;
        for (let i = 0; i <= 5; i++) {
            outsidewindow(10 + movement, 10, -0.22, scene);
            outsidewindow(10 + movement, 10, 99.78, scene, true);
            movement += 20;
        }
        //Additional Windows
        outsidewindow1(-0.22, 10, 30, scene);
        outsidewindow1(-0.22, 10, 70, scene);
    }
    objects();
    camera.position.set(200, 50, 150);

    function animate()
    {
        renderer.render(scene, camera)
        //To make sure camera doesn't go into the structure
        if (camera.position.y <= 20 && camera.position.y > 0) {
            camera.position.y = 22;
        }
        if (camera.position.y === 0) {
            camera.position.y = -1;
        }
        renderer.shadowMap.enabled = true
        camera.lookAt(scene.position)
        cameraControls.update()

        requestAnimationFrame(animate)
    }
    animate();
}

//Outside Windows
function outsidewindow(x,y,z, scene, check) {
    let texLoader = new THREE.TextureLoader()
    let geometry = new THREE.BoxGeometry(5,7, 0.25);
    //Glass
    let glassbase = new THREE.Mesh(geometry)
    glassbase.material = new THREE.MeshPhongMaterial();
    glassbase.position.set(x,y, z)
    glassbase.material.map = texLoader.load('/images/Window.png')
    scene.add(glassbase);
    //Roof
    geometry = new THREE.ConeGeometry(3,2, 10,0,false,0,Math.PI);
    let window = new THREE.Mesh(geometry);
    window.material = new THREE.MeshPhongMaterial();

    if (check) {
        window.rotateY(Math.PI*1.5);
    }
    else {
        window.rotateY(Math.PI*-1.5);
    }
    window.material.map = texLoader.load('/images/Roof.png');
    window.position.set(x, y + 4.4, z);
    scene.add(window);
    //Window Seal
    geometry = new THREE.BoxGeometry(6,1, 1);
    let seal = new THREE.Mesh(geometry);
    seal.material = new THREE.MeshPhongMaterial();
    seal.material.map = texLoader.load('/images/wood.png');
    if (check) {
        seal.position.set(x, y - 3.9, z + 0.35);
    }
    else {
        seal.position.set(x, y - 3.9, z - 0.35);
    }

    scene.add(seal);
}
function outsidewindow1(x,y,z, scene) {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(5,7, 0.25);
    //Glass
    let glassbase = new THREE.Mesh(geometry);
    glassbase.rotateY(Math.PI*1.5);
    glassbase.position.set(x,y, z);
    glassbase.material = new THREE.MeshPhongMaterial();
    glassbase.material.map = texLoader.load('/images/Window.png');

    scene.add(glassbase);
}

//Floor
function floor(x,y,z,scene)  {
    let temp = 4; let movement2 = 0;
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the floor to the scene
    while (temp >= 0) {
        let temp2 = 0;
        if (temp === 3) {
            temp2 = 6;
        }
        else {
            temp2 = 5;
        }
        let movement = 0;
        while (temp2 >= 0) {
            let floor = new THREE.Mesh(geometry);
            floor.material = new THREE.MeshPhongMaterial();
            floor.material.map = texLoader.load('/images/floor.png'); // Texture of section of floor
            floor.position.set(x + movement, y, z + movement2); // Position of the section of floor
            floor.rotateX(Math.PI * 1.5) // Rotate the section of floor
            scene.add(floor); // Adds the new section of floor to the scene
            movement += 20;
            temp2--;
        }
        movement2 += 20;
        temp--;
    }

}

//Ceiling
function ceiling(x,y,z,scene) {
    let temp = 4; let movement2 = 0;
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the ceiling to the scene
    while (temp >= 0) {
        let temp2 = 0;
        if (temp === 3) {
            temp2 = 6;
        }
        else {
            temp2 = 5;
        }
        let movement = 0;
        while (temp2 >= 0) {
            let ceiling = new THREE.Mesh(geometry);
            ceiling.material = new THREE.MeshPhongMaterial();
            ceiling.material.map = texLoader.load('/images/wood.png'); // Texture of section of ceiling
            ceiling.position.set(x + movement, y, z + movement2); // Position of the section of ceiling
            ceiling.rotateX(Math.PI * 1.5) // Rotate the section of ceiling
            scene.add(ceiling); // Adds the new section of ceiling to the scene
            movement += 20;
            temp2--;
        }
        movement2 += 20;
        temp--;
    }

}

//Outside Pillars
function pillars(x,y,z,scene) {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(2,20, 2);
    //Pillar 1
    let pillar = new THREE.Mesh(geometry);
    pillar.material = new THREE.MeshPhongMaterial();
    pillar.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar.position.set(x, y, z); // Position of the section of floor
    scene.add(pillar);
    //Pillar 2
    let pillar2 = new THREE.Mesh(geometry);
    pillar2.material = new THREE.MeshPhongMaterial();
    pillar2.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar2.position.set(x+120, y, z); // Position of the section of floor
    scene.add(pillar2);
    //Pillar 3
    let pillar3 = new THREE.Mesh(geometry);
    pillar3.material = new THREE.MeshPhongMaterial();
    pillar3.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar3.position.set(x, y, z+100); // Position of the section of floor
    scene.add(pillar3);
    //Pillar 4
    let pillar4 = new THREE.Mesh(geometry);
    pillar4.material = new THREE.MeshPhongMaterial();
    pillar4.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar4.position.set(x+120, y, z+100); // Position of the section of floor
    scene.add(pillar4);
    //Pillar 5
    let pillar5 = new THREE.Mesh(geometry);
    pillar5.material = new THREE.MeshPhongMaterial();
    pillar5.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar5.position.set(x+120, y, z+40); // Position of the section of floor
    scene.add(pillar5);
    //Pillar 6
    let pillar6 = new THREE.Mesh(geometry);
    pillar6.material = new THREE.MeshPhongMaterial();
    pillar6.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar6.position.set(x+120, y, z+19.22); // Position of the section of floor
    scene.add(pillar6);
    //Pillar 7
    let pillar7 = new THREE.Mesh(geometry);
    pillar7.material = new THREE.MeshPhongMaterial();
    pillar7.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar7.position.set(x+140, y, z+40); // Position of the section of floor
    scene.add(pillar7);
    //Pillar 8
    let pillar8 = new THREE.Mesh(geometry);
    pillar8.material = new THREE.MeshPhongMaterial();
    pillar8.material.map = texLoader.load('/images/wood.png'); // Texture of section of floor
    pillar8.position.set(x+140, y, z+19.22); // Position of the section of floor
    scene.add(pillar8);
}

//Outside side walls
function outsidewalls(x,y,z,scene,side) {
    let temp = 4; let movement = 0; let movement2 = 0;
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the walls to the scene
    while (temp >= 0) {
        if (temp === 3 && side) {
            movement2 += 20;
        }
        let wall = new THREE.Mesh(geometry);
        wall.material = new THREE.MeshPhongMaterial();
        wall.material.map = texLoader.load('/images/OutsideWall.png'); // Texture of section of wall
        wall.position.set(x + 100 + movement2, y, z + 8.67 + movement); // Position of the section of wall
        wall.rotateY(Math.PI * 1.5) // Rotate the section of wall
        scene.add(wall); // Adds the new section of wall to the scene
        movement += 20;
        temp--;
        movement2 = 0;
    }
    if (side) {
        let wall = new THREE.Mesh(geometry);
        let wall2 = new THREE.Mesh(geometry);
        wall.material = new THREE.MeshPhongMaterial();
        wall2.material = new THREE.MeshPhongMaterial();
        wall.material.map = texLoader.load('/images/OutsideWall.png'); // Texture of section of wall
        wall2.material.map = texLoader.load('/images/OutsideWall.png'); // Texture of section of wall
        wall.position.set(x + 110, y, z + 18.78); // Position of the section of wall
        wall2.position.set(x + 110, y, z + 38.78); // Position of the section of wall
        scene.add(wall); // Adds the new section of wall to the scene
        scene.add(wall2);
    }
}

//Outside front/back walls
function outsidewalls1(x,y,z, scene) {
    let temp1 = 5; let movement1 = 0;
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the walls to the scene
    while (temp1 >= 0) {
        let wall1 = new THREE.Mesh(geometry);
        wall1.material = new THREE.MeshPhongMaterial();
        wall1.material.map = texLoader.load('/images/OutsideWall.png'); // Texture of section of wall
        wall1.position.set(x+movement1,y,z-0.5); // Position of the section of wall
        scene.add(wall1); // Adds the new section of wall to the scene
        movement1+=20;
        temp1--;
    }
}

