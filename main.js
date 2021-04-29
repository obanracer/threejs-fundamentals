import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

// using an IIFE
(() => {
    const canvas = document.querySelector('#c');

    const FOV = 75;
    const ASPECT_RATIO = canvas.clientWidth / canvas.clientHeight;
    const NEAR = 0.1;
    const FAR = 100;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);
    
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
    camera.position.set(0, 5, 5);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-2, 3, 7);
    light.intensity = 0.8;
    scene.add(light);

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0xeeeeee, side: THREE.DoubleSide, shininess: 100 })
    );
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cubes = [
        makeCubeInstace(boxGeometry, "red", -2),
        makeCubeInstace(boxGeometry, "green", 0),
        makeCubeInstace(boxGeometry, "blue", 2),
    ];
    cubes.forEach( e => scene.add(e) );
    
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    scene.add(axes);

    function makeCubeInstace(geometry, color, x) {
        const boxMaterial = new THREE.MeshPhongMaterial({ color: color, shininess: 50 });
        const cube = new THREE.Mesh(geometry, boxMaterial);
        cube.position.x = x;
        cube.position.y = 2;
        
        cube.add(new THREE.AxesHelper());
        cube.add(new THREE.GridHelper(2, 3));

        return cube;
    }
    

    window.addEventListener("resize", e => {
        // if (canvas.width !== canvas.clientWidth ||
        //     canvas.height !== canvas.clientHeight) {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        // }
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    });

    function animate(time) {
        time *= 0.001;
        
        cubes[0].rotation.x = time * 2;
        cubes[1].rotation.y = time * 2;
        cubes[2].rotation.z = time * 2;

        cubes[1].position.y = 2 + Math.sin(time);
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();