import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login';
import UserPage from './UserPage';

function App() {
  const message = 'こんにちは React!!';
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className='App'>
            <p>{message}</p>
          </div>
        } />
        <Route path="/login" element={
          <Login onSubmit={(user, password) => console.log('ログインユーザ', user, 'とパスワード', password)} />
        } />
        <Route path="/:userid" element={
          <UserPage />
        } />
      </Routes>
    </Router>
  )
}

export default App;
