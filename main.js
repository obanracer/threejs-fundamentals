import * as THREE from 'https://threejs.org/build/three.module.js';
import {OrbitControls} from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

// using an IIFE
(() => {
    const FOV = 75;
    const ASPECT_RATIO = 16/9;
    const NEAR = 0.1;
    const FAR = 100;

    const canvas = document.querySelector('#c');

    const scene = new THREE.Scene();
    
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
    camera.position.z = 3;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-2, 3, 7);
    light.intensity = 0.8;
    scene.add(light);

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cubes = [
        makeCubeInstace(boxGeometry, 0xff0000, -2),
        makeCubeInstace(boxGeometry, 0x00ff00, 0),
        makeCubeInstace(boxGeometry, 0x0000ff, 2),
    ];

    makeAxisLinesAt(cubes[0].position);
    makeAxisLinesAt(cubes[1].position);
    makeAxisLinesAt(cubes[2].position);

    function makeCubeInstace(geometry, color, x) {
        const boxMaterial = new THREE.MeshPhongMaterial({ color: color });
        const cube = new THREE.Mesh(geometry, boxMaterial);
        cube.position.x = x;
        
        scene.add(cube);

        return cube;
    }

    function makeAxisLinesAt(center) {
        const lineX = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0.9, 0.05, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0.9, -0.05, 0),
            ]),
            new THREE.LineBasicMaterial({ color: 0xff0000 })
        );
    
        const lineY = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0.05, 0.9, 0),
                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(-0.05, 0.9, 0),
            ]),
            new THREE.LineBasicMaterial({ color: 0x00ff00 })
        );
        
        const lineZ = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0.05, 0.9),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, -0.05, 0.9)
            ]),
            new THREE.LineBasicMaterial({ 
                color: 0x0000ff, 
                linewidth: 5
            })
        );

        lineX.position.add(center);
        lineY.position.add(center);
        lineZ.position.add(center);

        scene.add(lineX);
        scene.add(lineY);
        scene.add(lineZ);
    }


    function animate(time) {
        time *= 0.001;
        
        cubes[0].rotation.x = time * 2;
        cubes[1].rotation.y = time * 2;
        cubes[2].rotation.z = time * 2;
        
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();