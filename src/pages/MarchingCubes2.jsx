import React, { useRef } from 'react'
import { AmbientLight, BufferGeometry, DirectionalLight, DoubleSide, Float32BufferAttribute, Mesh, MeshStandardMaterial, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from 'three';
import { EdgeMasks, edgeVertexIndices, triangleTable } from '../components/LookUpTable';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const generateScalarField = (res) => {
    const field = [];
    for(let i = 0; i < res; i++) {
        field[i] = [];
        for(let j = 0; j < res; j++) {
            field[i][j] = [];
            for(let k = 0; k < res; k++) {
                field[i][j][k] = Math.random();
            } 
        }
    }
    return field;
}

const createGrid = (resolution) => {
    const grid = [];
    for(let i = 0; i < resolution; i++) {
        for(let j = 0; j < resolution; j++) {
            for(let k = 0; k < resolution; k++) {
                grid.push({i, j, k});
            }
        }
    }
    return grid;
}

const getCube = (grid, scalarField, x, y, z) => {
    const vertexOffsets = [
        [0, 0, 0], [1, 0, 0],
        [0, 1, 0], [1, 1, 0],
        [0, 0, 1], [1, 0, 1],
        [1, 1, 1], [0, 1, 1],
    ];

    const cube = [];
    for(let i = 0; i < 8; i++) {
        const [dx, dy, dz] = vertexOffsets[i];
        const pos = [x + dx, y + dy, z + dz];
        cube.push({
            position: pos,
            value: scalarField[pos[0]][pos[1]][pos[2]],
        });
    }
    return cube;
}

const getCubeIndex = (cube, threshold) => {
    let cubeIndex = 0;
    for(let i = 0; i < 8; i++) {
        if(cube[i].value > threshold){
            cubeIndex |= (1 << i);
        }
    }
    return cubeIndex;
}

const interpolateVertex = (cube, edgeIndex, threshold) => {
    const [v1, v2] = edgeVertexIndices[edgeIndex];
    const t = (threshold - cube[v1].value) / (cube[v2].value - cube[v1].value);
    
    return [
        cube[v1].position[0] + t * (cube[v2].position[0] - cube[v2].position[0]),
        cube[v1].position[1] + t * (cube[v2].position[1] - cube[v2].position[1]),
        cube[v1].position[2] + t * (cube[v2].position[2] - cube[v2].position[2]),
    ]
}

const interpolateEdges = (cube, edges, threshold) => {
    const vertices = [];
    for(let i = 0; i < 12; i++) {
        if(edges & (1 << i)) {
            vertices[i] = interpolateVertex(cube, i, threshold);
        }
    }
    return vertices;
}

const marchingCubes = (scalarField, resolution, threshold) => {
    const geometry = new BufferGeometry();
    const vertices = [];

    const grid = createGrid(resolution);

    for(let x = 0; x < resolution - 1; x++) {
        for(let y = 0; y < resolution - 1; y++) {
            for(let z = 0; z < resolution - 1; z++) {
                const cube = getCube(grid, scalarField, x, y, z);
                const cubeIndex = getCubeIndex(cube, threshold);

                const edges = EdgeMasks[cubeIndex];
                if(edges === 0) {
                    continue;
                }

                const interpolatedVertices = interpolateEdges(cube, edges, threshold);
                const triangles = triangleTable[cubeIndex]

                let i = 0;

                while(triangles[i] != -1) {
                    const v1 = interpolatedVertices[triangles[i]];
                    const v2 = interpolatedVertices[triangles[i + 1]];
                    const v3 = interpolatedVertices[triangles[i + 2]];

                    vertices.push(...v1, ...v2, ...v3);
                    i += 3
                }
            }
        }
    }
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    return new Mesh(geometry, new MeshStandardMaterial({color: 0x490000, side: DoubleSide}));
    
}

const MarchingCubes2 = () => {

    const cubeRef = useRef(null);
    const handleClick = () => {
        const resolution = 10;
        const scalarField = generateScalarField(resolution);
        const threshold = 0.5;

        const scene = new Scene();
        
        const renderer = new WebGLRenderer({antialias: true})
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.setPixelRatio(window.devicePixelRatio);

        if(cubeRef.current) {
            cubeRef.current.appendChild(renderer.domElement);
        }

        const camera = new PerspectiveCamera(75, 1920 / 1080, 0.1, 1000.0);
        camera.position.z = 5;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.update();

        const ambientLight = new AmbientLight(0xffffff);
        scene.add(ambientLight);
        const light = new DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 0);
        light.intensity = 0.5
        scene.add(light);

        const cubes = marchingCubes(scalarField, resolution, threshold);
        scene.add(cubes);

        function animate() {
            requestAnimationFrame(animate);
            console.log(cubes.position)
            renderer.render(scene, camera);
        }
        animate();
    }


  return (
    <div>
        <button onClick={handleClick}>
            open sesame
        </button>
        <div ref={cubeRef}></div>
    </div>
  )
}

export default MarchingCubes2