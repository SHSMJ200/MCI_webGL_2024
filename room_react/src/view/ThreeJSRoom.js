import React, {useEffect} from 'react';
import * as THREE from 'three'; 
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import './ThreeJSRoom.css';

const ThreeJSRoom = () => {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const canvas = renderer.domElement;
        const clock = new THREE.Clock();
        

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(canvas);
        

        camera.position.set(0, -8, 8);
        

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(0, 15, 0);
        scene.add(light);        
        
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const roomWidth = 100, roomHeight = 30, roomDepth = 100;
        const textureLoader = new THREE.TextureLoader();
        
        const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x003355, side: THREE.DoubleSide });
        const wallMaterial2 = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
        const wallMaterial3 = new THREE.MeshBasicMaterial({ map: textureLoader.load('models/back.png'), side: THREE.DoubleSide });

        const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMaterial3);
        backWall.position.set(0, 0, -roomDepth / 2);
        scene.add(backWall);
        
        const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMaterial);
        frontWall.position.set(0, 0, roomDepth / 2); // Corrected
        scene.add(frontWall);
        
        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
        leftWall.position.set(-roomWidth / 2, 0, 0);
        leftWall.rotation.y = Math.PI / 2;
        scene.add(leftWall);
        
        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMaterial);
        rightWall.position.set(roomWidth / 2, 0, 0);
        rightWall.rotation.y = -Math.PI / 2;
        scene.add(rightWall);
        
        const floor = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 1, roomDepth), wallMaterial2);
        floor.position.set(0, -roomHeight / 2 - 0.5, 0);
        scene.add(floor);
        
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), wallMaterial2);
        ceiling.position.set(0, roomHeight / 2, 0);
        ceiling.rotation.x = Math.PI / 2;
        scene.add(ceiling);

        function addEdges(mesh) {
            const edges = new THREE.EdgesGeometry(mesh.geometry);
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black edges
            const edgeMesh = new THREE.LineSegments(edges, lineMaterial);
            mesh.add(edgeMesh);
        }
        
        addEdges(floor);
        addEdges(ceiling);
        addEdges(leftWall);
        addEdges(rightWall);
        addEdges(backWall);
        addEdges(frontWall);
        
        let furnitureInstances = [];
        let furnitureData = [];

        const mtlLoader = new MTLLoader();
        mtlLoader.load('/models/Main table+PC.mtl', function (materials) {
            materials.preload();
            
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('/models/Main table+PC.obj', function (object) {
                
                const rows = 5, cols = 4;
                const spacing = 16;
                
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < cols; j++) {
                        let newFurniture = object.clone(); 
                        newFurniture.position.set(
                            (j - 1) * spacing, // X-position
                            -13,                // Y-position
                            (i - 2) * spacing * 0.7  // Z-position
                        );
                        
                        const cube = new THREE.Mesh(
                            new THREE.BoxGeometry(1, 1, 1),
                            new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
                        );

                        cube.position.set(
                            (j - 1.3) * spacing,  // X-position (shifted for centering)
                            -9,                 // Y-position (fixed height)
                            (i - 2) * spacing * 0.7   // Z-position (shifted for centering)
                        );
                        
                        // Add shadow properties
                        cube.castShadow = true;
                        cube.receiveShadow = true;

                        scene.add(cube);
                        furnitureInstances.push(cube);                 

                        newFurniture.scale.set(0.8, 0.8, 0.8); 
                        newFurniture.traverse(function(child) {
                            if (child instanceof THREE.Mesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        scene.add(newFurniture);
                        
                        furnitureData.push({
                            name: `Furniture ${i * cols + j + 1}`,
                            description: `This is furniture number ${i * cols + j + 1}.`
                        });
                    }
                }
            });
        });     
  

        const mtlLoaderPlant = new MTLLoader();
        mtlLoaderPlant.load('/models/plant.mtl', function (materials) {
            materials.preload();
            
            const objLoaderPlant = new OBJLoader();
            objLoaderPlant.setMaterials(materials);
            objLoaderPlant.load('/models/plant.obj', function (plant) {

                // Define positions for the 4 plants
                const positions = [
                    { x: -30, y: -14, z: -30 },
                    { x: 30, y: -14, z: -30 },
                    { x: -30, y: -14, z: 30 },
                    { x: 30, y: -14, z: 30 }
                ];

                positions.forEach(pos => {
                    let newPlant = plant.clone();  // Clone the model
                    newPlant.position.set(pos.x, pos.y, pos.z);
                    newPlant.scale.set(2, 2, 2); // Adjust scale if needed
                    
                    // Enable shadow casting
                    newPlant.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    scene.add(newPlant);
                });

            });
        });


        
        let keys = {};
        let rotation = new THREE.Vector2(0, 0);
        const sensitivity = 0.002;
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
    
        function onMouseClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(furnitureInstances);

            if (intersects.length > 0) {
                const selectedFurniture = intersects[0].object;
                const index = furnitureInstances.indexOf(selectedFurniture);

                if (index !== -1) {
                    const info = furnitureData[index];
                    document.getElementById("info").style.display = "flex";
                    document.getElementById("infoText").innerText = info.description;
                    document.getElementById("infoImage").src = `images/furniture${index + 1}.png`;
                    document.getElementById("crosshair").style.display = "none";
                }
            }
        }

        function updateCrosshairPosition() {
            const crosshair = document.getElementById('crosshair');
            crosshair.style.top = "50%";
            crosshair.style.left = "50%";
        }

        window.addEventListener("resize", () => { updateCrosshairPosition();});
        window.addEventListener("keydown", (event) => keys[event.code] = true);
        window.addEventListener("keyup", (event) => keys[event.code] = false);
        window.addEventListener('click', onMouseClick, false);

        window.addEventListener("mousemove", (event) => {
            if (document.pointerLockElement === document.body) {
                rotation.x -= event.movementX * sensitivity;
                rotation.y -= event.movementY * sensitivity;
                rotation.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y)); // Clamp pitch
            }
        });

        window.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                document.getElementById("info").style.display = "none";
                document.getElementById("crosshair").style.display = "block";
            }
            
            if (event.ctrlKey) {
                if (document.pointerLockElement === document.body) {
                    document.exitPointerLock();
                }
                else {
                    document.body.requestPointerLock();
                }
            }

        });

        function animate() {
            requestAnimationFrame(animate);
            let deltaTime = clock.getDelta(); // Time since last frame

            const quaternion = new THREE.Quaternion();
            quaternion.setFromEuler(new THREE.Euler(rotation.y, rotation.x, 0, 'YXZ'));
            camera.quaternion.copy(quaternion);

            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
            const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

            const moveSpeed = 5 * deltaTime;
            if (keys["KeyW"]) camera.position.add(forward.multiplyScalar(moveSpeed));
            if (keys["KeyS"]) camera.position.add(forward.multiplyScalar(-moveSpeed));
            if (keys["KeyA"]) camera.position.add(right.multiplyScalar(-moveSpeed));
            if (keys["KeyD"]) camera.position.add(right.multiplyScalar(moveSpeed));

            renderer.render(scene, camera);
        }

        animate();

        return () => {
            document.body.removeChild(canvas);
            renderer.dispose();
            document.exitPointerLock();
        };
        
    }, []);

    const handleInstructionsClick = () => {
        document.body.requestPointerLock();
        document.getElementById("instructions").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
    };

    return (
        <div id="three-container">
            <div id="instructions" onClick={handleInstructionsClick}>Click to Start</div>
            <div id="info" style={{ display: 'none' }}>
                <img id="infoImage" src={null} alt="Furniture Image" />
                <p id="infoText"></p>
                <button id="closeInfo">Close</button>
            </div>
            <div id="crosshair"></div>
        </div>
    );
};

export default ThreeJSRoom;