import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Outlet } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Products from './Pages/Products'
import Contact from './Pages/Contact'
import RoleSelector from './Components/RoleSelector'
import AdminAuth from './Pages/AdminAuth'
import ClientAuth from './Pages/ClientAuth'


export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Outlet />}>
      <Route index element={<Home />} />
      <Route path="/about" element={<About/>} />
      <Route path="/product" element={<Products/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/roleselector" element={<RoleSelector/>} />
      <Route path="/adminform" element={<AdminAuth/>} />
      <Route path="/clientform" element={<ClientAuth/>} />

    </Route>
  ))
  return (
    <div>
       <RouterProvider router={router} />
    </div>
  )
}
