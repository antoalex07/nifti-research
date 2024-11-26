import React, { useRef } from 'react'
import * as nifti from 'nifti-reader-js';
import { AmbientLight, BufferAttribute, BufferGeometry, DoubleSide, Group, LineBasicMaterial, LineDashedMaterial, LineSegments, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PointLight, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { edgeVertexIndices, triangleTable } from '../components/LookUpTable';

const MarchingCubes = () => {

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

    function createMarchingCubes(volume, dims) {
        const result = new Group();
        let filteredVolume1 = new Float32Array((dims[0] + 1) * (dims[1] + 1) * (dims[2] + 1));
        let filteredVolume2 = new Float32Array((dims[0] + 1) * (dims[1] + 1) * (dims[2] + 1));
        let filteredVolume3 = new Float32Array((dims[0] + 1) * (dims[1] + 1) * (dims[2] + 1));
        const [width, height, depth] = dims;

        for(let z = 0; z < depth; z++) {
            for(let y = 0; y < height; y++) {
                for(let x = 0; x < width; x++) {
                    const originalIndex = x + y * width + z * width * height;
                    const paddedIndex = (x + 1) + (y + 1) * (width + 1) + (z + 1) * (width + 1) * (height + 1);
                    
                    if(volume[originalIndex] >= 3){
                        filteredVolume3[paddedIndex] = 1; 
                    }
                    if(volume[originalIndex] >= 2) {
                        filteredVolume2[paddedIndex] = 1;
                    }
                    if(volume[originalIndex] >= 1) {
                        filteredVolume1[paddedIndex] = 1;
                    }
                }
            }
        }

        for(let z = 0; z < 10; z++) {
            for(let y = 0; y < height - 1; y++) {
                for(let x = 0; x < width - 1; x++) {
                    const v0 = x + y * width + z * width * height; 
                    const v1 = v0 + 1; 
                    const v2 = v0 + width;
                    const v3 = v2 + 1;
                    const v4 = v2 +  width * height;
                    const v5 = v4 + 1;
                    const v6 = v4 + width;
                    const v7 = v6 + 1;

                    const vertices1 = [
                                        filteredVolume1[v0], 
                                        filteredVolume1[v1],
                                        filteredVolume1[v2],
                                        filteredVolume1[v3],
                                        filteredVolume1[v4],
                                        filteredVolume1[v5],
                                        filteredVolume1[v6],
                                        filteredVolume1[v7],
                                    ];
                    
                    const vertices2 = [
                                        filteredVolume2[v0], 
                                        filteredVolume2[v1],
                                        filteredVolume2[v2],
                                        filteredVolume2[v3],
                                        filteredVolume2[v4],
                                        filteredVolume2[v5],
                                        filteredVolume2[v6],
                                        filteredVolume2[v7],
                                    ];
                    const vertices3 = [
                                        filteredVolume3[v0], 
                                        filteredVolume3[v1],
                                        filteredVolume3[v2],
                                        filteredVolume3[v3],
                                        filteredVolume3[v4],
                                        filteredVolume3[v5],
                                        filteredVolume3[v6],
                                        filteredVolume3[v7],
                                    ];

                    let binaryValue3 = 0;
                    for(let i = 0; i < 8; i++) {
                        if(vertices3[i] === 1) {
                            binaryValue3 |= (1 << i);
                        }
                    }
                    const triangleSet3 = triangleTable[binaryValue3];
                    let i = 0;
                    while(triangleSet3[i] != -1) {
                        const edge1 = triangleSet3[i];
                        const edge2 = triangleSet3[i + 1];
                        const edge3 = triangleSet3[i + 2];

                        let temp_x1 = x + edgeVertexIndices[edge1][0][0];
                        let temp_y1 = y + edgeVertexIndices[edge1][0][1];
                        let temp_z1 = z + edgeVertexIndices[edge1][0][2];

                        let temp_x2 = x + edgeVertexIndices[edge1][1][0];
                        let temp_y2 = y + edgeVertexIndices[edge1][1][1];
                        let temp_z2 = z + edgeVertexIndices[edge1][1][2];

                        let index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        let index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;
                        
                        let s1 = 0, s2 = 0;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x0 = 0, y0 = 0, z0 = 0;

                        if(s2 - s1 != 0){
                            x0 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y0 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z0 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        } else {
                            x0 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y0 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z0 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }

                        temp_x1 = x + edgeVertexIndices[edge2][0][0];
                        temp_y1 = y + edgeVertexIndices[edge2][0][1];
                        temp_z1 = z + edgeVertexIndices[edge2][0][2];

                        temp_x2 = x + edgeVertexIndices[edge2][1][0];
                        temp_y2 = y + edgeVertexIndices[edge2][1][1];
                        temp_z2 = z + edgeVertexIndices[edge2][1][2];

                        index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x1 = 0, y1 = 0, z1 = 0;

                        if(s2 - s1 != 0){
                            x1 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y1 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z1 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        } else {
                            x1 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y1 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z1 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }
                        
                        temp_x1 = x + edgeVertexIndices[edge3][0][0];
                        temp_y1 = y + edgeVertexIndices[edge3][0][1];
                        temp_z1 = z + edgeVertexIndices[edge3][0][2];

                        temp_x2 = x + edgeVertexIndices[edge3][1][0];
                        temp_y2 = y + edgeVertexIndices[edge3][1][1];
                        temp_z2 = z + edgeVertexIndices[edge3][1][2];

                        index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x2 = 0, y2 = 0, z2 = 0;

                        if(s2 - s1 != 0) {
                            x2 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y2 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z2 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        }
                        else {
                            x2 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y2 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z2 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }

                        const triangleVertices = [
                            x0 - 351, y0 - 255, z0 - 1,
                            x1 - 351, y1 - 255, z1 - 1,
                            x2 - 351, y2 - 255, z2 - 1,
                        ]

                        const geometry = new BufferGeometry();
                        geometry.setAttribute('position', new BufferAttribute(new Float32Array(triangleVertices), 3));
                        const material = new MeshBasicMaterial({color: 0x470000, side: DoubleSide});
                        const triangle = new Mesh(geometry, material);
                        result.add(triangle);
                        i += 3;
                    }

                    let binaryValue2 = 0;
                    for(let i = 0; i < 8; i++) {
                        if(vertices2[i] === 1) {
                            binaryValue2 |= (1 << i);
                        }
                    }
                    const triangleSet2 = triangleTable[binaryValue2];
                    i = 0;
                    while(triangleSet2[i] != -1) {
                        const edge1 = triangleSet2[i];
                        const edge2 = triangleSet2[i + 1];
                        const edge3 = triangleSet2[i + 2];

                        let temp_x1 = x + edgeVertexIndices[edge1][0][0];
                        let temp_y1 = y + edgeVertexIndices[edge1][0][1];
                        let temp_z1 = z + edgeVertexIndices[edge1][0][2];

                        let temp_x2 = x + edgeVertexIndices[edge1][1][0];
                        let temp_y2 = y + edgeVertexIndices[edge1][1][1];
                        let temp_z2 = z + edgeVertexIndices[edge1][1][2];

                        let index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        let index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;
                        
                        let s1 = 0, s2 = 0;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x0 = 0, y0 = 0, z0 = 0;

                        if(s2 - s1 != 0){
                            x0 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y0 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z0 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        } else {
                            x0 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y0 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z0 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }

                        temp_x1 = x + edgeVertexIndices[edge2][0][0];
                        temp_y1 = y + edgeVertexIndices[edge2][0][1];
                        temp_z1 = z + edgeVertexIndices[edge2][0][2];

                        temp_x2 = x + edgeVertexIndices[edge2][1][0];
                        temp_y2 = y + edgeVertexIndices[edge2][1][1];
                        temp_z2 = z + edgeVertexIndices[edge2][1][2];

                        index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x1 = 0, y1 = 0, z1 = 0;

                        if(s2 - s1 != 0){
                            x1 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y1 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z1 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        } else {
                            x1 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y1 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z1 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }
                        
                        temp_x1 = x + edgeVertexIndices[edge3][0][0];
                        temp_y1 = y + edgeVertexIndices[edge3][0][1];
                        temp_z1 = z + edgeVertexIndices[edge3][0][2];

                        temp_x2 = x + edgeVertexIndices[edge3][1][0];
                        temp_y2 = y + edgeVertexIndices[edge3][1][1];
                        temp_z2 = z + edgeVertexIndices[edge3][1][2];

                        index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x2 = 0, y2 = 0, z2 = 0;

                        if(s2 - s1 != 0) {
                            x2 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y2 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z2 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        }
                        else {
                            x2 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y2 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z2 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }

                        const triangleVertices = [
                            x0 - 351, y0 - 255, z0 - 1,
                            x1 - 351, y1 - 255, z1 - 1,
                            x2 - 351, y2 - 255, z2 - 1,
                        ]

                        const geometry = new BufferGeometry();
                        geometry.setAttribute('position', new BufferAttribute(new Float32Array(triangleVertices), 3));
                        const material = new MeshBasicMaterial({color: 0x004900, side: DoubleSide});
                        const triangle = new Mesh(geometry, material);
                        result.add(triangle);
                        i += 3;
                    }
                    let binaryValue1 = 0;
                    for(let i = 0; i < 8; i++) {
                        if(vertices1[i] === 1) {    
                            binaryValue1 |= (1 << i);
                        }
                    }
                    const triangleSet1 = triangleTable[binaryValue1];
                    i = 0;
                    while(triangleSet1[i] != -1) {
                        const edge1 = triangleSet1[i];
                        const edge2 = triangleSet1[i + 1];
                        const edge3 = triangleSet1[i + 2];

                        let temp_x1 = x + edgeVertexIndices[edge1][0][0];
                        let temp_y1 = y + edgeVertexIndices[edge1][0][1];
                        let temp_z1 = z + edgeVertexIndices[edge1][0][2];

                        let temp_x2 = x + edgeVertexIndices[edge1][1][0];
                        let temp_y2 = y + edgeVertexIndices[edge1][1][1];
                        let temp_z2 = z + edgeVertexIndices[edge1][1][2];

                        let index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        let index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;
                        
                        let s1 = 0, s2 = 0;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x0 = 0, y0 = 0, z0 = 0;

                        if(s2 - s1 != 0){
                            x0 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y0 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z0 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        } else {
                            x0 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y0 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z0 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }

                        temp_x1 = x + edgeVertexIndices[edge2][0][0];
                        temp_y1 = y + edgeVertexIndices[edge2][0][1];
                        temp_z1 = z + edgeVertexIndices[edge2][0][2];

                        temp_x2 = x + edgeVertexIndices[edge2][1][0];
                        temp_y2 = y + edgeVertexIndices[edge2][1][1];
                        temp_z2 = z + edgeVertexIndices[edge2][1][2];

                        index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x1 = 0, y1 = 0, z1 = 0;

                        if(s2 - s1 != 0){
                            x1 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y1 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z1 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        } else {
                            x1 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y1 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z1 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }
                        
                        temp_x1 = x + edgeVertexIndices[edge3][0][0];
                        temp_y1 = y + edgeVertexIndices[edge3][0][1];
                        temp_z1 = z + edgeVertexIndices[edge3][0][2];

                        temp_x2 = x + edgeVertexIndices[edge3][1][0];
                        temp_y2 = y + edgeVertexIndices[edge3][1][1];
                        temp_z2 = z + edgeVertexIndices[edge3][1][2];

                        index1 = (temp_x1 - 1) + (temp_y1 - 1) * width + (temp_z1 - 1) * width * height;
                        index2 = (temp_x2 - 1) + (temp_y2 - 1) * width + (temp_z2 - 1) * width * height;

                        if(temp_x1 === 0 || temp_y1 === 0 || temp_z1 === 0) {
                            s1 = 0;
                        } else {
                            s1 = volume[index1];
                        }

                        if(temp_x2 === 0 || temp_y2 === 0 || temp_z2 === 0) {
                            s2 = 0
                        } else {
                            s2 = volume[index2];
                        }

                        let x2 = 0, y2 = 0, z2 = 0;

                        if(s2 - s1 != 0) {
                            x2 = temp_x1 + (((1 - s1) / (s2 - s1)) * (temp_x2 - temp_x1));
                            y2 = temp_y1 + (((1 - s1) / (s2 - s1)) * (temp_y2 - temp_y1));
                            z2 = temp_z1 + (((1 - s1) / (s2 - s1)) * (temp_z2 - temp_z1));
                        }
                        else {
                            x2 = temp_x1 + (((1 - s1) / 0.5) * (temp_x2 - temp_x1));
                            y2 = temp_y1 + (((1 - s1) / 0.5) * (temp_y2 - temp_y1));
                            z2 = temp_z1 + (((1 - s1) / 0.5) * (temp_z2 - temp_z1));
                        }

                        const triangleVertices = [
                            x0 - 351, y0 - 255, z0 - 1,
                            x1 - 351, y1 - 255, z1 - 1,
                            x2 - 351, y2 - 255, z2 - 1,
                        ]

                        const geometry = new BufferGeometry();
                        geometry.setAttribute('position', new BufferAttribute(new Float32Array(triangleVertices), 3));
                        const indices = [0, 1, 1, 2, 2, 0];
                        geometry.setIndex(indices);
                        const material = new LineBasicMaterial({color: 0x000048});
                        const triangle = new LineSegments(geometry, material);
                        result.add(triangle);
                        i += 3;
                    }
                }
            }
        }
        return result;
    }

    const handleGearFourss = async () => {
        const niftiData = await createNiftiFile("./mask.nii");
        const niftiHeader = nifti.readHeader(niftiData);
        const niftiImage = nifti.readImage(niftiHeader, niftiData);
    
        const int16Array = fetchArray(niftiHeader, niftiImage);
    
        const dims = niftiHeader.dims.slice(1, 4); // [512, 512, 180]
        const volume = new Float32Array(dims[0] * dims[1] * dims[2]);

        
    
        for(let i = 0; i < int16Array.length; i++){
          volume[i] = int16Array[i] / 1;
        }

        // const uniqueValues = [...new Set(volume)];

        // console.log(uniqueValues);
    
        const scene = new Scene();
    
        const renderer = new WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
    
        if(ref.current){
          ref.current.appendChild(renderer.domElement);
        }
    
        const camera = new PerspectiveCamera(60, 1920 / 1080, 0.1, 1000.0);
          
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.enableZoom = true;
    
        const ambientLight = new AmbientLight(0x101010);
        scene.add(ambientLight);
        const light = new PointLight(0xffffff, 1);
        light.position.set(2, 2, 2);
        light.intensity = 0.01
        scene.add(light);
    
        const final = createMarchingCubes(volume, dims);
    
        scene.add(final);

        // const rayCaster = new Raycaster();
        // const mouse = new Vector2();

        // window.addEventListener('mousemove', (event) => {
        //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        //     mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
        // });

        // const pivot = new Object3D();
        // scene.add(pivot);

        // pivot.add(camera);
        camera.position.set(-301, 21, 54);

        // pivot.position.copy(final.position);


        function animate() {
            requestAnimationFrame(animate);
            
            // rayCaster.setFromCamera(mouse, camera);

            // const intersects = rayCaster.intersectObject(final, true);

            // if(intersects.length > 0) {
            //     intersects[0].object.material.color.set(0xff0000);
            //} else {
            //     intersects[0].object.material.color.set(0x00ff00);
            // }

            // pivot.rotation.y += 1;
            // console.log(camera.position);
            // camera.lookAt(final.position);

            renderer.render(scene, camera);
        }
        animate();
    }

  return (
    <div>
        <button onClick={handleGearFourss}>
            unos doss thrice!!!
        </button>
        <div ref={ref}></div>
    </div>
  )
}

export default MarchingCubes


/*

        // let filteredVolume = new Float32Array(dims[0] * dims[1] * dims[2]);
        //     for(let i = 0; i < volume.length; i++) {
        //         if(volume[i] != 0) {
        //             filteredVolume[i] = 1;
        //         } 
        //     }
        // const [width, height, depth] = dims;

            // let x = 350, y = 254, z = 0;

            // if(z < depth) {
            //     if(y < height) {
            //         if(x < width) {
            //             const v0 = x + y * width + z * width * height; 
            //             const v1 = v0 + 1; 
            //             const v2 = v0 + width;
            //             const v3 = v2 + 1;
            //             const v4 = v2 +  width * height;
            //             const v5 = v4 + 1;
            //             const v6 = v4 + width;
            //             const v7 = v6 + 1;

            //             const vertices = [
            //                 filteredVolume[v0], 
            //                 filteredVolume[v1],
            //                 filteredVolume[v2],
            //                 filteredVolume[v3],
            //                 filteredVolume[v4],
            //                 filteredVolume[v5],
            //                 filteredVolume[v6],
            //                 filteredVolume[v7],
            //             ];

            //             let binaryValue = 0;
            //             for(let i = 0; i < 8; i++) {
            //                 if(vertices[i] === 1) {
            //                     binaryValue |= (1 << i);
            //                 }
            //             }
            //             const triangleSet = triangleTable[binaryValue];
            //             let i = 0;

            //             while(triangleSet[i] != -1) {
            //                 const edge1 = triangleSet[i];
            //                 const edge2 = triangleSet[i + 1];
            //                 const edge3 = triangleSet[i + 2];
    
            //                 let temp_x1 = x + edgeVertexIndices[edge1][0][0];
            //                 let temp_y1 = y + edgeVertexIndices[edge1][0][1];
            //                 let temp_z1 = z + edgeVertexIndices[edge1][0][2];
    
            //                 let temp_x2 = x + edgeVertexIndices[edge1][1][0];
            //                 let temp_y2 = y + edgeVertexIndices[edge1][1][1];
            //                 let temp_z2 = z + edgeVertexIndices[edge1][1][2];
    
            //                 const x0 = (temp_x1 + temp_x2) / 2;
            //                 const y0 = (temp_y1 + temp_y2) / 2;
            //                 const z0 = (temp_z1 + temp_z2) / 2;
    
            //                 temp_x1 = x + edgeVertexIndices[edge2][0][0];
            //                 temp_y1 = y + edgeVertexIndices[edge2][0][1];
            //                 temp_z1 = z + edgeVertexIndices[edge2][0][2];
    
            //                 temp_x2 = x + edgeVertexIndices[edge2][1][0];
            //                 temp_y2 = y + edgeVertexIndices[edge2][1][1];
            //                 temp_z2 = z + edgeVertexIndices[edge2][1][2];
    
            //                 const x1 = (temp_x1 + temp_x2) / 2;
            //                 const y1 = (temp_y1 + temp_y2) / 2;
            //                 const z1 = (temp_z1 + temp_z2) / 2;
                            
            //                 temp_x1 = x + edgeVertexIndices[edge3][0][0];
            //                 temp_y1 = y + edgeVertexIndices[edge3][0][1];
            //                 temp_z1 = z + edgeVertexIndices[edge3][0][2];
    
            //                 temp_x2 = x + edgeVertexIndices[edge3][1][0];
            //                 temp_y2 = y + edgeVertexIndices[edge3][1][1];
            //                 temp_z2 = z + edgeVertexIndices[edge3][1][2];
    
            //                 const x2 = (temp_x1 + temp_x2) / 2;
            //                 const y2 = (temp_y1 + temp_y2) / 2;
            //                 const z2 = (temp_z1 + temp_z2) / 2;
    
            //                 const triangleVertices = [
            //                     x0, y0, z0,
            //                     x1, y1, z1,
            //                     x2, y2, z2,
            //                 ]
            //                 const geometry = new BufferGeometry();
            //                 geometry.setAttribute('position', new BufferAttribute(new Float32Array(triangleVertices), 3));
            //                 const material = new MeshBasicMaterial({color: 0xff0000, side: DoubleSide});
            //                 const triangle = new Mesh(geometry, material);
            //                 scene.add(triangle);
            //                 i += 3;
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


     7--------6
    /|       /|
   4--------5 |
   | |      | |
   | 3------|-2
   |/       |/
   0--------1


   edges
   0 - 1 -> 0
   1 - 2 -> 1
   2 - 3 -> 2
   3 - 0 -> 3
   4 - 5 -> 4
   5 - 6 -> 5
   6 - 7 -> 6
   7 - 4 -> 7
   0 - 4 -> 8
   1 - 5 -> 9
   2 - 6 -> 10
   3 - 7 -> 11

   vertices coordinates
   0 = x, y, z
   1 = x + 1, y, z
   2 = x + 1, y + 1, z
   3 = x, y + 1, z
   4 = x, y, z + 1
   5 = x + 1, y, z + 1
   6 = x + 1, y + 1, z + 1
   7 = x, y + 1, z + 1


0000 0000 -> 0x00 => [-1]
0000 0001 -> 0x01 => [0, 3, 8, -1]
0000 0010 -> 0x02 => [0, 1, 9, -1]
0000 0011 -> 0x03 => [3, 8, 9, 1, 3, 9, -1]
0000 0100 -> 0x04 => [1, 2, 10, -1]
0000 0101 -> 0x05 => [3, 8, 0, 1, 2, 10, -1]
0000 0110 -> 0x06 => [0, 9, 10, 2, 0, 10, -1]
0000 0111 -> 0x07 => [8, 9, 10, 8, 3, 2, 8, 10, 2, -1]
0000 1000 -> 0x08 => [2, 3, 11, -1]
0000 1001 -> 0x09 => [8, 2, 0, 11, 0, 2, -1]
0000 1010 -> 0x0a => [0, 2, 9, 2, 3, 11, -1]
0000 1011 -> 0x0b => [8, 9, 11, 9, 2, 3, 9, 11, 3, -1]
0000 1100 -> 0x0c => [3, 11, 10, 2, 11, 10, -1]
0000 1101 -> 0x0d => [8, 10, 11, 8, 0, 1, 8, 10, 1, -1]
0000 1110 -> 0x0e => [9, 10, 11, 3, 0, 9, 3, 11, 9, -1]
0000 1111 -> 0x0f => [8, 9, 11, 9, 10, 11, -1]
0001 0000 -> 0x10 => [5, 10, 6, -1]
0001 0001 -> 0x11 => [3, 0, 4, 7, 4, 3, -1]
0001 0010 -> 0x12 => [0, 1, 9, 4, 7, 8, -1]
0001 0011 -> 0x13 => [3, 7, 1, 9, 1, 7, 9, 7, 4, -1]
0001 0100 -> 0x14 => [1, 2, 10, 4, 7, 8, -1]
0001 0101 -> 0x15 => [7, 4, 0, 0, 3, 7, 1, 2, 10, -1]
0001 0110 -> 0x16 => [8, 4, 7, 10, 9, 0, 10, 2, 0, -1]
0001 0111 -> 0x17 => [3, 2, 7, 2, 7, 4, 4, 2, 10, 4, 10, 9, -1]
0001 1000 -> 0x18 => [3, 2, 11, 4, 7, 8, -1]
0001 1001 -> 0x19 => [0, 4, 2, 2, 7, 11, 2, 7, 4, -1]
0001 1010 -> 0x1a => [0, 1, 9, 2, 3, 11, 4, 7, 8, -1]
0001 1011 -> 0x1b
0001 1100 -> 0x1c
0001 1101 -> 0x1d
0001 1110 -> 0x1e
0001 1111 -> 0x1f
0010 0000 -> 0x20
0010 0001 -> 0x21
0010 0010 -> 0x22
0010 0011 -> 0x23
0010 0100 -> 0x24
0010 0101 -> 0x25
0010 0110 -> 0x26
0010 0111 -> 0x27
0010 1000 -> 0x28
0010 1001 -> 0x29
0010 1010 -> 0x2a
0010 1011 -> 0x2b
0010 1100 -> 0x2c
0010 1101 -> 0x2d
0010 1110 -> 0x2e
0010 1111 -> 0x2f
0011 0000 -> 0x30
0011 0001 -> 0x31
0011 0010 -> 0x32
0011 0011 -> 0x33
0011 0100 -> 0x34
0011 0101 -> 0x35
0011 0110 -> 0x36
0011 0111 -> 0x37
0011 1000 -> 0x38
0011 1001 -> 0x39
0011 1010 -> 0x3a
0011 1011 -> 0x3b
0011 1100 -> 0x3c
0011 1101 -> 0x3d
0011 1110 -> 0x3e
0011 1111 -> 0x3f
0100 0000 -> 0x40
0100 0001 -> 0x41
0100 0010 -> 0x42
0100 0011 -> 0x43
0100 0100 -> 0x44
0100 0101 -> 0x45
0100 0110 -> 0x46
0100 0111 -> 0x47
0100 1000 -> 0x48
0100 1001 -> 0x49
0100 1010 -> 0x4a
0100 1011 -> 0x4b
0100 1100 -> 0x4c
0100 1101 -> 0x4d
0100 1110 -> 0x4e
0100 1111 -> 0x4f
0101 0000 -> 0x50
0101 0001 -> 0x51
0101 0010 -> 0x52
0101 0011 -> 0x53
0101 0100 -> 0x54
0101 0101 -> 0x55
0101 0110 -> 0x56
0101 0111 -> 0x57
0101 1000 -> 0x58
0101 1001 -> 0x59
0101 1010 -> 0x5a
0101 1011 -> 0x5b
0101 1100 -> 0x5c
0101 1101 -> 0x5d
0101 1110 -> 0x5e
0101 1111 -> 0x5f
0110 0000 -> 0x60
0110 0001 -> 0x61
0110 0010 -> 0x62
0110 0011 -> 0x63
0110 0100 -> 0x64
0110 0101 -> 0x65
0110 0110 -> 0x66
0110 0111 -> 0x67
0110 1000 -> 0x68
0110 1001 -> 0x69
0110 1010 -> 0x6a
0110 1011 -> 0x6b
0110 1100 -> 0x6c
0110 1101 -> 0x6d
0110 1110 -> 0x6e
0110 1111 -> 0x6f
0111 0000 -> 0x70
0111 0001 -> 0x71
0111 0010 -> 0x72
0111 0011 -> 0x73
0111 0100 -> 0x74
0111 0101 -> 0x75
0111 0110 -> 0x76
0111 0111 -> 0x77
0111 1000 -> 0x78
0111 1001 -> 0x79
0111 1010 -> 0x7a
0111 1011 -> 0x7b
0111 1100 -> 0x7c
0111 1101 -> 0x7d
0111 1110 -> 0x7e
0111 1111 -> 0x7f
1000 0000 -> 0x80
1000 0001 -> 0x81
1000 0010 -> 0x82
1000 0011 -> 0x83
1000 0100 -> 0x84
1000 0101 -> 0x85
1000 0110 -> 0x86
1000 0111 -> 0x87
1000 1000 -> 0x88
1000 1001 -> 0x89
1000 1010 -> 0x8a
1000 1011 -> 0x8b
1000 1100 -> 0x8c
1000 1101 -> 0x8d
1000 1110 -> 0x8e
1000 1111 -> 0x8f
1001 0000 -> 0x90
1001 0001 -> 0x91
1001 0010 -> 0x92
1001 0011 -> 0x93
1001 0100 -> 0x94
1001 0101 -> 0x95
1001 0110 -> 0x96
1001 0111 -> 0x97
1001 1000 -> 0x98
1001 1001 -> 0x99
1001 1010 -> 0x9a
1001 1011 -> 0x9b
1001 1100 -> 0x9c
1001 1101 -> 0x9d
1001 1110 -> 0x9e
1001 1111 -> 0x9f
1010 0000 -> 0xa0
1010 0001 -> 0xa1
1010 0010 -> 0xa2
1010 0011 -> 0xa3
1010 0100 -> 0xa4
1010 0101 -> 0xa5
1010 0110 -> 0xa6
1010 0111 -> 0xa7
1010 1000 -> 0xa8
1010 1001 -> 0xa9
1010 1010 -> 0xaa
1010 1011 -> 0xab
1010 1100 -> 0xac
1010 1101 -> 0xad
1010 1110 -> 0xae
1010 1111 -> 0xaf
1011 0000 -> 0xb0
1011 0001 -> 0xb1
1011 0010 -> 0xb2
1011 0011 -> 0xb3
1011 0100 -> 0xb4
1011 0101 -> 0xb5
1011 0110 -> 0xb6
1011 0111 -> 0xb7
1011 1000 -> 0xb8
1011 1001 -> 0xb9
1011 1010 -> 0xba
1011 1011 -> 0xbb
1011 1100 -> 0xbc
1011 1101 -> 0xbd
1011 1110 -> 0xbe
1011 1111 -> 0xbf
1100 0000 -> 0xc0
1100 0001 -> 0xc1
1100 0010 -> 0xc2
1100 0011 -> 0xc3
1100 0100 -> 0xc4
1100 0101 -> 0xc5
1100 0110 -> 0xc6
1100 0111 -> 0xc7
1100 1000 -> 0xc8
1100 1001 -> 0xc9
1100 1010 -> 0xca
1100 1011 -> 0xcb
1100 1100 -> 0xcc
1100 1101 -> 0xcd
1100 1110 -> 0xce
1100 1111 -> 0xcf
1101 0000 -> 0xd0
1101 0001 -> 0xd1
1101 0010 -> 0xd2
1101 0011 -> 0xd3
1101 0100 -> 0xd4
1101 0101 -> 0xd5
1101 0110 -> 0xd6
1101 0111 -> 0xd7
1101 1000 -> 0xd8
1101 1001 -> 0xd9
1101 1010 -> 0xda
1101 1011 -> 0xdb
1101 1100 -> 0xdc
1101 1101 -> 0xdd
1101 1110 -> 0xde
1101 1111 -> 0xdf
1110 0000 -> 0xe0
1110 0001 -> 0xe1
1110 0010 -> 0xe2
1110 0011 -> 0xe3
1110 0100 -> 0xe4
1110 0101 -> 0xe5
1110 0110 -> 0xe6
1110 0111 -> 0xe7
1110 1000 -> 0xe8
1110 1001 -> 0xe9
1110 1010 -> 0xea
1110 1011 -> 0xeb
1110 1100 -> 0xec
1110 1101 -> 0xed
1110 1110 -> 0xee
1110 1111 -> 0xef
1111 0000 -> 0xf0
1111 0001 -> 0xf1
1111 0010 -> 0xf2
1111 0011 -> 0xf3
1111 0100 -> 0xf4
1111 0101 -> 0xf5
1111 0110 -> 0xf6
1111 0111 -> 0xf7
1111 1000 -> 0xf8
1111 1001 -> 0xf9
1111 1010 -> 0xfa
1111 1011 -> 0xfb
1111 1100 -> 0xfc
1111 1101 -> 0xfd
1111 1110 -> 0xfe
1111 1111 -> 0xff

*/