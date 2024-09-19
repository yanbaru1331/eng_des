import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import UserPage from './UserPage';
import Top from './Top';
import Weight from './Chart';

function App() {
  const message = 'こんにちは React!!';

  useEffect(() => {
    fetch(`http://localhost:3000/test-cors`)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error("CORS test failed:", error));
  }, []);

  return (
    <Router>
      <div className="container mx-auto px-4 py-8">  {/* Tailwind classes for layout */}
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
