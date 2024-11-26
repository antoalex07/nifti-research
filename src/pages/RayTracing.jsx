import React, { useRef } from 'react'
import { BoxGeometry, Mesh, MeshStandardMaterial, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';

const RayTracing = () => {
    const rayRef = useRef(null);
    
    const handleChange = () => {
        
        const scene = new Scene();
        
        const renderer = new WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth / window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        const camera = new PerspectiveCamera(75, 1920 / 1080, 0.1, 1000.0);

        if(rayRef.current) {
            rayRef.current.appendChild(renderer.domElement);
        }


        const geometry = new BoxGeometry(2, 2, 2);
        const material = new MeshStandardMaterial({color: 0x00ff00});
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        camera.position.z = 5;

        const raycaster = new Raycaster();
        const mouse = new Vector2();

        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        function animate() {
            requestAnimationFrame(animate);
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObject(mesh);

            if (intersects.length > 0) {
                // Highlight the intersected mesh
                mesh.material.color.set(0xff0000);
              } else {
                // Reset the color
                mesh.material.color.set(0x00ff00);
              }
            
              renderer.render(scene, camera);
        }
        animate();
    }
  return (
    <div style={{height: '100%', width: '100%'}}>
        <button onClick={handleChange}>
            pam pam pa pam
        </button>
        <div ref={rayRef} style={{ height: '100vh', width: '100vw' }}></div>
    </div>
  )
}

export default RayTracing