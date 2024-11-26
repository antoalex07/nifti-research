import React, { useRef } from 'react'
import * as THREE from 'three';

const MarchingCubes5 = () => {

    const baseRef = useRef(null);

    function handleButtonClick() {
        const scene = new THREE.Scene();

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 1);
        renderer.setPixelRatio(window.devicePixelRatio);
    }

  return (
    <div>
        <button onClick={handleButtonClick}>
            at the base 
        </button>
        <div ref={baseRef}></div>
    </div>
  )
}

export default MarchingCubes5