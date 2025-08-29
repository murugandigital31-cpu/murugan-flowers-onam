import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignerPage from './pages/DesignerPage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import './styles/App.css';

function App() {
  const [designResult, setDesignResult] = useState(null);
  
  console.log('App component rendering');

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/designer" 
              element={<DesignerPage setDesignResult={setDesignResult} />}
            />
            <Route 
              path="/result" 
              element={<ResultPage designResult={designResult} />} 
            />
            <Route 
              path="/admin" 
              element={<AdminPage />} 
            />
            <Route 
              path="/contact" 
              element={<ContactPage />} 
            />
          </Routes>
        </main>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;