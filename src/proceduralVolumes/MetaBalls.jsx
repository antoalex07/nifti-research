import React, { useRef } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';

const MetaBalls = () => {

    const metaRef = useRef(null);

    function handleClick() {
        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        if(metaRef.current) {
            metaRef.current.appendChild(renderer.domElement);
        }

        const camera = new THREE.PerspectiveCamera(75, 1920 / 1080, 1.0, 1000.0);
        camera.position.z = 5;

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        const resolution = 32;
        const material = new THREE.MeshPhongMaterial({color: 0xff5500, shininess: 100});

        const metaballs = new MarchingCubes(resolution, material, true, true);
        metaballs.isolation = 10;
        scene.add(metaballs);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        function addMetaBalls(time) {
            metaballs.reset();
            const numBalls = 5;
            for(let i = 0; i < numBalls; i++) {
                const x = Math.sin(time + i) * 1.5;
                const y = Math.cos(time + i * 1.5) * 1.5;
                const z = Math.sin(time * 0.5 + i * 2.0) * 1.5;
                const strength = 0.5;

                metaballs.addBall(x, y, z, strength);
            }
        }

        function animate(time) {
            time *= 0.001;
            addMetaBalls(time);
            metaballs.rotation.y = time * 0.1;
            console.log(metaballs.position);
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();
    }

  return (
    <div>
        <button onClick={handleClick}>kaboom</button>
        <div ref={metaRef}></div>
    </div>
  )
}

export default MetaBalls