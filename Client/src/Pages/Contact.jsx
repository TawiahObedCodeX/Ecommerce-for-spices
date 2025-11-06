import React from 'react'
import Navbar from '../Components/Navbar'

export default function Contact() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p>Get in touch with us for inquiries.</p>
      </div>
    </div>
  )
}