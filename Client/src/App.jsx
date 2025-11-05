import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Products from './Pages/Products'
import Contact from './Pages/Contact'
import HeroSection from './Components/HeroSection'

export default function App() {
  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Home />}>
      <Route index element={<HeroSection />} />
      <Route path="/about" element={<About/>} />
      <Route path="/product" element={<Products/>} />
      <Route path="/contact" element={<Contact/>} />
    </Route>
  ))
  return (
    <div>
       <RouterProvider router={router} />
    </div>
  )
}
