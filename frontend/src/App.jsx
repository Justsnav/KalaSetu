import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing'
import AuthPage from './pages/AuthPage'
// import Signup from './pages/Signup'
// import Login from './pages/Login'

const App = () => {
  return (
    <Routes> 
      <Route path="/" element={<LandingPage />} />
      <Route path ="/auth" element={<AuthPage />} />
      {/* <Route path="/signup/:role" element={<Signup />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  )
}

export default App