
import './App.css'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/Home'
import CreateBlog from './pages/CreateBlog'
import SingleBlog from './pages/SingleBlog'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/create-blog' element={<CreateBlog/>} />
        <Route path="/create-blog/:id" element={<CreateBlog />} />
        <Route path="/blogs/:id" element={<SingleBlog />} />
      </Routes>
    </Router>
  )
}

export default App
