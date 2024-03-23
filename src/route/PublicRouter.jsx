import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from '../auth/Login'

const PublicRouter = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default PublicRouter