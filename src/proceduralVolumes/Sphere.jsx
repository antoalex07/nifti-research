import React, { useRef } from 'react'
import { ACESFilmicToneMapping, BufferGeometry, EquirectangularReflectionMapping, Float32BufferAttribute, Mesh, PerspectiveCamera, Scene, ShaderMaterial, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { EdgeMasks, edgeVertexIndices, triangleTable } from '../components/LookUpTable';

const generateScalarField = (size, radius) => {
    let average = 0;
    const center = size / 2;
    const scalarField = [];
    for(let z = 0; z < size; z++) {
        scalarField[z] = [];
        for(let y = 0; y < size; y++) {
            scalarField[z][y] = [];
            for(let x = 0; x < size; x++) {
                const dx = x - center;
                const dy = y - center;
                const dz = z - center;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) - radius;
                scalarField[z][y][x] = distance;
                average += distance;
            } 
        }
    }
    average = average / (size * size * size);
    console.log(average);
    return scalarField;
}

const generateSampleField = (size) => {
    const field = [];
    for(let z = 0; z < size; z++) {
        field[z] = [];
        for(let y = 0; y < size; y++) {
            field[z][y] = [];
            for(let x = 0; x < size; x++) {
                field[z][y][x] = 0;
            }
        }
    }
    field[1][1][1] = 1;
    return field;
}

const getCube = (scalarField, x, y, z) => {
    const vertexOffsets = [
        // [0, 0, 0], [1, 0, 0],
        // [0, 1, 0], [1, 1, 0],
        // [0, 0, 1], [1, 0, 1],
        // [1, 1, 1], [0, 1, 1],
        [0, 0, 0], [1, 0, 0],
        [0, 0, 1], [1, 0, 1],
        [0, 1, 0], [1, 1, 0],
        [0, 1, 1], [1, 1, 1], 
    ];

    const cube = [];
    for(let i = 0; i < 8; i++) {
        const [dx, dy, dz] = vertexOffsets[i];
        const pos = [x + dx, y + dy, z + dz];
        cube.push({
            position: pos,
            value: scalarField[pos[2]][pos[1]][pos[0]],
        });
    }
    return cube;
}

const getCubeIndex = (cube, threshold) => {
    let cubeIndex = 0;
    for(let i = 0; i < 8; i++) {
        if(cube[i].value >= threshold) {
            cubeIndex |= (1 << i);    
        }
    }
    return cubeIndex;
}

const interpolatedVertex = (cube, edgeIndex, threshold) => {
    const [v1, v2] = edgeVertexIndices[edgeIndex];
    const t = (threshold - cube[v1].value) / (cube[v2].value - cube[v1].value);
    return [
        cube[v1].position[0] + t * (cube[v2].position[0] - cube[v1].position[0]),
        cube[v1].position[1] + t * (cube[v2].position[1] - cube[v1].position[1]),
        cube[v1].position[2] + t * (cube[v2].position[2] - cube[v1].position[2])
    ]
}

const interpolatedEdges = (cube, edges, threshold) => {
    const vertices = [];
    for(let i = 0; i < 12; i++) {
        if(edges & (1 << i)) {
            vertices[i] = interpolatedVertex(cube, i, threshold);
        }
    }
    return vertices;
}

const marchingCubes = (scalarField, size, threshold) => {
    const geometry = new BufferGeometry();
    const vertices = [];

    for(let z = 0; z < (size - 1); z++) {
        for(let y = 0; y < (size - 1); y++) {
            for(let x = 0; x < (size - 1); x++) {
                // console.log(x, y, z);
                const cube = getCube(scalarField, x, y, z);
                const cubeIndex = getCubeIndex(cube, threshold);
                
                const edges = EdgeMasks[cubeIndex];

                // console.log("CUbe: ", cube);
                // console.log("Edges: ", edges.toString(16));
                
                if(edges === 0) {
                    continue;
                }

                const interpolatedVertices = interpolatedEdges(cube, edges, threshold);
                const triangles = triangleTable[cubeIndex];
                // console.log("interpolated vertices",interpolatedVertices);
                let i = 0; 
                // console.log("triangles",triangles);

                while(triangles[i] != -1) {
                   
                    // console.log(triangles[i], triangles[i + 1], triangles[i + 2]);
                    const v1 = interpolatedVertices[triangles[i]];
                    const v2 = interpolatedVertices[triangles[i + 1]];
                    const v3 = interpolatedVertices[triangles[i + 2]];
                    
                    vertices.push(...v1, ...v2, ...v3);
                    i += 3;
                }
            }
        }
    }
    // console.log(vertices);
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    const material = new ShaderMaterial({
        vertexShader: `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec3 vPosition;

            float sphereSDF(vec3 p, float radius) {
                return length(p) - radius;
            }

            vec3 getRayDirection(vec2 fragCoord, vec2 resolution) {
                vec2 uv = fragCoord / resolution * 2.0 - 1.0;
                uv.y *= resolution.y / resolution.x;
                return normalize(vec3(uv, -1.0));
            }

            vec4 rayMarch(vec3 ro, vec3 rd) {
                float totalDistance = 0.0;
                const int maxSteps = 100;
                const float epsilon = 0.001;
                const float maxDistance = 50.0;

                for(int i = 0; i < maxSteps; i++) {
                    vec3 currentPosition = ro + totalDistance * rd;
                    float distance = sphereSDF(currentPosition, 1.0);

                    if(distance < epsilon) {
                        return vec4(1.0, 0.5, 0.2, 1.0);
                    }
                    
                    if(totalDistance > maxDistance) {
                        break;
                    }

                    totalDistance += distance;
                }

                return vec4(0.0, 0.0, 0.0, 1.0);
            }

            void main() {
                vec3 rayOrigin = vec3(0.0, 0.0, 5.0);
                vec3 rayDirection = getRayDirection(gl_FragCoord.xy, vec2(800.0, 600.0));
                gl_FragColor = rayMarch(rayOrigin, rayDirection);
            }
        `,
        // side: DoubleSide
    });
    return new Mesh(geometry, material);
}

const Sphere = () => {
    
    const orbRef = useRef(null);
    const createTheEnd = () => {
        const scene = new Scene();

        const exrLoader = new EXRLoader();
        exrLoader.load('./background.exr', (texture) => {
            texture.mapping = EquirectangularReflectionMapping;
            scene.environment = texture;
        })

        const renderer = new WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5;

        if(orbRef.current) {
            orbRef.current.appendChild(renderer.domElement);
        }

        const camera = new PerspectiveCamera(75, 1920 / 1080, 1.0, 1000.0);
        camera.position.z = 5;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.5;
        controls.update();

        const size = 64;
        const radius = 10;
        const threshold = 20.745139583916043;
        const scalarField = generateScalarField(size, radius);

        // const scalarField = generateSampleField(size);

        // console.log(scalarField);

        const sphere = marchingCubes(scalarField, size, threshold);
        sphere.position.set(-32, -32, -32);
        scene.add(sphere);

        // const cubeGeometry = new BoxGeometry(1, 1, 1); // Cube of size 1
        // const edges = new EdgesGeometry(cubeGeometry); // Get edges of the cube
        // const edgeMaterial = new LineBasicMaterial({ color: 0xffffff }); // White lines
        // const edgeMesh = new LineSegments(edges, edgeMaterial); // Create edge mesh
        // scene.add(edgeMesh);

        // const gridHelper = new GridHelper();
        // scene.add(gridHelper);
        // const axesHelper = new AxesHelper();
        // scene.add(axesHelper);

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            console.log(sphere.position);
        }
        animate();
    }
  return (
    <div>
        <button onClick={createTheEnd}>
            orb of fire
        </button>
        <div ref={orbRef}></div>
    </div>
  )
}

export default Sphere