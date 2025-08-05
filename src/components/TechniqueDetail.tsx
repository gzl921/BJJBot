import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, Technique } from '../services/api';

const TechniqueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [technique, setTechnique] = useState<Technique | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch technique from API
  useEffect(() => {
    const fetchTechnique = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiService.getTechnique(id);
        setTechnique(data);
        setError(null);
      } catch (err) {
        setError('Failed to load technique. Please try again later.');
        console.error('Error fetching technique:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnique();
  }, [id]);

  const handleBackToCategory = () => {
    if (technique) {
      // Convert category name to URL-friendly format using the same mapping
      const urlCategory = getCategoryUrl(technique.category);
      navigate(`/category/${urlCategory}`);
    }
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  // Convert category name to URL-friendly format - same as ContentMenu
  const getCategoryUrl = (categoryName: string): string => {
    const urlMappings: { [key: string]: string } = {
      'Submission': 'submission',
      'Guard': 'guard',
      'Takedown': 'takedown',
      'Escape (Submission Escapes / Counters)': 'escape-submission-escapes-counters',
      'Takedown Defenses / Escapes': 'takedown-defenses-escapes',
      'Guard Escapes / Pass-Outs': 'guard-escapes-pass-outs'
    };
    
    return urlMappings[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="container">
        <button className="btn back-btn" onClick={handleBackToMenu}>
          ← Back to Main Menu
        </button>
        <div className="loading">
          <h2>Loading technique...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <button className="btn back-btn" onClick={handleBackToMenu}>
          ← Back to Main Menu
        </button>
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!technique) {
    return (
      <div className="container">
        <button className="btn back-btn" onClick={handleBackToMenu}>
          ← Back to Main Menu
        </button>
        <div className="card">
          <h2>Technique Not Found</h2>
          <p>The technique you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="navigation-buttons">
        <button className="btn back-btn" onClick={handleBackToCategory}>
          ← Back to {technique.category}
        </button>
        <button className="btn btn-secondary" onClick={handleBackToMenu}>
          🏠 Main Menu
        </button>
      </div>

      <div className="header">
        <h1>{technique.name}</h1>
        <p><strong>Category:</strong> {technique.category}</p>
      </div>

      <div className="section">
        <div className="card">
          <h2>Description</h2>
          <p>{technique.description}</p>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2>Best Response</h2>
          <p>{technique.best_response}</p>
        </div>
      </div>
    </div>
  );
};

export default TechniqueDetail; 