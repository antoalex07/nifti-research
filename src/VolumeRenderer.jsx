import React, { useRef } from 'react'
import * as nifti from 'nifti-reader-js';
import { AmbientLight, BoxGeometry, Color, DirectionalLight, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
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
        for(let z = 0; z < 18; z++) {
          for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
              const index = x + y * width + z * width * height;
              const intensity = volume[index];
              if(intensity != 0) {
                const geometry = new BoxGeometry(1, 1, 1);
                const material = new MeshStandardMaterial({
                  color: new Color(intensity, intensity, intensity),
                  transparent: true,
                  opacity: 1
                })
                const cube = new Mesh(geometry, material);
                cube.position.set(x - 350, y - 254, z);
                console.log(x, y, z, intensity)
                finalVolume.add(cube);
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
    
        const final = createVolumeFromNiftiData(volume, dims);
    
        scene.add(final);

        
        // let x = 350, y = 254, z = 0;

        function animate() {
            requestAnimationFrame(animate);

            // if(z < dims[2]) {
            //     if(y < dims[1]) {
            //         if(x < dims[0]) {
            //             const index = x + y * dims[0] + z * dims[0] * dims[1];
            //             const intensity = volume[index];
            //             if(intensity != 0) {
            //                 const geometry = new BoxGeometry(1, 1, 1);
            //                 const material = new MeshStandardMaterial({
            //                 color: new Color(intensity, intensity, intensity),
            //                 transparent: true,
            //                 opacity: 1
            //                 })
            //                 const cube = new Mesh(geometry, material);
            //                 cube.position.set(x - 350, y - 254, z);
            //                 scene.add(cube);
            //             }
            //             x++;
            //         } else {
            //             y++;
            //             x = 0;
            //         }
            //     } else {
            //         z++;
            //         y = 0;
            //         x = 0;
            //     }
            // }

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