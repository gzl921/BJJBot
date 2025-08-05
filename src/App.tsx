import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContentMenu from './components/ContentMenu';
import CategoryPage from './components/CategoryPage';
import TechniqueDetail from './components/TechniqueDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ContentMenu />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/technique/:id" element={<TechniqueDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 