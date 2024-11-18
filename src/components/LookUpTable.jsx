    export const edgeTable = [
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

   export const edgeVertexIndices = [
       [ [0, 0, 0], [1, 0, 0] ],
       [ [1, 0, 0], [1, 1, 0] ],
       [ [1, 1, 0], [0, 1, 0] ],
       [ [0, 1, 0], [0, 0, 0] ],
       [ [0, 0, 1], [1, 0, 1] ],
       [ [1, 0, 1], [1, 1, 1] ],
       [ [1, 1, 1], [0, 1, 1] ],
       [ [0, 1, 1], [0, 0, 1] ],
       [ [0, 0, 0], [0, 0, 1] ],
       [ [1, 0, 0], [1, 0, 1] ],
       [ [1, 1, 0], [1, 1, 1] ],
       [ [0, 1, 0], [0, 1, 1] ],
   ];

   export const triangleTable = [
       [ -1 ],
       [ 0, 3, 8, -1 ],
       [ 0, 1, 9, -1 ],
       [ 3, 8, 9, 1, 3, 9, -1 ],
       [ 1, 2, 10, -1 ],
       [ 3, 8, 0, 1, 2, 10, -1 ],
       [ 0, 9, 10, 2, 0, 10, -1 ],
       [ 8, 9, 10, 8, 3, 2, 10, 3, 2, -1 ],
       [ 2, 3, 11, -1 ],
       [ 8, 2, 0, 11, 0, 2, -1 ],
       [ 0, 2, 9, 2, 3, 11, -1 ],
       [ 8, 9, 11, 9, 2, 3, 9, 11, 3, -1 ],
       [ 3, 11, 10, 2, 11, 10, -1 ],
       [ 8, 10, 11, 8, 0, 1, 8, 10, 1, -1 ],
       [ 9, 10, 11, 3, 0, 9, 3, 11, 9, -1 ],
       [ 8, 9, 11, 9, 10, 11, -1 ],
       [ 5, 10, 6, -1 ],
       [ 3, 0, 4, 7, 4, 3, -1 ],
       [ 0, 1, 9, 4, 7, 8, -1 ],
       [ 3, 7, 1, 9, 1, 7, 9, 7, 4, -1 ],
       [ 1, 2, 10, 4, 7, 8, -1 ],
       [ 7, 4, 0, 0, 3, 7, 1, 2, 10, -1 ],
       [ 8, 4, 7, 10, 9, 0, 10, 2, 0, -1 ],
       [ 3, 2, 7, 2, 7, 4, 4, 2, 10, 4, 10, 9, -1 ],
       [ 3, 2, 11, 4, 7, 8, -1 ],
       [ 0, 4, 2, 2, 7, 11, 2, 7, 4, -1 ],
       [ 0, 1, 9, 2, 3, 11, 4, 7, 8, -1 ],
       [ 9, 1, 4, 11, 2, 7, 4, 2, 7, 1, 4, 2, -1 ],
       [ 10, 11, 3, 10, 1, 3, 8, 4, 7, -1 ],
       [ 0, 1, 3, 1, 10, 11, 4, 7, 11, 4, 11, 1, -1 ],
       [ 9, 10, 11, 11, 3, 9, 9, 3, 0, 4, 7, 8, -1 ],
       [ 7, 4, 11, 4, 9, 11, 9, 10, 11, -1 ],
       [ 4, 9, 5, -1 ],
       [ 9, 4, 5, 8, 0, 3, -1 ],
       [ 4, 5, 0, 0, 5, 1, -1 ],
       [ 5, 8, 4, 5, 3, 8, 5, 1, 3, -1 ],
       [ 9, 4, 5, 11, 3, 2, -1 ],
       [ 2, 11, 0, 0, 11, 8, 5, 9, 4, -1 ],
       [ 4, 5, 0, 0, 5, 1, 11, 3, 2, -1 ],
       [ 5, 1, 4, 1, 2, 11, 4, 1, 11, 4, 11, 8, -1 ],
       [ 1, 10, 2, 5, 9, 4, -1 ],
       [ 9, 4, 5, 0, 3, 8, 2, 1, 10, -1 ],
       [ 2, 5, 10, 2, 4, 5, 2, 0, 4, -1 ],
       [ 10, 2, 5, 5, 2, 4, 4, 2, 3, 4, 3, 8, -1 ],
       [ 11, 3, 10, 10, 3, 1, 4, 5, 9, -1 ],
       [ 4, 5, 9, 10, 0, 1, 10, 8, 0, 10, 11, 8, -1 ],
       [ 11, 3, 0, 11, 0, 5, 0, 4, 5, 10, 11, 5, -1 ],
       [ 4, 5, 8, 5, 10, 8, 10, 11, 8, -1 ],
       [ 8, 7, 9, 9, 7, 5, -1 ],
       [ 3, 9, 0, 3, 5, 9, 3, 7, 5, -1 ],
       [ 7, 0, 8, 7, 1, 0, 7, 5, 1, -1 ],
       [ 7, 5, 3, 3, 5, 1, -1 ],
       [ 5, 9, 7, 7, 9, 8, 2, 11, 3, -1 ],
       [ 2, 11, 7, 2, 7, 9, 7, 5, 9, 0, 2, 9, -1 ],
       [ 2, 11, 3, 7, 0, 8, 7, 1, 0, 7, 5, 1, -1 ],
       [ 2, 11, 1, 11, 7, 1, 7, 5, 1, -1 ],
       [ 8, 7, 9, 9, 7, 5, 2, 1, 10, -1 ],
       [ 10, 2, 1, 3, 9, 0, 3, 5, 9, 3, 7, 5, -1 ],
       [ 7, 5, 8, 5, 10, 2, 8, 5, 2, 8, 2, 0, -1 ],
       [ 10, 2, 5, 2, 3, 5, 3, 7, 5, -1 ],
       [ 8, 7, 5, 8, 5, 9, 11, 3, 10, 3, 1, 10, -1 ],
       [ 5, 11, 7, 10, 11, 5, 1, 9, 0, -1 ],
       [ 11, 5, 10, 7, 5, 11, 8, 3, 0, -1 ],
       [ 5, 11, 7, 10, 11, 5, -1 ],
       [ 6, 7, 11, -1 ],
       [ 7, 11, 6, 3, 8, 0, -1 ],
       [ 6, 7, 11, 0, 9, 1, -1 ],
       [ 9, 1, 8, 8, 1, 3, 6, 7, 11, -1 ],
       [ 3, 2, 7, 7, 2, 6, -1 ],
       [ 0, 7, 8, 0, 6, 7, 0, 2, 6, -1 ],
       [ 6, 7, 2, 2, 7, 3, 9, 1, 0, -1 ],
       [ 6, 7, 8, 6, 8, 1, 8, 9, 1, 2, 6, 1, -1 ],
       [ 11, 6, 7, 10, 2, 1, -1 ],
       [ 3, 8, 0, 11, 6, 7, 10, 2, 1, -1 ],
       [ 0, 9, 2, 2, 9, 10, 7, 11, 6, -1 ],
       [ 6, 7, 11, 8, 2, 3, 8, 10, 2, 8, 9, 10, -1 ],
       [ 7, 10, 6, 7, 1, 10, 7, 3, 1, -1 ],
       [ 8, 0, 7, 7, 0, 6, 6, 0, 1, 6, 1, 10, -1 ],
       [ 7, 3, 6, 3, 0, 9, 6, 3, 9, 6, 9, 10, -1 ],
       [ 6, 7, 10, 7, 8, 10, 8, 9, 10, -1 ],
       [ 11, 6, 8, 8, 6, 4, -1 ],
       [ 6, 3, 11, 6, 0, 3, 6, 4, 0, -1 ],
       [ 11, 6, 8, 8, 6, 4, 1, 0, 9, -1 ],
       [ 1, 3, 9, 3, 11, 6, 9, 3, 6, 9, 6, 4, -1 ],
       [ 2, 8, 3, 2, 4, 8, 2, 6, 4, -1 ],
       [ 4, 0, 6, 6, 0, 2, -1 ],
       [ 9, 1, 0, 2, 8, 3, 2, 4, 8, 2, 6, 4, -1 ],
       [ 9, 1, 4, 1, 2, 4, 2, 6, 4, -1 ],
       [ 4, 8, 6, 6, 8, 11, 1, 10, 2, -1 ],
       [ 1, 10, 2, 6, 3, 11, 6, 0, 3, 6, 4, 0, -1 ],
       [ 11, 6, 4, 11, 4, 8, 10, 2, 9, 2, 0, 9, -1 ],
       [ 10, 4, 9, 6, 4, 10, 11, 2, 3, -1 ],
       [ 4, 8, 3, 4, 3, 10, 3, 1, 10, 6, 4, 10, -1 ],
       [ 1, 10, 0, 10, 6, 0, 6, 4, 0, -1 ],
       [ 4, 10, 6, 9, 10, 4, 0, 8, 3, -1 ],
       [ 4, 10, 6, 9, 10, 4, -1 ],
       [ 6, 7, 11, 4, 5, 9, -1 ],
       [ 4, 5, 9, 7, 11, 6, 3, 8, 0, -1 ],
       [ 1, 0, 5, 5, 0, 4, 11, 6, 7, -1 ],
       [ 11, 6, 7, 5, 8, 4, 5, 3, 8, 5, 1, 3, -1 ],
       [ 3, 2, 7, 7, 2, 6, 9, 4, 5, -1 ],
       [ 5, 9, 4, 0, 7, 8, 0, 6, 7, 0, 2, 6, -1 ],
       [ 3, 2, 6, 3, 6, 7, 1, 0, 5, 0, 4, 5, -1 ],
       [ 6, 1, 2, 5, 1, 6, 4, 7, 8, -1 ],
       [ 10, 2, 1, 6, 7, 11, 4, 5, 9, -1 ],
       [ 0, 3, 8, 4, 5, 9, 11, 6, 7, 10, 2, 1, -1 ],
       [ 7, 11, 6, 2, 5, 10, 2, 4, 5, 2, 0, 4, -1 ],
       [ 8, 4, 7, 5, 10, 6, 3, 11, 2, -1 ],
       [ 9, 4, 5, 7, 10, 6, 7, 1, 10, 7, 3, 1, -1 ],
       [ 10, 6, 5, 7, 8, 4, 1, 9, 0, -1 ],
       [ 4, 3, 0, 7, 3, 4, 6, 5, 10, -1 ],
       [ 10, 6, 5, 8, 4, 7, -1 ],
       [ 9, 6, 5, 9, 11, 6, 9, 8, 11, -1 ],
       [ 11, 6, 3, 3, 6, 0, 0, 6, 5, 0, 5, 9, -1 ],
       [ 11, 6, 5, 11, 5, 0, 5, 1, 0, 8, 11, 0, -1 ],
       [ 11, 6, 3, 6, 5, 3, 5, 1, 3, -1 ],
       [ 9, 8, 5, 8, 3, 2, 5, 8, 2, 5, 2, 6, -1 ],
       [ 5, 9, 6, 9, 0, 6, 0, 2, 6, -1 ],
       [ 1, 6, 5, 2, 6, 1, 3, 0, 8, -1 ],
       [ 1, 6, 5, 2, 6, 1, -1 ],
       [ 2, 1, 10, 9, 6, 5, 9, 11, 6, 9, 8, 11, -1 ],
       [ 9, 0, 1, 3, 11, 2, 5, 10, 6, -1 ],
       [ 11, 0, 8, 2, 0, 11, 10, 6, 5, -1 ],
       [ 3, 11, 2, 5, 10, 6, -1 ],
       [ 1, 8, 3, 9, 8, 1, 5, 10, 6, -1 ],
       [ 6, 5, 10, 0, 1, 9, -1 ],
       [ 8, 3, 0, 5, 10, 6, -1 ],
       [ 6, 5, 10, -1 ],
       [ 10, 5, 6, -1 ],
       [ 0, 3, 8, 6, 10, 5, -1 ],
       [ 10, 5, 6, 9, 1, 0, -1 ],
       [ 3, 8, 1, 1, 8, 9, 6, 10, 5, -1 ],
       [ 2, 11, 3, 6, 10, 5, -1 ],
       [ 8, 0, 11, 11, 0, 2, 5, 6, 10, -1 ],
       [ 1, 0, 9, 2, 11, 3, 6, 10, 5, -1 ],
       [ 5, 6, 10, 11, 1, 2, 11, 9, 1, 11, 8, 9, -1 ],
       [ 5, 6, 1, 1, 6, 2, -1 ],
       [ 5, 6, 1, 1, 6, 2, 8, 0, 3, -1 ],
       [ 6, 9, 5, 6, 0, 9, 6, 2, 0, -1 ],
       [ 6, 2, 5, 2, 3, 8, 5, 2, 8, 5, 8, 9, -1 ],
       [ 3, 6, 11, 3, 5, 6, 3, 1, 5, -1 ],
       [ 8, 0, 1, 8, 1, 6, 1, 5, 6, 11, 8, 6, -1 ],
       [ 11, 3, 6, 6, 3, 5, 5, 3, 0, 5, 0, 9, -1 ],
       [ 5, 6, 9, 6, 11, 9, 11, 8, 9, -1 ],
       [ 5, 6, 10, 7, 4, 8, -1 ],
       [ 0, 3, 4, 4, 3, 7, 10, 5, 6, -1 ],
       [ 5, 6, 10, 4, 8, 7, 0, 9, 1, -1 ],
       [ 6, 10, 5, 1, 4, 9, 1, 7, 4, 1, 3, 7, -1 ],
       [ 7, 4, 8, 6, 10, 5, 2, 11, 3, -1 ],
       [ 10, 5, 6, 4, 11, 7, 4, 2, 11, 4, 0, 2, -1 ],
       [ 4, 8, 7, 6, 10, 5, 3, 2, 11, 1, 0, 9, -1 ],
       [ 1, 2, 10, 11, 7, 6, 9, 5, 4, -1 ],
       [ 2, 1, 6, 6, 1, 5, 8, 7, 4, -1 ],
       [ 0, 3, 7, 0, 7, 4, 2, 1, 6, 1, 5, 6, -1 ],
       [ 8, 7, 4, 6, 9, 5, 6, 0, 9, 6, 2, 0, -1 ],
       [ 7, 2, 3, 6, 2, 7, 5, 4, 9, -1 ],
       [ 4, 8, 7, 3, 6, 11, 3, 5, 6, 3, 1, 5, -1 ],
       [ 5, 0, 1, 4, 0, 5, 7, 6, 11, -1 ],
       [ 9, 5, 4, 6, 11, 7, 0, 8, 3, -1 ],
       [ 11, 7, 6, 9, 5, 4, -1 ],
       [ 6, 10, 4, 4, 10, 9, -1 ],
       [ 6, 10, 4, 4, 10, 9, 3, 8, 0, -1 ],
       [ 0, 10, 1, 0, 6, 10, 0, 4, 6, -1 ],
       [ 6, 10, 1, 6, 1, 8, 1, 3, 8, 4, 6, 8, -1 ],
       [ 9, 4, 10, 10, 4, 6, 3, 2, 11, -1 ],
       [ 2, 11, 8, 2, 8, 0, 6, 10, 4, 10, 9, 4, -1 ],
       [ 11, 3, 2, 0, 10, 1, 0, 6, 10, 0, 4, 6, -1 ],
       [ 6, 8, 4, 11, 8, 6, 2, 10, 1, -1 ],
       [ 4, 1, 9, 4, 2, 1, 4, 6, 2, -1 ],
       [ 3, 8, 0, 4, 1, 9, 4, 2, 1, 4, 6, 2, -1 ],
       [ 6, 2, 4, 4, 2, 0, -1 ],
       [ 3, 8, 2, 8, 4, 2, 4, 6, 2, -1 ],
       [ 4, 6, 9, 6, 11, 3, 9, 6, 3, 9, 3, 1, -1 ],
       [ 8, 6, 11, 4, 6, 8, 9, 0, 1, -1 ],
       [ 11, 3, 6, 3, 0, 6, 0, 4, 6, -1 ],
       [ 8, 6, 11, 4, 6, 8, -1 ],
       [ 10, 7, 6, 10, 8, 7, 10, 9, 8, -1 ],
       [ 3, 7, 0, 7, 6, 10, 0, 7, 10, 0, 10, 9, -1 ],
       [ 6, 10, 7, 7, 10, 8, 8, 10, 1, 8, 1, 0, -1 ],
       [ 6, 10, 7, 10, 1, 7, 1, 3, 7, -1 ],
       [ 3, 2, 11, 10, 7, 6, 10, 8, 7, 10, 9, 8, -1 ],
       [ 2, 9, 0, 10, 9, 2, 6, 11, 7, -1 ],
       [ 0, 8, 3, 7, 6, 11, 1, 2, 10, -1 ],
       [ 7, 6, 11, 1, 2, 10, -1 ],
       [ 2, 1, 9, 2, 9, 7, 9, 8, 7, 6, 2, 7, -1 ],
       [ 2, 7, 6, 3, 7, 2, 0, 1, 9, -1 ],
       [ 8, 7, 0, 7, 6, 0, 6, 2, 0, -1 ],
       [ 7, 2, 3, 6, 2, 7, -1 ],
       [ 8, 1, 9, 3, 1, 8, 11, 7, 6, -1 ],
       [ 11, 7, 6, 1, 9, 0, -1 ],
       [ 6, 11, 7, 0, 8, 3, -1 ],
       [ 11, 7, 6, -1 ],
       [ 7, 11, 5, 5, 11, 10, -1 ],
       [ 10, 5, 11, 11, 5, 7, 0, 3, 8, -1 ],
       [ 7, 11, 5, 5, 11, 10, 0, 9, 1, -1 ],
       [ 7, 11, 10, 7, 10, 5, 3, 8, 1, 8, 9, 1, -1 ],
       [ 5, 2, 10, 5, 3, 2, 5, 7, 3, -1 ],
       [ 5, 7, 10, 7, 8, 0, 10, 7, 0, 10, 0, 2, -1 ],
       [ 0, 9, 1, 5, 2, 10, 5, 3, 2, 5, 7, 3, -1 ],
       [ 9, 7, 8, 5, 7, 9, 10, 1, 2, -1 ],
       [ 1, 11, 2, 1, 7, 11, 1, 5, 7, -1 ],
       [ 8, 0, 3, 1, 11, 2, 1, 7, 11, 1, 5, 7, -1 ],
       [ 7, 11, 2, 7, 2, 9, 2, 0, 9, 5, 7, 9, -1 ],
       [ 7, 9, 5, 8, 9, 7, 3, 11, 2, -1 ],
       [ 3, 1, 7, 7, 1, 5, -1 ],
       [ 8, 0, 7, 0, 1, 7, 1, 5, 7, -1 ],
       [ 0, 9, 3, 9, 5, 3, 5, 7, 3, -1 ],
       [ 9, 7, 8, 5, 7, 9, -1 ],
       [ 8, 5, 4, 8, 10, 5, 8, 11, 10, -1 ],
       [ 0, 3, 11, 0, 11, 5, 11, 10, 5, 4, 0, 5, -1 ],
       [ 1, 0, 9, 8, 5, 4, 8, 10, 5, 8, 11, 10, -1 ],
       [ 10, 3, 11, 1, 3, 10, 9, 5, 4, -1 ],
       [ 3, 2, 8, 8, 2, 4, 4, 2, 10, 4, 10, 5, -1 ],
       [ 10, 5, 2, 5, 4, 2, 4, 0, 2, -1 ],
       [ 5, 4, 9, 8, 3, 0, 10, 1, 2, -1 ],
       [ 2, 10, 1, 4, 9, 5, -1 ],
       [ 8, 11, 4, 11, 2, 1, 4, 11, 1, 4, 1, 5, -1 ],
       [ 0, 5, 4, 1, 5, 0, 2, 3, 11, -1 ],
       [ 0, 11, 2, 8, 11, 0, 4, 9, 5, -1 ],
       [ 5, 4, 9, 2, 3, 11, -1 ],
       [ 4, 8, 5, 8, 3, 5, 3, 1, 5, -1 ],
       [ 0, 5, 4, 1, 5, 0, -1 ],
       [ 5, 4, 9, 3, 0, 8, -1 ],
       [ 5, 4, 9, -1 ],
       [ 11, 4, 7, 11, 9, 4, 11, 10, 9, -1 ],
       [ 0, 3, 8, 11, 4, 7, 11, 9, 4, 11, 10, 9, -1 ],
       [ 11, 10, 7, 10, 1, 0, 7, 10, 0, 7, 0, 4, -1 ],
       [ 3, 10, 1, 11, 10, 3, 7, 8, 4, -1 ],
       [ 3, 2, 10, 3, 10, 4, 10, 9, 4, 7, 3, 4, -1 ],
       [ 9, 2, 10, 0, 2, 9, 8, 4, 7, -1 ],
       [ 3, 4, 7, 0, 4, 3, 1, 2, 10, -1 ],
       [ 7, 8, 4, 10, 1, 2, -1 ],
       [ 7, 11, 4, 4, 11, 9, 9, 11, 2, 9, 2, 1, -1 ],
       [ 1, 9, 0, 4, 7, 8, 2, 3, 11, -1 ],
       [ 7, 11, 4, 11, 2, 4, 2, 0, 4, -1 ],
       [ 4, 7, 8, 2, 3, 11, -1 ],
       [ 9, 4, 1, 4, 7, 1, 7, 3, 1, -1 ],
       [ 7, 8, 4, 1, 9, 0, -1 ],
       [ 3, 4, 7, 0, 4, 3, -1 ],
       [ 7, 8, 4, -1 ],
       [ 11, 10, 8, 8, 10, 9, -1 ],
       [ 0, 3, 9, 3, 11, 9, 11, 10, 9, -1 ],
       [ 1, 0, 10, 0, 8, 10, 8, 11, 10, -1 ],
       [ 10, 3, 11, 1, 3, 10, -1 ],
       [ 3, 2, 8, 2, 10, 8, 10, 9, 8, -1 ],
       [ 9, 2, 10, 0, 2, 9, -1 ],
       [ 8, 3, 0, 10, 1, 2, -1 ],
       [ 2, 10, 1, -1 ],
       [ 2, 1, 11, 1, 9, 11, 9, 8, 11, -1 ],
       [ 11, 2, 3, 9, 0, 1, -1 ],
       [ 11, 0, 8, 2, 0, 11, -1 ],
       [ 3, 11, 2, -1 ],
       [ 1, 8, 3, 9, 8, 1, -1 ],
       [ 1, 9, 0, -1 ],
       [ 8, 3, 0, -1 ],
       [ -1 ],
   ]