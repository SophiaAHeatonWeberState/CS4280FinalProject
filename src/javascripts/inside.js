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


export function insidehouse(){
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(100, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xEEEEEE)

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })

    //Populate the scene
    bed(4.8, 3, 6,scene,0);
    photo(5,10,0, scene);
    WallsAccents(0,10,0,scene);
    floor(10, 0.1, 9.78, scene);
    ceiling(10, 20.1, 9.78, scene);
    innerwalls(0,10,10,scene);
    innerwalls(20,10,10,scene);
    innerwalls1(10,10,0.22,scene);
    innerwalls1(10,10,20.22,scene);
    outsidewindow1(10, 10, 0, scene)

    camera.position.set(10, 10, 10);

    let controls = {
        MidDay: true
    }

    let gui = new dat.GUI();
    document.querySelector('aside').appendChild(gui.domElement);
    gui.add(controls, 'MidDay').onChange(mid_day);

    let spotLight = new THREE.PointLight(0xf5f7e4);
    spotLight.position.set(10, 10, 10);


    let ambientLight = new THREE.AmbientLight(0xf9fcdc);

    spotLight.castShadow = true;
    scene.add(spotLight);
    scene.add(ambientLight);

    let spotLight2 = new THREE.SpotLight(0x3b98a8);
    spotLight2.position.set(10, 10, 0);
    let ambientLight2 = new THREE.AmbientLight(0x318a99);
    scene.add(spotLight2);
    scene.add(ambientLight2);

    mid_day();
    function mid_day () {
        if (controls.MidDay) {
            spotLight.intensity = .5;
            ambientLight.intensity = .7;
            spotLight2.intensity = 0;
            ambientLight2.intensity = 0;
        }
        else {
            spotLight.intensity = 0;
            ambientLight.intensity = 0;
            spotLight2.intensity = 0.5;
            ambientLight2.intensity = 0.4;
        }
    }
    function animate()
    {
        renderer.render(scene, camera)
        //prevents user from exiting room
        if (camera.position.y >= 20) {
            camera.position.y = 19;
        }
        if (camera.position.y < 0) {
            camera.position.y = 1;
        }
        if (camera.position.x >= 20) {
            camera.position.x = 19;
        }
        if (camera.position.x < 0) {
            camera.position.x = 1;
        }
        if (camera.position.z >= 20) {
            camera.position.z = 19;
        }
        if (camera.position.z < 0) {
            camera.position.z = 1
        }
        camera.lookAt(scene.position)
        cameraControls.update()

        requestAnimationFrame(animate)
    }
    animate();

}

export function bed(x, y, z,scene, check) {
    let texLoader = new THREE.TextureLoader()
    let textures = {
        bedsheet: texLoader.load('/images/Bedsheets.png'),
        wood : texLoader.load('/images/wood.png')
    }

    //Mattress
    let geometry = new THREE.BoxGeometry(5, 2, 10)
    let mattress = new THREE.Mesh(geometry)
    mattress.material = new THREE.MeshPhongMaterial();
    mattress.material.map = textures["bedsheet"]
    scene.add(mattress)
    mattress.position.set(x,y,z)

    //Comforter
    let comforterTex = [
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Comforter2.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Comforter1.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Comforter.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Bedsheets.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Bedsheets.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Bedsheets.png')}),
    ]
    let comforterTex2 = [
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Comforter1.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Comforter2.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Comforter0_5.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Bedsheets.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Bedsheets.png')}),
        new THREE.MeshPhongMaterial({map: texLoader.load('/images/Bedsheets.png')}),
    ]
    geometry = new THREE.BoxGeometry(5.2, 2.5, 9)
    let comforter = new THREE.Mesh(geometry, comforterTex)
    comforter.position.set(x,y ,z + 0.51)



    //Pillow
    geometry = new THREE.CylinderGeometry(1, 1, 3)
    let pillow = new THREE.Mesh(geometry)
    pillow.material = new THREE.MeshPhongMaterial();
    pillow.material.map = textures["bedsheet"]
    pillow.position.set(x,y + 1.5, z - 4)
    pillow.rotateX(Math.PI/2)
    pillow.rotateZ(Math.PI/2)
    scene.add(pillow)
    scene.add(comforter)

    function bedframe() {
        //base
        geometry = new THREE.BoxGeometry(5, 0.5, 11)
        let bedbase = new THREE.Mesh(geometry)
        bedbase.material = new THREE.MeshPhongMaterial();
        bedbase.material.map = textures["wood"]
        bedbase.position.set(x, y - 1.25, z)
        scene.add(bedbase)
        //headboard
        geometry = new THREE.BoxGeometry(5, 5, 0.1)
        let headboard = new THREE.Mesh(geometry)
        headboard.material = new THREE.MeshPhongMaterial();
        headboard.material.map = textures["wood"]
        headboard.position.set(x, y + 1, z - 5.05)
        geometry = new THREE.BoxGeometry(5, 0.5, 1)
        let headboard2 = new THREE.Mesh(geometry)
        headboard2.material = new THREE.MeshPhongMaterial();
        headboard2.material.map = textures["wood"]
        headboard2.position.set(x, y + 3.2, z - 5.5)
        geometry = new THREE.BoxGeometry(0.5, 4, 0.3)
        let headboard3 = new THREE.Mesh(geometry)

        let headboard4 = new THREE.Mesh(geometry)
        headboard3.material = new THREE.MeshPhongMaterial();
        headboard3.material.map = textures["wood"]
        headboard4.material = new THREE.MeshPhongMaterial();
        headboard4.material.map = textures["wood"]
        headboard3.position.set(x - 1, y + 1, z - 5.2)
        headboard4.position.set(x + 1, y + 1, z - 5.2)
        scene.add(headboard)
        scene.add(headboard2)
        scene.add(headboard3)
        scene.add(headboard4)
        //footboard
        geometry = new THREE.BoxGeometry(5, 2.9, 0.1)
        let footboard = new THREE.Mesh(geometry);
        footboard.material = new THREE.MeshPhongMaterial();
        footboard.material.map = textures["wood"]
        footboard.position.set(x, y, z + 5.05)
        geometry = new THREE.BoxGeometry(0.5, 2.5, 0.3)
        let footboard2 = new THREE.Mesh(geometry)
        let footboard3 = new THREE.Mesh(geometry)
        footboard2.material = new THREE.MeshPhongMaterial();
        footboard3.material = new THREE.MeshPhongMaterial();
        footboard2.material.map = textures["wood"]
        footboard3.material.map = textures["wood"]
        footboard2.position.set(x - 1, y + 0.25, z + 5.2)
        footboard3.position.set(x + 1, y + 0.25, z + 5.2)
        geometry = new THREE.BoxGeometry(5, 0.5, 1)
        let footboard4 = new THREE.Mesh(geometry)
        footboard4.material = new THREE.MeshPhongMaterial();
        footboard4.material.map = textures["wood"]
        footboard4.position.set(x, y + 1.7, z + 5.5)
        scene.add(footboard)
        scene.add(footboard2)
        scene.add(footboard3)
        scene.add(footboard4)
        //Legs
        geometry = new THREE.BoxGeometry(1, 5, 1)
        let leg1 = new THREE.Mesh(geometry)
        let leg2 = new THREE.Mesh(geometry)
        geometry = new THREE.BoxGeometry(1, 6.5, 1)
        let leg3 = new THREE.Mesh(geometry)
        let leg4 = new THREE.Mesh(geometry)
        leg1.material = new THREE.MeshPhongMaterial();
        leg2.material = new THREE.MeshPhongMaterial();
        leg3.material = new THREE.MeshPhongMaterial();
        leg4.material = new THREE.MeshPhongMaterial();
        leg1.material.map = textures["wood"]
        leg2.material.map = textures["wood"]
        leg3.material.map = textures["wood"]
        leg4.material.map = textures["wood"]
        leg1.position.set(x + 3, y - 0.5, z + 5.5)
        leg2.position.set(x - 3, y - 0.5, z + 5.5)
        leg3.position.set(x - 3, y + 0.3, z - 5.5)
        leg4.position.set(x + 3, y + 0.3, z - 5.5)
        scene.add(leg1)
        scene.add(leg2)
        scene.add(leg3)
        scene.add(leg4)
    }
    bedframe();
}

export function photo(x,y,z, scene) {
    let texLoader = new THREE.TextureLoader()
    //Portrait
    let geometry = new THREE.BoxGeometry(4,4, 0.05);
    let photoBase = new THREE.Mesh(geometry)
    photoBase.material = new THREE.MeshPhongMaterial();
    photoBase.position.set(x,y,z)
    photoBase.material.map = texLoader.load('/images/Portrait.png')
    scene.add(photoBase)
    //Frame
    geometry = new THREE.BoxGeometry(4,0.09, 0.08);
    let frame = new THREE.Mesh(geometry)
    frame.material = new THREE.MeshPhongMaterial();
    frame.material.map = texLoader.load('/images/wood.png')
    frame.position.set(x, y + 2, z)
    let frame1 = new THREE.Mesh(geometry)
    frame1.material = new THREE.MeshPhongMaterial();
    frame1.material.map = texLoader.load('/images/wood.png')
    frame1.position.set(x, y - 2, z)
    geometry = new THREE.BoxGeometry(0.09,4.09, 0.08);
    let frame2 = new THREE.Mesh(geometry)
    frame2.material = new THREE.MeshPhongMaterial();
    frame2.material.map = texLoader.load('/images/wood.png')
    frame2.position.set(x + 2, y, z)
    let frame3 = new THREE.Mesh(geometry)
    frame3.material = new THREE.MeshPhongMaterial();
    frame3.material.map = texLoader.load('/images/wood.png')
    frame3.position.set(x - 2, y, z)
    scene.add(frame)
    scene.add(frame1)
    scene.add(frame2)
    scene.add(frame3)


}


//Innerwalls
export function innerwalls(x,y,z, scene) {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the walls to the scene
    let wall = new THREE.Mesh(geometry);
    wall.material = new THREE.MeshPhongMaterial();
    wall.material.map = texLoader.load('/images/Walls.png'); // Texture of section of wall
    wall.position.set(x, y, z); // Position of the section of wall
    wall.rotateY(Math.PI * 1.5) // Rotate the section of wall
    scene.add(wall); // Adds the new section of wall to the scene
}
export function innerwalls1(x,y,z, scene) {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the walls to the scene
    let wall1 = new THREE.Mesh(geometry);
    wall1.material = new THREE.MeshPhongMaterial();
    wall1.material.map = texLoader.load('/images/Walls.png'); // Texture of section of wall
    wall1.position.set(x,y,z-0.5); // Position of the section of wall
    scene.add(wall1); // Adds the new section of wall to the scene

}
//window
export function outsidewindow1(x,y,z, scene) {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(5,7, 0.25);
    //Glass
    let glassbase = new THREE.Mesh(geometry);
    glassbase.material = new THREE.MeshPhongMaterial();

    //glassbase.rotateY(Math.PI*1.5);
    glassbase.position.set(x,y, z);
    glassbase.material.map = texLoader.load('/images/Window.png');
    scene.add(glassbase);
}
//wall Accents
export function WallsAccents (x,y,z, scene) {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(1,20, 1);
    //pillars
    let pillar1 = new THREE.Mesh(geometry)
    let pillar2 = new THREE.Mesh(geometry)
    let pillar3 = new THREE.Mesh(geometry)
    let pillar4 = new THREE.Mesh(geometry)
    let pillar5 = new THREE.Mesh(geometry)

    pillar1.material = new THREE.MeshPhongMaterial();
    pillar2.material = new THREE.MeshPhongMaterial();
    pillar3.material = new THREE.MeshPhongMaterial();
    pillar4.material = new THREE.MeshPhongMaterial();
    pillar5.material = new THREE.MeshPhongMaterial();

    pillar1.material.map = texLoader.load('/images/wood.png')
    pillar2.material.map = texLoader.load('/images/wood.png')
    pillar3.material.map = texLoader.load('/images/wood.png')
    pillar4.material.map = texLoader.load('/images/wood.png')
    pillar5.material.map = texLoader.load('/images/wood.png')

    pillar1.position.set(x+0.5,y,z+0.22)
    pillar2.position.set(x+19.5,y,z+0.22)
    pillar3.position.set(x+0.5,y,z+19.22)
    pillar4.position.set(x+19.5,y,z+19.22)
    scene.add(pillar1)
    scene.add(pillar2)
    scene.add(pillar3)
    scene.add(pillar4)
}
//Floor
export function floor(x,y,z,scene)  {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the floor to the scene

    let wall = new THREE.Mesh(geometry);
    wall.material = new THREE.MeshPhongMaterial();
    wall.material.map = texLoader.load('/images/floor.png'); // Texture of section of floor
    wall.position.set(x , y, z); // Position of the section of floor
    wall.rotateX(Math.PI * 1.5) // Rotate the section of floor
    scene.add(wall); // Adds the new section of floor to the scene
}
//Ceiling
export function ceiling(x,y,z,scene) {
    let texLoader = new THREE.TextureLoader();
    let geometry = new THREE.BoxGeometry(20,20, 0.25);
    //Adds the sections of the ceiling to the scene
    let wall = new THREE.Mesh(geometry);
    wall.material = new THREE.MeshPhongMaterial();
    wall.material.map = texLoader.load('/images/wood.png'); // Texture of section of ceiling
    wall.position.set(x ,y, z); // Position of the section of ceiling
    wall.rotateX(Math.PI * 1.5) // Rotate the section of ceiling
    scene.add(wall); // Adds the new section of ceiling to the scene

}