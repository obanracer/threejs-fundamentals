import * as THREE from 'https://threejs.org/build/three.module.js';
import {PointerLockControls} from 'https://threejs.org/examples/jsm/controls/PointerLockControls.js';

const runTest = function() {
    const MOVE_SPEED = 5;
    const MAX_SPEED = 20;
    const FRICTION = 1;

    document.getElementById("test-name").innerText = "shadows test";

    const canvas = document.querySelector('#c');

    const FOV = 90;
    const ASPECT_RATIO = canvas.clientWidth / canvas.clientHeight;
    const NEAR = 0.1;
    const FAR = 100;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x55c0ff);
    
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const camera = new THREE.PerspectiveCamera(FOV, ASPECT_RATIO, NEAR, FAR);
    // camera.position.set(0, 0, 0);
    scene.add(camera);

    const controls = new PointerLockControls(camera, document.body);
    canvas.addEventListener("click", () => { controls.lock(); });
    controls.getObject().position.y = 3;

    const axes = new THREE.AxesHelper();
    scene.add(axes);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.33);
    scene.add(ambientLight);

    const flashLight = new THREE.SpotLight(0x00ff00);
    flashLight.add(new THREE.SpotLightHelper(flashLight));
    flashLight.angle = Math.PI / 8;
    flashLight.decay = 2;
    flashLight.distance = 250;
    flashLight.penumbra = 0.3;
    // flashLight.position.set(1, -1, 0.5); // cool effect
    flashLight.position.set(0, 0, 0);
    camera.add(flashLight);

    const flashLightTarget = new THREE.Mesh(
        new THREE.SphereGeometry(1, 4, 4),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide})
    );
    // flashLightTarget.position.set(-1, 1, -10); // cool effect
    // flashLightTarget.position.set(0, 0, 0);
    // flashLight.target = flashLightTarget;
    // camera.add(flashLightTarget);

    const textureLoader = new THREE.TextureLoader();
    const baseTexture = textureLoader.load("res/floor.png");
    baseTexture.wrapS = THREE.RepeatWrapping;
    baseTexture.wrapT = THREE.RepeatWrapping;
    baseTexture.magFilter = THREE.NearestFilter;
    baseTexture.repeat.set(10, 10);
        

    let objects = [];

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshPhongMaterial({ 
            // color: 0xeeeeee,
            map: baseTexture, 
            side: THREE.DoubleSide, 
            shininess: 100 
        })
    );
    floor.rotation.x = - Math.PI / 2;
    scene.add(floor);
    objects.push(floor);

    function createRoom() {
        const geo = new THREE.PlaneGeometry(20, 20);
        const mat = new THREE.MeshPhongMaterial({
            map: baseTexture, 
            side: THREE.DoubleSide, 
            shininess: 30
        });

        const walls = [
            new THREE.Mesh(geo, mat),
            new THREE.Mesh(geo, mat),
            new THREE.Mesh(geo, mat),
            new THREE.Mesh(geo, mat)
        ];

        walls[0].position.setZ(-10);
        walls[0].position.setY(10);

        walls[1].position.setZ(10);
        walls[1].position.setY(10);
        walls[1].rotation.x = Math.PI;

        walls[2].position.setX(10);
        walls[2].position.setY(10);
        walls[2].rotation.y = Math.PI / 2;
        walls[2].rotation.x = Math.PI / 2;

        walls[3].position.setX(-10);
        walls[3].position.setY(10);
        walls[3].rotation.y = Math.PI / 2;

        scene.add(walls[0]);
        scene.add(walls[1]);
        scene.add(walls[2]);
        scene.add(walls[3]);

        objects.push(walls[0]);
        objects.push(walls[1]);
        objects.push(walls[2]);
        objects.push(walls[3]);
    }
    createRoom();

    
    window.addEventListener("resize", e => {
        // if (canvas.width !== canvas.clientWidth ||
        //     canvas.height !== canvas.clientHeight) {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        // }
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    });

    let moveForwards = false;
    let moveBackwards = false;
    let moveLeft = false;
    let moveRight = false;

    window.addEventListener("keydown", e => {
        if (e.code == "KeyA") moveLeft = true;
        if (e.code == "KeyD") moveRight = true;
        if (e.code == "KeyW") moveForwards = true;
        if (e.code == "KeyS") moveBackwards = true;
    });

    window.addEventListener("keyup", e => {
        if (e.code == "KeyA") moveLeft = false;
        if (e.code == "KeyD") moveRight = false;
        if (e.code == "KeyW") moveForwards = false;
        if (e.code == "KeyS") moveBackwards = false;
    });

    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    let helper = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide})
    );
    scene.add(helper);
    flashLight.target = helper;

    window.addEventListener("mousemove", e => {
        // console.log(e.clientX, e.clientY);
        mouse.x = ( e.clientX / canvas.clientWidth ) * 2 - 1;
        mouse.y = -( e.clientY / canvas.clientHeight ) * 2 + 1;
    });

    let lastTime = 0;
    let velocity = new THREE.Vector3(0, 0, 0);
    let moveDirection = new THREE.Vector3(0, 0, 0);
    let aux = new THREE.Vector3(0, 0, 0);
    function animate(time) {
        let delta = (time - lastTime) / 1000;
        lastTime = time;
        // ====================================================================

        // MOVEMENT ===========================================================
        if (moveLeft) moveDirection.x -= 1
        if (moveRight) moveDirection.x += 1
        if (moveForwards) moveDirection.z += 1;
        if (moveBackwards) moveDirection.z -= 1;
        moveDirection.normalize();

        velocity.z = moveDirection.z * MOVE_SPEED;
        velocity.x = moveDirection.x * MOVE_SPEED; 
        
        controls.moveRight(velocity.x * delta);
        controls.moveForward(velocity.z * delta);
        
        moveDirection.set(0, 0, 0);
        velocity.set(0, 0, 0);
        // ====================================================================

        
        // raycaster.setFromCamera(mouse, camera);
        camera.getWorldDirection(aux);
        raycaster.set(controls.getObject().position, aux);

        // const intersects = raycaster.intersectObject(floor, false);
        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 0) {
            helper.position.copy(intersects[0].point);
        } else {
            helper.position.set(0, 0, 0);
        }


        // ====================================================================
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}


export { runTest };