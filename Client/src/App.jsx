import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Products from './Pages/Products'
import Contact from './Pages/Contact'


export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About/>} />
      <Route path="/product" element={<Products/>} />
      <Route path="/contact" element={<Contact/>} />
    </>
  ))
  return (
    <div>
       <RouterProvider router={router} />
    </div>
  )
}
