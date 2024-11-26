import * as nifti from 'nifti-reader-js';
import { useRef } from 'react';
import { AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, Color, DirectionalLight, DoubleSide, Group, LineBasicMaterial, LineDashedMaterial, LineSegments, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GLTFExporter } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { verticesFinder } from './components/VerticesFinder';

function MarchingCubes0() {

  const ref = useRef(null);

  function fetchArray(header, image) {
    if(header.datatypeCode === 4) {
      const array = new Int16Array(image);
      const expectedLength = header.dims[1] * header.dims[2] * header.dims[3];

      if(array.length === expectedLength) {
        return array;
      } else {
        throw new Error("Unexpected data length. Possible mismatch in the header dimensions");
      } 
    } else {
      throw new Error("Unexpected Datatype. Expected Int16 Data");
    }
  }

  async function createNiftiFile(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer()
    if(nifti.isNIFTI(arrayBuffer)) {
      return arrayBuffer;
    } else {
      throw new Error("not a valid NIfTI file");
    }
  }


  function createTriangle(vertices, color) {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(vertices, 3));

    const indices = [0, 1, 1, 2, 2, 0];
    geometry.setIndex(indices);

    const material = new LineDashedMaterial({color: color});

    return new LineSegments(geometry, material);
  }

  function addTrianglesSequentially(triangles, index = 0) {
    if( index >= triangles.length){
      return new Group();
    }
    const out = addTrianglesSequentially(triangles, index + 1);
    const {vertices, color} = triangles[index];
    const triangle = createTriangle(vertices, color);
    out.add(triangle);
    return out;
  }

  function marchingCubes(volume, dims) {
    
    const finalVolume = new Group();
    const [width, height, depth] = dims;
  
    for(let z = 0; z < 10 - 1; z += 2) {
  
      for(let y = 0; y < height - 1; y += 2) {
        
        for(let x = 0; x < width - 1; x += 2) {
  
          const v1 = x + y * width + z * width * height; // x, y, z
          const v2 = v1 + 1; // 
          const v3 = v1 + width;
          const v4 = v3 + 1;
          const v5 = v1 +  width * height;
          const v6 = v5 + 1;
          const v7 = v5 + width;
          const v8 = v7 + 1;
          
          const intensity = [ volume[v1], volume[v2], volume[v3], volume[v4], volume[v5], volume[v6], volume[v7], volume[v8] ]
  
          if(Object.values(intensity).every(value => value === 0)){
            continue;
          }
          // console.log(intensity);
          const resultJson = verticesFinder(intensity, x, y, z);
          // console.log(resultJson);
          if(resultJson.length === 0) {
            continue;
          }
          finalVolume.add(addTrianglesSequentially(resultJson));
        }
      }
    }
    return finalVolume;
  }



  const handleChange = async () => {
    const niftiData = await createNiftiFile("./mask.nii");
    const niftiHeader = nifti.readHeader(niftiData);
    const niftiImage = nifti.readImage(niftiHeader, niftiData);

    const int16Array = fetchArray(niftiHeader, niftiImage);

    const dims = niftiHeader.dims.slice(1, 4); // [512, 512, 180]
    const volume = new Float32Array(dims[0] * dims[1] * dims[2]);

    for(let i = 0; i < int16Array.length; i++){
      volume[i] = int16Array[i] / 3;
    }

    const scene = new Scene();

    const renderer = new WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(window.devicePixelRatio);

    if(ref.current){
      ref.current.appendChild(renderer.domElement);
    }

    const camera = new PerspectiveCamera(60, 1920 / 1080, 1.0, 1000.0);
    camera.position.set(358, 257, 1);
      
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const ambientLight = new AmbientLight(0x101010);
    scene.add(ambientLight);
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    light.intensity = 0.5
    scene.add(light);

    const final = marchingCubes(volume, dims);

    scene.add(final);

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera)
    }
    animate();

  }

  return (
   <div>
   <button onClick={handleChange}>helloooo</button>
    <div ref={ref}></div>
   </div>
  )
}

export default MarchingCubes0;




/*
  7_________8
  |\        |\
  | \       | \
  |  \5_____|__\ 6
 3|__|______|4  |
  \  |       \  |
   \ |        \ | 
    \|         \|
     1_ _ _ _ _ 2


     0 -> x, y, z
     1 -> x + 1, y, z
     2 -> x, y + 1, z
     3 -> x + 1, y + 1, z
     4 -> x, y, z + 1
     5 -> x + 1, y, z + 1
     6 -> x, y + 1, z + 1
     7 -> x + 1, y + 1, z + 1

     000 1
     001 5
     010 3
     011 7
     100 2
     101 6
     110 4
     111 8

     1 2 3 
     1 2 4  
     1 2 5
     1 2 6
     1 2 7
     1 2 8
     1 3 4
     1 3 5
     1 3 6
     1 3 7
     1 3 8
     1 4 5
     1 4 6
     1 4 7
     1 4 8
     1 5 6
     1 5 7
     1 5 8
     1 6 7
     1 6 8
     1 7 8 -> 21
     
     2 3 4
     2 3 5
     2 3 6
     2 3 7
     2 3 8
     2 4 5
     2 4 6
     2 4 7
     2 4 8
     2 5 6
     2 5 7
     2 5 8
     2 6 7
     2 6 8
     2 7 8 -> 15

     3 4 5
     3 4 6
     3 4 7
     3 4 8
     3 5 6
     3 5 7
     3 5 8
     3 6 7
     3 6 8
     3 7 8 -> 10

     4 5 6
     4 5 7
     4 5 8
     4 6 7
     4 6 8
     4 7 8 -> 6

     5 6 7
     5 6 8
     5 7 8 -> 3

     6 7 8 -> 1
     */

     
  // function createVolumeTexture(volumeData, dimensions) {
  //   const texture = new Data3DTexture(volumeData, dimensions[0], dimensions[1], dimensions[2]);
  //   texture.format = RedFormat;
  //   texture.type = FloatType;
  //   texture.minFilter = LinearFilter;
  //   texture.magFilter = LinearFilter;
  //   texture.unpackAlignment = 1;
  //   return texture;
  // }

  // function createVolumeSlices(volumeData, dimensions, shaderMaterial, numSlices = 180) {
  //   const spacing  = 2 / numSlices;
  //   const slices = new Group();

  //   for(let i = 0; i < numSlices; i++) {
  //     const planeGeometry = new PlaneGeometry(2, 2);
  //     const slice = new Mesh(planeGeometry, shaderMaterial);

  //     slice.position.z = -1 + i * spacing;
  //     slices.add(slice);
  //   }
  //   return slices;
  // } 




     
    //3D rendering starts here i think more info coming soon... 

    // const gridHelper = new GridHelper(10, 10);
    // scene.add(gridHelper);
    // const axesHelper = new AxesHelper(10);
    // scene.add(axesHelper);

    // const lightHelper = new DirectionalLightHelper(light, 1);
    // scene.add(lightHelper);

    // const material = new ShaderMaterial({
    //   uniforms: {
    //     volume: { value: createVolumeTexture(volume, dims) },
    //     dims: { value: new Vector3(dims[0], dims[1], dims[2]) },
    //     lightDirection: { value: new Vector3(1, 1, 1).normalize() },
    //     ambientLight: { value: 0.3 },
    //     diffuseLight: { value: 0.3 }   
    //   },
    //   vertexShader: `
    //     varying vec3 vPos;
    //     varying vec3 vNormal;
    //     void main() {
    //       vPos = position;
    //       vNormal = normalize(normalMatrix * normal);
    //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //     }
    //   `,
    //   fragmentShader: `
    //     precision highp float;
    //     varying vec3 vPos;
    //     varying vec3 vNormal;

    //     uniform sampler3D volume;
    //     uniform vec3 dims;
    //     uniform vec3 lightDirection;
    //     uniform float ambientLight;
    //     uniform float diffuseLight;

    //     void main() {
    //       vec3 coord = (vPos + 1.0) / 2.0;
    //       float intensity = texture(volume, coord).r;
    //       float light = ambientLight + diffuseLight * max(dot(vNormal, lightDirection), 0.0);
    //       gl_FragColor = vec4(intensity * light, intensity * light, intensity * light, 1.0);
    //     }
    //   `,
    //   side: DoubleSide,
    //   transparent: true,
    // });

    // const volumeSlices = createVolumeSlices(volume, dims, material);

// scene.add(result);

    // const exporter = new GLTFExporter();

    // const exportGLTF = async (myFile) => {
    //   try {
    //     const gltf = await exporter.parseAsync(myFile);

    //     const gltfJSON = JSON.stringify(gltf);

    //     const blob = new Blob([gltfJSON], {type: 'application/json'});
    //     const url = URL.createObjectURL(blob);

    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'model1.glb';

    //     ref.current.appendChild(link);

    //     link.click();

    //     ref.current.removeChild(link);

    //     console.log("Export completed successfully. te file has been downloaded");
    //   } catch (error) {
    //     console.log("An error has occured during the process: ", error);
    //   }
    // }
    // exportGLTF(result);
    
    
    // exporter.parse(result, (gltf) => {
    //   const blob = new Blob([gltf], {type: 'application/octet-stream'});
    //   const url = URL.createObjectURL(blob);

    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = 'optimizedModel16.glb';

    //   ref.current.appendChild(link);

    //   link.click();

    //   ref.current.removeChild(link); 
    // }); 