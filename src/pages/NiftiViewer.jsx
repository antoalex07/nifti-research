import { Niivue } from '@niivue/niivue';
import React, { useEffect, useRef } from 'react'

const NiftiViewer = () => {

    const ref = useRef();
    const path = './mask.nii';

    useEffect(() => {
        const volumeList = [
            {
                url: path,
            },
        ];
        const nv = new Niivue();
        nv.attachToCanvas(ref.current, true);
        nv.loadVolumes(volumeList);
    }, [path]);

  return (
    <div style={{height: '100vh'}}>
        <canvas ref={ref} style={{height: '100vh', width: '100%'}}></canvas>
    </div>
  )
}

export default NiftiViewer