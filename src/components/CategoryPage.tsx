import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, Technique } from '../services/api';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert URL parameter back to category name with better handling
  const getCategoryNameFromUrl = (urlCategory: string | undefined): string => {
    if (!urlCategory) return '';
    
    // Handle the specific category mappings
    const categoryMappings: { [key: string]: string } = {
      'submission': 'Submission',
      'guard': 'Guard',
      'takedown': 'Takedown',
      'escape-submission-escapes-counters': 'Escape (Submission Escapes / Counters)',
      'takedown-defenses-escapes': 'Takedown Defenses / Escapes',
      'guard-escapes-pass-outs': 'Guard Escapes / Pass-Outs'
    };
    
    return categoryMappings[urlCategory] || urlCategory;
  };

  const categoryName = getCategoryNameFromUrl(category);

  // Fetch techniques for this category
  useEffect(() => {
    const fetchTechniques = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTechniquesByCategory(categoryName);
        setTechniques(data);
        setError(null);
      } catch (err) {
        setError('Failed to load techniques for this category. Please try again later.');
        console.error('Error fetching techniques:', err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchTechniques();
    }
  }, [categoryName]);

  // Filter techniques by category using exact match
  const categoryTechniques = techniques.filter(t => t.category === categoryName);

  const handleTechniqueClick = (techniqueId: string) => {
    navigate(`/technique/${techniqueId}`);
  };

  const handleBackToMenu = () => {
    navigate('/');
  };

  // Category colors - Updated for the 6 categories from Google Sheet
  const getCategoryColor = (categoryName: string) => {
    const colors: { [key: string]: string } = {
      'Submission': '#ff6b6b',
      'Guard': '#4ecdc4',
      'Takedown': '#45b7d1',
      'Escape (Submission Escapes / Counters)': '#96ceb4',
      'Takedown Defenses / Escapes': '#feca57',
      'Guard Escapes / Pass-Outs': '#ff9ff3'
    };
    return colors[categoryName] || '#95a5a6';
  };

  if (loading) {
    return (
      <div className="container">
        <button className="btn back-btn" onClick={handleBackToMenu}>
          ← Back to Main Menu
        </button>
        <div className="loading">
          <h2>Loading techniques...</h2>
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

  if (categoryTechniques.length === 0) {
    return (
      <div className="container">
        <button className="btn back-btn" onClick={handleBackToMenu}>
          ← Back to Main Menu
        </button>
        <div className="card">
          <h2>Category Not Found</h2>
          <p>The category "{categoryName}" doesn't exist or has no techniques.</p>
          <p>URL parameter: {category}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="btn back-btn" onClick={handleBackToMenu}>
        ← Back to Main Menu
      </button>

      <div className="header">
        <div className="category-header">
          <h1>{categoryName}</h1>
          <span 
            className="category-badge"
            style={{ backgroundColor: getCategoryColor(categoryName) }}
          >
            {categoryTechniques.length} Techniques
          </span>
        </div>
        <p>Explore {categoryName.toLowerCase()} techniques in Brazilian Jiu-Jitsu</p>
      </div>

      <div className="technique-grid">
        {categoryTechniques.map((technique) => (
          <div
            key={technique.id}
            className="technique-card"
            onClick={() => handleTechniqueClick(technique.technique_id)}
          >
            <div className="technique-header">
              <h3>{technique.name}</h3>
              <span 
                className="category-label"
                style={{ backgroundColor: getCategoryColor(categoryName) }}
              >
                {technique.category}
              </span>
            </div>
            <p>{technique.description.substring(0, 150)}...</p>
          </div>
        ))}
      </div>

      <div className="category-summary">
        <div className="summary-card">
          <h3>📚 About {categoryName}</h3>
          <p>
            {categoryName} techniques are fundamental to Brazilian Jiu-Jitsu. 
            Master these techniques to improve your BJJ game and become a more 
            well-rounded practitioner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 