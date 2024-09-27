import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Login';
import UserPage from './UserPage';
import Top from './Top';
import Weight from './Chart';
import ViewChart from './viewChart';

function App() {
  useEffect(() => {
    fetch(`http://localhost:3000/test-cors`)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("CORS test failed:", error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Top />
        } />
        <Route path="/login" element={
          <Login onSubmit={(user, password) => console.log('ログインユーザ', user, 'とパスワード', password)} />
        } />
        <Route path="/userpage/:userid" element={
          <UserPage />
        } />
        <Route path="/userpage/:userid/chart" element={
          <Weight />
        } />
        <Route path="/userpage/:userid/chart/view" element={
          <ViewChart />
        } />
        {/* <Route path="/userpage/:userid/chart/settings" element={
          <Weight />
        } /> */}
      </Routes>
    </Router>
  )
}

export default App;
