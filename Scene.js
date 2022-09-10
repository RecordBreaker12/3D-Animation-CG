import { Subject } from '/Subjects/Subject.js';
import { Lights } from '/Subjects/Lights.js'

export function Scene(canvas) {
    const clock = new THREE.Clock();

    const dimensions = {
        width: canvas.width,
        height: canvas.height
    }

    const scene = buildScene();
    const renderer = buildRender(dimensions);
    const camera = buildCamera(dimensions);
    const subjects = createSubjects(scene);

    function buildScene() {
        const scene = new THREE.Scene();
        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fov = 2;
        const nearPlane = 1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(
                fov, aspectRatio, nearPlane, farPlane);

        camera.position.set(250, 200, 150);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.maxPolarAngle = 0.9 * Math.PI / 2;
        controls.enableZoom = true;

        return camera;
    }

    function createSubjects(scene) {
        const subjects = [
                new Lights(scene),
                new Subject(scene)
                ];
        return subjects;
    }

    this.update = function() {
        const time = clock.getElapsedTime();

        for(let i=0; i<subjects.length; i++)
            subjects[i].update(time);

        renderer.render(scene, camera);
    }

    this.onWindowResize = function() {
        const { width, height } = canvas;

        dimensions.width = width;
        dimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }
}