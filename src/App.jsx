

import './App.css'
import Home from "./pages/Home"
import { Route, Routes } from 'react-router-dom'
 import Navbar from './components/common/Navbar'

function App() {
 
console.log("inside app")
  return (
    <div className="w-screen min-h-screen bg-[#0C2B4E] flex flex-col font-inter">
      <Navbar/>
    <Routes>
     <Route path="/" element={<Home/>}/>
     </Routes>
   
    
    
     
    </div>
  )
}

export default App
