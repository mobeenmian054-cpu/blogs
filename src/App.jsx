import Navbar from './Components/Navbar'
import Home from './Components/Home'
import Contact from './Components/Contact'
import About from './Components/About'
import Login from './Components/Login'
import BlogDetail from './Components/BlogDetail'
import Register from './Components/Register'
import CreateBlog from './Components/CreateBlog'

import { Route, Routes } from 'react-router'
import ShowBlogs from './Components/showblogs'
const App = () => {
  return (
    <div>
      <Navbar />

      <Routes >

        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/create' element={<CreateBlog />} />
        <Route path='/blog/:id' element={<BlogDetail />} />
         <Route path='/showblogs' element={<ShowBlogs />} />
       


      </Routes>

    </div>
  )
}

export default App