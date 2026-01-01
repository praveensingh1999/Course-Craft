

import './App.css'
import Home from "./pages/Home"
import { Route, Routes } from 'react-router-dom'

function App() {
 

  return (
    <div className="w-screen min-h-screen bg-[#000814] flex flex-col font-inter">
      
    <Routes>
     <Route path="/" element={<Home/>}/>
     </Routes>
     
    </div>
  )
}

export default App
