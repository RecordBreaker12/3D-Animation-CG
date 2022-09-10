import { Scene } from '/Scene.js';

const canvas = document.getElementById("canvas");
const scene = new Scene(canvas);

bindListeners();
render();

function bindListeners() {
    window.onresize = resize;
    resize();
}

function resize() {
    canvas.style.width = '100%';
    canvas.style.height= '100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    scene.onWindowResize();
}

function render() {
    requestAnimationFrame(render);
    scene.update();
}
