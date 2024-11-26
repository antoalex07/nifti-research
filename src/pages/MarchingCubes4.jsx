import { isNIFTI } from 'nifti-reader-js';
import Pako from 'pako';
import React from 'react'

const MarchingCubes4 = () => {

    const handleChange = async (event) => {
        const file = event.target.files[0];
        // console.log(file);
        // if(!(file instanceof(File))) {
        //     throw new Error("Invalid input: expected a file object");
        // }

        // const arrayBuffer = await new Promise((resolve, reject) => {
        //     const reader = new FileReader();
        //     reader.onload = () => resolve(reader.result);
        //     reader.onerror = () => reject(new Error("Failed to read file"));
        //     reader.readAsArrayBuffer(file);
        // });
        
        const arrayBuffer = await file.arrayBuffer();
        

        let niftiBuffer;

        if(file.name.endsWith(".gz")) {
            try {
                const decompressed = Pako.Inflate(new Uint8Array(arrayBuffer));
                niftiBuffer = decompressed.buffer;
            } catch (error) {
                throw new Error(error);
            }
        } else {
            niftiBuffer = arrayBuffer;
        }

        if(isNIFTI(niftiBuffer)) {
            console.log(arrayBuffer);
        }

    }
  return (
    <div>
        <input type="file" onChange={handleChange} accept=".nii,.nii.gz"/>        
    </div>
  )
}

export default MarchingCubes4