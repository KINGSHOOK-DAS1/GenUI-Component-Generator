import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Nopage from './pages/Nopage';

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App