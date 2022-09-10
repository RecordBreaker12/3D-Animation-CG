import { BufferGeometryLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/src/loaders/BufferGeometryLoader.js';
import { GUI } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/jsm/libs/lil-gui.module.min.js';

const gui = new GUI();
const loaded = parseInt(window.location.search.slice(1)) || 5;
const count = Math.pow(loaded, 3);
const object = new THREE.Object3D();

const sphere = new THREE.SphereGeometry(0.4, 16, 8);
const box = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cylinder = new THREE.CylinderGeometry(0.3, 0.3, 0.7, 32);
const GEOMETRIES = [box, sphere, cylinder,];

const TEXTURES = [
    '/Textures/sand.jpg',
    '/Textures/sapphire.jpg',
];

function plotObject(mesh) {
    if ( mesh ) {
        const time = Date.now() * 0.001;
        let i = 0;
        const offset = (loaded - 1) / 2;
        for (let x = 0; x < loaded; x++) {
            for (let y = 0; y < loaded; y++) {
                for (let z = 0; z < loaded; z++) {
                    object.position.set(offset - x*2, offset - y*2, offset - z*2);
                    object.rotation.y = (Math.sin(x / 4 + time)
                        + Math.sin(y / 4 + time)
                        + Math.sin(z / 4 + time));
                    object.updateMatrix();
                    mesh.setMatrixAt(i++, object.matrix);
                }
            }
        }
        mesh.instanceMatrix.needsUpdate = true;
    }
}

function random(opt) {
    const index = Math.floor(Math.random() * opt.length);
    return opt[index];
}

function getGeometry() {
    return random(GEOMETRIES);
}

function getTexture() {
    const texturePath = random(TEXTURES);
    const texture = new THREE.TextureLoader().load(texturePath);
    return texture
}

function getMaterial() {
    const texture = getTexture();
    const basic = new THREE.MeshBasicMaterial({map: texture});
    const physical = new THREE.MeshPhysicalMaterial({map: texture, flatShading: true})
    const MATERIALS = [basic,physical,];
    return random(MATERIALS);
}

export function Subject(scene) {
    function loadMesh() {
        function loadModel() {
            const loader = new BufferGeometryLoader();
            loader.load(
                '/Models/Zebra.obj',

                function (geometry) {
                    geometry.computeVertexNormals();
                    geometry.scale(0.5, 0.5, 0.5);
                    const material = new THREE.MeshNormalMaterial();
                    mesh = new THREE.InstancedMesh(geometry, material, count);
                    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                    scene.add(mesh);
                    gui.add(mesh, 'count', 0, count);
                    return mesh;
                },
                
                function (stack) {
                    let loadingProgress = (stack.loaded / stack.total * 100);
                    console.log(loadingProgress.toFixed(2) + '% loaded');
                },

                function (error) {
                    console.log('Error has ocurred: ' + error);
                }
            );
        }

        function createMesh() {
            const geometry = getGeometry();
            const material = getMaterial();
            mesh = new THREE.InstancedMesh(geometry, material, count);
            scene.add(mesh);
            gui.add(mesh, 'count', 0, count);
            return mesh;
        }

        const index = random([0, 0, 1])  
        const func = [createMesh, loadModel][index];
        mesh = func();
        return mesh
    }

    let mesh = undefined;
    loadMesh();

    this.update = function() {
        plotObject(mesh);
    }
}