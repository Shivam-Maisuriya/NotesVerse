import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </>
  )
}

export default App
