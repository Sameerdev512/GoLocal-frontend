import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Dashboard from '../pages/Dashboard'
import About from '../pages/About'
import ContactUs from '../pages/ContactUs'

const Router = () => {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Dashboard/>}></Route>
    <Route path="/about" element={<About/>}></Route>
    <Route path="/contact" element={<ContactUs/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default Router
