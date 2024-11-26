import React, { useRef } from 'react'
import { AmbientLight, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Combine = () => {

    const ref = useRef(null);

    const handleSuperSaiyan = () => {
        const glbFiles = [ 
            './optimizedModel.glb', 
            './optimizedModel1.glb', 
            './optimizedModel2.glb', 
            './optimizedModel3.glb',
            './optimizedModel4.glb',
            './optimizedModel5.glb',
            './optimizedModel6.glb',
            './optimizedModel7.glb',
            './optimizedModel8.glb',
            './optimizedModel9.glb',
            './optimizedModel10.glb',
            './optimizedModel11.glb',
            './optimizedModel12.glb',
            './optimizedModel13.glb',
            './optimizedModel14.glb',
            './optimizedModel15.glb',
            './optimizedModel16.glb',
        ];
        const loader = new GLTFLoader();
        
        const scene = new Scene();

        const renderer = new WebGLRenderer({antialias: true})
        renderer.setSize(window.innerWidth, window/innerHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.setPixelRatio(window.devicePixelRatio);

        if(ref.current) {
            ref.current.appendChild(renderer.domElement);
        }

        const camera = new PerspectiveCamera(60, 1920 / 1080, 1.0, 1000.0);
        camera.position.set(0, 0, 5);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);
        const directionalLight = new DirectionalLight(0xffffff, 1);
        scene.add(directionalLight);

        glbFiles.forEach((file, index) => {
            loader.load(file, (gltf) => {
                const model = gltf.scene;
                scene.add(model);
            });
        });

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }
  return (
    <div>
        <button onClick={handleSuperSaiyan}>gotchaa</button>
        <div ref={ref}></div>
    </div>
  )
}

export default Combine