import { decompress, isNIFTI, readHeader, readImage } from 'nifti-reader-js';
import React, { useRef } from 'react'
import { ACESFilmicToneMapping, AmbientLight, BufferGeometry, Color, DirectionalLight, DoubleSide, EquirectangularReflectionMapping, Float32BufferAttribute, GLSL3, Mesh, MeshStandardMaterial, PerspectiveCamera, PointLight, PointLightHelper, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EdgeMasks, edgeVertexIndices, triangleTable } from '../components/LookUpTable';
import { EXRLoader } from 'three/examples/jsm/Addons.js';

const fetchArray = (header, image) => {
    if(header.datatypeCode === 4) {
        const array = new Int16Array(image);
        const expectedLength = header.dims[1] * header.dims[2] * header.dims[3];

        if(array.length === expectedLength) {
            return array;
        } else {
            throw new Error("Unexpected data length, Possible mismatch in the header dimensions")
        }
    } else {
        throw new Error("Unexpected datatype. Expected Int16 data");
    }
}

const createNiftiFile = async (url) => {
    const response = await fetch(url) ;
    const arrayBuffer = await response.arrayBuffer()
    if(isNIFTI(arrayBuffer)) {
    return arrayBuffer;
    } else {
    throw new Error("not a valid NIfTI file");
    }
}

const generateScalarField = (int16Array, dims, threshold) => {
    
    const volume = [];
    // let average = 0, i = 0;

    for(let z = 0; z < dims[2]; z++) {
        volume[z] = []
        for(let y = 0; y < dims[1]; y++) {
            volume[z][y] = []
            for(let x = 0; x < dims[0]; x++) {
                // if(x === 0 || y === 0 || z === 0 || x === dims[0] - 1 || y === dims[1] - 1 || z === dims[2] - 1){
                //     volume[z][y][x] = 0;
                // } 
                // else {
                const index = x + y * (dims[0] - 1) + z * (dims[0] - 1) * (dims[1] - 1);
                if(int16Array[index] === threshold) {
                    volume[z][y][x] = 1;
                } else {
                    volume[z][y][x] = 0;
                }
                // }
            }
        }
    }
    // console.log("Total allatha average: ", (average / i));
    // average = average / (dims[0] * dims[1] * dims[2]);
    // console.log("Total average",average)
    return volume;
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
        if(cube[i].value >= threshold){
            cubeIndex |= (1 << i);
        }
    }
    return cubeIndex;
}

const interpolateVertex = (cube, edgeIndex, threshold) => {
    const [v1, v2] = edgeVertexIndices[edgeIndex];
    const t = (threshold - cube[v1].value) / (cube[v2].value - cube[v1].value);
    
    return [
        cube[v1].position[0] + t * (cube[v2].position[0] - cube[v1].position[0]),
        cube[v1].position[1] + t * (cube[v2].position[1] - cube[v1].position[1]),
        cube[v1].position[2] + t * (cube[v2].position[2] - cube[v1].position[2]),
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

const material1 = new ShaderMaterial({
    uniforms: {
        uColor: {value: new Color(1.0, 0.5, 0.2)}
    },
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
        uniform vec3 uColor;
        layout(location = 1) out vec4 fragColor;

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

            return vec4(uColor, 1.0);
        }

        void main() {

            vec3 rayOrigin = vec3(0.0, 0.0, 5.0);
            vec3 rayDirection = getRayDirection(gl_FragCoord.xy, vec2(800.0, 600.0));
            fragColor = rayMarch(rayOrigin, rayDirection);
        }
    `,
});


const marchingCubes = (scalarField, dims, threshold) => {
    const geometry = new BufferGeometry();
    const vertices = [];

    for(let z = 0; z < dims[2] - 1; z++) {
        for(let y = 0; y < dims[1] - 1; y++) {
            for(let x = 0; x < dims[0] - 1; x++) {
                const cube = getCube(scalarField, x, y, z);
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

    // return new Mesh(geometry, new MeshStandardMaterial({color: color, side: DoubleSide}));
    // return new Mesh(geometry, material);
    return geometry;
}

const MarchingCubes3 = () => {

    const konohaRef = useRef(null);

    const handleRasengan = async (event) => {
        const scene = new Scene();

        // const exrLoader = new EXRLoader();
        // exrLoader.load('./background.exr', (texture) => {
        //     texture.mapping = EquirectangularReflectionMapping;
        //     scene.environment = texture;
        //     // scene.background = texture;
        // });

        const renderer = new WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
        // renderer.toneMapping = ACESFilmicToneMapping;
        // renderer.toneMappingExposure = 1.5;

        if(konohaRef.current) {
            konohaRef.current.innerHTML = '';
            konohaRef.current.appendChild(renderer.domElement);
        }

        const camera = new PerspectiveCamera(75, 1920 / 1080, 0.1, 1000.0);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.5;
        controls.update();

        const light = new PointLight(0xffffff, 1);
        light.position.set(0, 0, 0);

        const lightHelper = new PointLightHelper(light, 100);
        scene.add(lightHelper)

        // const ambientLight = new AmbientLight(0x808080);
        // scene.add(ambientLight);
        // const directionalLight = new DirectionalLight(0xffffff, 1);
        // directionalLight.position.set(1, 1, 1);
        // directionalLight.intensity = 0.5;
        // scene.add(directionalLight);

          // Function to clear all objects from the scene
        function clearScene() {
            while (scene.children.length > 0) {
                const child = scene.children[0];
                if (child.geometry) child.geometry.dispose(); // Dispose geometry
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat) => mat.dispose());
                    } else {
                        child.material.dispose(); // Dispose material
                    }
                }
                scene.remove(child); // Remove from scene
            }
        }

        clearScene(); // Clear the previous scene before adding new content

        // const file = event.target.files[0];

        const niftiData = await createNiftiFile("./mask.nii");
        const niftiHeader = readHeader(niftiData);
        const niftiImage = readImage(niftiHeader, niftiData);

        const int16Array = fetchArray(niftiHeader, niftiImage);

        const dims = niftiHeader.dims.slice(1, 4).map(dim => dim + 1);

        const scalarField = generateScalarField(int16Array, dims, 1);
        const scalarField1 = generateScalarField(int16Array, dims, 2);
        const scalarField2 = generateScalarField(int16Array, dims, 3);
        const threshold = 0.5;

        // const scalarField = generateSampleField(3);
        // const dims = [3, 3, 3];
        // const geometry = marchingCubes(scalarField, dims, 0.5);
        // const cube = new Mesh(geometry, material);
        // cube.position.set(-1, -1, -1);
        // scene.add(cube);

        // const geometry = marchingCubes(scalarField, dims, 0.5);
        // const material1 = material.clone();
        // material1.uniforms.uColor.value.set(1.2, 0.5, 0.3);
        // const cubes = new Mesh(geometry, material1);
        // cubes.position.set(-(dims[0] / 2), -(dims[1] / 2), -(dims[2] / 2));
        // scene.add(cubes);

        // const geometry1 = marchingCubes(scalarField1, dims, 0.5);
        // const material2 = material.clone();
        // material2.uniforms.uColor.value.set(0.5, 0.9, 1.2);
        // const cubes1 = new Mesh(geometry1, material2);
        // cubes1.position.set(-(dims[0] / 2), -(dims[1] / 2), -(dims[2] / 2));
        // scene.add(cubes1);

        const geometry2 = marchingCubes(scalarField2, dims, 0.5);
        const material = new ShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                ambientLight: {value: new Color(0.2, 0.2, 0.2)},
                lightColor: {value: new Color(1, 1, 1)},
                materialColor: {value: new Color(0.8, 0.3, 0.2)},
                specularColor: {value: new Color(1, 1, 1)},
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
        // const material3 = material.clone();
        // material3.uniforms.uColor.value.set(0.7, 0.1, 0.4);
        const cubes2 = new Mesh(geometry2, material);
        cubes2.position.set(-(dims[0] / 2), -(dims[1] / 2), -(dims[2] / 2));
        scene.add(cubes2);

        // const cubes2 = marchingCubes(scalarField, dims, 2, 0x333333);
        // cubes2.position.set(0, 0, 0);
        // scene.add(cubes2);

        // const cubes3 = marchingCubes(scalarField, dims, 3, 0x999999);
        // cubes3.position.set(0, 0, 0);
        // scene.add(cubes3)
        camera.position.z = Math.max(dims[0], dims[1], dims[2]) * 1.5;

        function animate() {
            requestAnimationFrame(animate);
            // console.log(camera.position);
            // cubes2.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    }

  return (
    <div>
        <button onClick={handleRasengan}>vroom vroom</button>
        <div ref={konohaRef}></div>
    </div>
  )
}

export default MarchingCubes3


/* 
            uniform vec2 iResolution;
            uniform float iTime;

            float sphereSDF(vec3 p, float r) {
                return length(p) - r;
            }

            vec3 getNormal(vec3 p) {
                float eps = 0.001;
                return normalize(vec3(
                    sphereSDF(p + vec3(eps, 0, 0), 1.0) - sphereSDF(p - vec3(eps, 0, 0), 1.0),
                    sphereSDF(p + vec3(0, eps, 0), 1.0) - sphereSDF(p - vec3(0, eps, 0), 1.0),
                    sphereSDF(p + vec3(0, 0, eps), 1.0) - sphereSDF(p - vec3(0, 0, eps), 1.0);
                ));
            }
            




                vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
                uv.x *= iResolution.x / iResolution.y;

                vec3 rayOrigin = vec3(0.0, 0.0, 2.0);
                vec3 rayDir = normalize(vec3(uv, -1.0));

                vec3 pos = rayOrigin;
                float dist;
                for(int i = 0; i < 100; i++) {
                    dist = sphereSDF(pos, 1.0);
                    if(dist < 0.001) {
                        break;
                    }
                    pos += rayDir * dist;
                }

                vec3 color = vec3(0.0);
                if(dist < 0.001) {
                    vec3 normal = getNormal(pos);
                    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                    float diff = max(dot(normal, lightDir), 0.0);
                    color = vec3(1.0, 0.5, 0.3) * diff;
                }
*/