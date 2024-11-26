import React, { useRef } from 'react'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CustomShader = () => {
    const customRef = useRef(null);
    function handleButtonClick() {
        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.setPixelRatio(window.devicePixelRatio);

        if(customRef.current) {
            customRef.current.appendChild(renderer.domElement);
        }

        const camera = new THREE.PerspectiveCamera(75, 1920 / 1080, 1.0, 1000.0);
        camera.position.set(0, 0, 5)

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(10, 10, 10);

        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            vertexShader: `
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                in vec2 vUv;
                out vec4 fragColor;
                void main() {
                    fragColor = vec4(vUv.x, vUv.y, 1.0 - vUv.x, 1.0);
                }
            `
        });

        const material1 = new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            uniforms: {
                ambientLight: {value: new THREE.Color(0.2, 0.2, 0.2)},
                lightColor: {value: new THREE.Color(1, 1, 1)},
                materialColor: {value: new THREE.Color(0.8, 0.3, 0.2)},
                specularColor: {value: new THREE.Color(1, 1, 1)},
                shininess: {value: 32.0},
                lightPosition: {value: light.position},
            },
            vertexShader: `
                out vec3 vNormal;
                out vec3 vLightDir;
                out vec3 vViewDir;

                uniform vec3 lightPosition;

                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vNormal = normalize(normalMatrix * normal);
                    vLightDir = normalize(lightPosition - worldPosition.xyz);
                    vViewDir =  normalize(cameraPosition - worldPosition.xyz);

                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                in vec3 vNormal;
                in vec3 vLightDir;
                in vec3 vViewDir;
                out vec4 fragColor;

                uniform vec3 ambientLight;
                uniform vec3 lightColor;
                uniform vec3 materialColor;
                uniform vec3 specularColor;
                uniform float shininess;

                void main() {
                    vec3 normal = normalize(vNormal);
                    vec3 lightDir = normalize(vLightDir);
                    vec3 viewDir = normalize(vViewDir);

                    float diff = max(dot(normal, lightDir), 0.0);

                    vec3 halfwayDir = normalize(lightDir + viewDir);
                    float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);

                    vec3 ambient = ambientLight * materialColor;
                    vec3 diffuse = diff * lightColor * materialColor;
                    vec3 specular = spec * lightColor * specularColor;

                    fragColor = vec4(ambient + diffuse + specular, 1.0);
                }
            `
        })

        const plane = new THREE.Mesh(geometry, material1);
        plane.position.set(0, 0, 0);
        scene.add(plane);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            plane.rotation.y += 0.01;
        }
        animate();
    }
  return (
    <div>
        <button onClick={handleButtonClick}>suiiiiii</button>
        <div ref={customRef}></div>
    </div>
  )
}

export default CustomShader