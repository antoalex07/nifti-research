import React from 'react'

const MarchingCubes = () => {

    const edgeTable = [
     0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 
     0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
     0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17,
     0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
     0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27,
     0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f,
     0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,
     0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f,
     0x40, 0x41, 0x42, 0x43, 0x44, 0x45, 0x46, 0x47,
     0x48, 0x49, 0x4a, 0x4b, 0x4c, 0x4d, 0x4e, 0x4f,
     0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57,
     0x58, 0x59, 0x5a, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f,
     0x60, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67,
     0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f,
     0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77,
     0x78, 0x79, 0x7a, 0x7b, 0x7c, 0x7d, 0x7e, 0x7f,
     0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
     0x88, 0x89, 0x8a, 0x8b, 0x8c, 0x8d, 0x8e, 0x8f,
     0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97,
     0x98, 0x99, 0x9a, 0x9b, 0x9c, 0x9d, 0x9e, 0x9f,
     0xa0, 0xa1, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
     0xa8, 0xa9, 0xaa, 0xab, 0xac, 0xad, 0xae, 0xaf,
     0xb0, 0xb1, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7,
     0xb8, 0xb9, 0xba, 0xbb, 0xbc, 0xbd, 0xbe, 0xbf,
     0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7,
     0xc8, 0xc9, 0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf,
     0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7,
     0xd8, 0xd9, 0xda, 0xdb, 0xdc, 0xdd, 0xde, 0xdf,
     0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7,
     0xe8, 0xe9, 0xea, 0xeb, 0xec, 0xed, 0xee, 0xef,
     0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7,
     0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff,
    ]

    const edgeVertexIndices = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
    ];

    const triangleTable = [
        [-1],
        [0, 3, 8, -1],
        [0, 1, 9, -1],
        [3, 8, 9, 1, 3, 9, -1],
        [1, 2, 10, -1],
        [3, 8, 0, 1, 2, 10, -1],
        [0, 9, 10, 2, 0, 10, -1],
        [8, 9, 10, 8, 3, 2, 10, 3, 2, -1],
        [2, 3, 11, -1],
        [8, 2, 0, 11, 0, 2, -1],
        [0, 2, 9, 2, 3, 11, -1],
        [8, 9, 11, 9, 2, 3, 9, 11, 3, -1],
        

    ]


    const handleGearFourss = () => {
        // Example array of vertices (1 for inside, 0 for outside)
        const vertices = [1, 0, 0, 0, 0, 0, 0, 0]; // 8 vertices

        // Combine vertices into a single binary value
        let binaryValue = 0;

        for (let i = 0; i < vertices.length; i++) {
        if (vertices[i] === 1) {
            binaryValue |= (1 << i); // Set the i-th bit if the vertex is inside
        }
        }

        const temp = 0x2B;
        if(temp === edgeTable[43]){
            console.log("beautiful")
        }

        // Convert to hexadecimal
        const hexValue = binaryValue.toString(16).toUpperCase();

        console.log("Binary Value:", binaryValue.toString(2).padStart(8, '0')); // Binary representation
        console.log("Hex Value: 0x" + hexValue);

    }

  return (
    <div>
        <button onClick={handleGearFourss}>
            unos doss thrice!!!
        </button>
    </div>
  )
}

export default MarchingCubes


/*

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
0000 1100 -> 0x0c
0000 1101 -> 0x0d
0000 1110 -> 0x0e
0000 1111 -> 0x0f
0001 0000 -> 0x10
0001 0001 -> 0x11
0001 0010 -> 0x12
0001 0011 -> 0x13
0001 0100 -> 0x14
0001 0101 -> 0x15
0001 0110 -> 0x16
0001 0111 -> 0x17
0001 1000 -> 0x18
0001 1001 -> 0x19
0001 1010 -> 0x1a
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