import React, { useRef } from 'react'
import * as nifti from 'nifti-reader-js';
import { AdditiveBlending, AmbientLight, BufferAttribute, BufferGeometry, DirectionalLight, Group, PerspectiveCamera, Points, PointsMaterial, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const VolumeRenderer = () => {

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

    
    function createVolumeFromNiftiData(volume, dims, voxelSize = 1) {
        const finalVolume = new Group();
        const [width, height, depth] = dims;
        for(let z = 0; z < depth; z++) {
          for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
              const index = x + y * width + z * width * height;
              const intensity = volume[index];
              if(intensity != 0) {
                const geometry = new BufferGeometry();
                geometry.setAttribute('position', new BufferAttribute(new Float32Array([x - 350, y - 254, z]), 3));
                geometry.setAttribute('color', new BufferAttribute(new Float32Array([1.0, 0.0, 0.0]), 3)); // Add color attribute
                const material = new PointsMaterial({
                  size: 0.05,
                  sizeAttenuation: true,
                  transparent: true,
                  depthWrite: false,
                  blending: AdditiveBlending,
                  vertexColors: true,
                })
                const particles = new Points(geometry, material);
                finalVolume.add(particles);
              }
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
        camera.position.set(0, 0, 5);
          
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
    
        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);
        const light = new DirectionalLight(0xffffff, 1);
        light.position.set(2, 2, 2);
        light.intensity = 0.5
        scene.add(light);
    
        const final = createVolumeFromNiftiData(volume, dims);
    
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

export default VolumeRenderer