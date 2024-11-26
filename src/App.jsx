import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CustomShader from './pages/CustomShader'
import MarchingCubes3 from './pages/MarchingCubes3'

const App = () => {
  return (
    <div className='app'>
      <Routes>
        <Route path='/cs' element= { <CustomShader/> }/>
        <Route path='/mc3' element= { <MarchingCubes3/> } /> 
      </Routes>
    </div>
  )
}

export default App