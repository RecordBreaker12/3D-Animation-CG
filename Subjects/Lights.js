export function Lights(scene) {
    const color = "#fff";
    const intensity = 1;
    const distance = 0;
    const light1 = new THREE.PointLight(color, intensity, distance);
    const light2 = new THREE.AmbientLight(0xffff00, intensity);
    scene.add(light1, light2);

    this.update = function(time) {
        light1.intensity = (Math.sin(time) + 1.5) / 1.5;
    }
}