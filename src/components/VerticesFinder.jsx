import { Color } from "three";

export function verticesFinder (intensity, x, y, z) {
    
    let vertices = null;
    let color = null;
    let triangles = [];

    function getColor(tmp) {
        const colour = new Color();
        colour.setHSL(tmp, 1, 0.5);
        return colour;
    }

    if(intensity[0] != 0) {

        color = getColor(intensity[0]);
        
        if(intensity[1] != 0 && intensity[0] === intensity[1]) {
          
            if(intensity[1] === intensity[2]) {
                
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y, z,
                    x, y + 1, z
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[1] === intensity[3]) {
                
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y, z,
                    x + 1, y + 1, z
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[1] === intensity[4]) {
                
                vertices = new Float32Array([
                    x, y, z, 
                    x + 1, y, z,
                    x, y, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })

            }
            if(intensity[1] === intensity[5]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y, z,
                    x + 1, y, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[1] === intensity[6]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y, z,
                    x, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })

            }
            if(intensity[1] === intensity[7]) {
                vertices = new Float32Array([
                    x, y, z, 
                    x + 1, y, z,
                    x + 1, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })

            }
        }
        if(intensity[2] != 0 && intensity[0] === intensity[2]) {

            if(intensity[2] === intensity[3]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y + 1, z,
                    x + 1, y + 1, z,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[2] === intensity[4]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y + 1, z, 
                    x, y, z + 1,
                ])
                
            }
            if(intensity[2] === intensity[5]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y + 1, z,
                    x + 1, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[2] === intensity[6]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y + 1, z,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[2] === intensity[7]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y + 1, z,    
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[3] != 0 && intensity[0] === intensity[3]) {
          
            if(intensity[3] === intensity[4]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y + 1, z,
                    x, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[5]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y + 1, z,
                    x + 1, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[6]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y + 1, z,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[7]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y + 1, z,
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[4] != 0 && intensity[0] == intensity[4]) {
            if(intensity[4] === intensity[5]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y, z + 1,
                    x + 1, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[6]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y, z + 1,
                    x, y + 1, z + 1,

                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[7]) {
                vertices = new Float32Array([
                    x, y, z,
                    x, y, z + 1,
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[5] != 0 && intensity[0] == intensity[5]) {
            if(intensity[5] === intensity[6]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y, z + 1,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[5] === intensity[7]) {
                vertices = new Float32Array([
                    x, y, z,
                    x + 1, y, z + 1,
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[0] === intensity[6] && intensity[6] === intensity[7]){
            vertices = new Float32Array([
                x, y, z,
                x, y + 1, z + 1,
                x + 1, y + 1, z + 1,
            ])
            triangles.push({
                vertices: vertices,
                color: color
            })
        }
    }
    if(intensity[1] != 0) {

        color = getColor(intensity[1]);
        
        if(intensity[2] != 0 && intensity[1] === intensity[2]) {
            if(intensity[2] === intensity[3]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y + 1, z,
                    x + 1, y + 1, z,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[2] === intensity[4]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y + 1, z,
                    x, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[2] === intensity[5]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y + 1, z,
                    x + 1, y, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[2] === intensity[6]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y + 1, z,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[2] === intensity[7]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y + 1, z,
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[3] != 0 && intensity[1] === intensity[3]){
            if(intensity[3] === intensity[4]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x + 1, y + 1, z,
                    x, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[5]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x + 1, y + 1, z,
                    x + 1, y, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[6]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x + 1, y + 1, z,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[7]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x + 1, y + 1, z,
                    x + 1, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[4] != 0 && intensity[1] == intensity[4]) {
            if(intensity[4] === intensity[5]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y, z + 1,
                    x + 1, y, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[6]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y, z + 1,
                    x, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[7]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x, y, z + 1,
                    x + 1, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        } 

        if(intensity[5] != 0 && intensity[1] == intensity[5]) {
            if(intensity[5] === intensity[6]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x + 1, y, z + 1,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[5] === intensity[7]) {
                vertices = new Float32Array([
                    x + 1, y, z,
                    x + 1, y, z + 1,
                    x + 1, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[1] === intensity[6] && intensity[6] === intensity[7]){
            vertices = new Float32Array([
                x + 1, y, z,
                x, y + 1, z + 1,
                x + 1, y + 1, z + 1
            ])
            triangles.push({
                vertices: vertices,
                color: color
            })
        }
    }
    if(intensity[2] != 0) {
        color = getColor(intensity[2]);
        if(intensity[3] != 0 && intensity[2] === intensity[3]){
            if(intensity[3] === intensity[4]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x + 1, y + 1, z,
                    x, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })                
            }
            if(intensity[3] === intensity[5]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x + 1, y + 1, z,
                    x + 1, y, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[6]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x + 1, y + 1, z,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[3] === intensity[7]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x + 1, y + 1, z,
                    x + 1, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[4] != 0 && intensity[2] == intensity[4]) {
            if(intensity[4] === intensity[5]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x, y, z + 1,
                    x + 1, y, z + 1

                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[6]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x, y, z + 1,
                    x, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[7]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x, y, z + 1,
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[5] != 0 && intensity[2] == intensity[5]) {
            if(intensity[5] === intensity[6]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x + 1, y, z + 1,
                    x, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[5] === intensity[7]) {
                vertices = new Float32Array([
                    x, y + 1, z,
                    x + 1, y, z + 1,
                    x + 1, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[2] === intensity[6] && intensity[6] === intensity[7]){
            vertices = new Float32Array([
                x, y + 1, z,
                x, y + 1, z + 1,
                x + 1, y + 1, z + 1,
            ])
            triangles.push({
                vertices: vertices,
                color: color
            })
        }
    }
    if(intensity[3] != 0) {
        color = getColor(intensity[3])
        if(intensity[4] != 0 && intensity[3] == intensity[4]) {
            if(intensity[4] === intensity[5]) {
                vertices = new Float32Array([
                    x + 1, y + 1, z,
                    x, y, z + 1,
                    x + 1, y, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[6]) {
                vertices = new Float32Array([
                    x + 1, y + 1, z,
                    x, y, z + 1,
                    x, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[4] === intensity[7]) {
                vertices = new Float32Array([
                    x + 1, y + 1, z,
                    x, y, z + 1,
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        } 
        if(intensity[5] != 0 && intensity[3] == intensity[5]) {
            if(intensity[5] === intensity[6]) {
                vertices = new Float32Array([
                    x + 1, y + 1, z, 
                    x+ 1, y, z + 1,
                    x, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[5] === intensity[7]) {
                vertices = new Float32Array([
                    x + 1, y + 1, z,
                    x + 1, y, z + 1,
                    x + 1, y + 1, z + 1,
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[3] === intensity[6] && intensity[6] === intensity[7]){
            vertices = new Float32Array([
                x + 1, y + 1, z,
                x, y + 1, z + 1,
                x + 1, y + 1, z + 1
            ])
            triangles.push({
                vertices: vertices,
                color: color
            })
        }
    }
    if(intensity[4] != 0) {
        
        color = getColor(intensity[4]);

        if(intensity[5] != 0 && intensity[4] == intensity[5]) {
            if(intensity[5] === intensity[6]) {
                vertices = new Float32Array([
                    x, y, z + 1,
                    x + 1, y, z + 1,
                    x, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
            if(intensity[5] === intensity[7]) {
                vertices = new Float32Array([
                    x, y, z + 1,
                    x + 1, y, z + 1,
                    x + 1, y + 1, z + 1
                ])
                triangles.push({
                    vertices: vertices,
                    color: color
                })
            }
        }
        if(intensity[4] === intensity[6] && intensity[6] === intensity[7]){
            vertices = new Float32Array([
                x, y, z + 1,
                x, y + 1, z + 1,
                x + 1, y + 1, z + 1
            ])
            triangles.push({
                vertices: vertices,
                color: color
            })
        }
    }
    if(intensity[5] != 0 && intensity[5] === intensity[6] && intensity[6] === intensity[7]){
        
        color = getColor(intensity[5])
        vertices = new Float32Array([
            x + 1, y, z + 1,
            x, y + 1, z + 1,
            x + 1, y + 1, z + 1,
        ])
        triangles.push({
            vertices: vertices,
            color: color
        })
    }

    return triangles;
}