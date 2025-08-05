import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { techniques } from '../data/techniques';

const ContentMenu: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories and count techniques in each
  const categories = Array.from(new Set(techniques.map(t => t.category))).map(category => ({
    name: category,
    count: techniques.filter(t => t.category === category).length,
    color: getCategoryColor(category)
  }));

  // Filter techniques based on search term
  const filteredTechniques = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return techniques.filter(technique =>
      technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technique.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technique.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCategoryClick = (category: string) => {
    // Convert category name to URL-friendly format
    const urlCategory = getCategoryUrl(category);
    navigate(`/category/${urlCategory}`);
  };

  const handleTechniqueClick = (techniqueId: string) => {
    navigate(`/technique/${techniqueId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove auto-direct - just show all results
    // The search results are already displayed via the filteredTechniques state
  };

  // Convert category name to URL-friendly format
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

  // Category colors - Updated for the 6 categories from Google Sheet
  function getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Submission': '#ff6b6b',
      'Guard': '#4ecdc4',
      'Takedown': '#45b7d1',
      'Escape (Submission Escapes / Counters)': '#96ceb4',
      'Takedown Defenses / Escapes': '#feca57',
      'Guard Escapes / Pass-Outs': '#ff9ff3'
    };
    return colors[category] || '#95a5a6';
  }

  return (
    <div className="container">
      <div className="header">
        <h1>BJJ Techniques</h1>
        <p>Choose a category to explore Brazilian Jiu-Jitsu techniques</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search techniques, categories, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </div>
        </form>

        {/* Search Results */}
        {searchTerm.trim() && (
          <div className="search-results">
            <h3>Search Results for "{searchTerm}"</h3>
            {filteredTechniques.length > 0 ? (
              <div className="search-results-grid">
                {filteredTechniques.map((technique) => (
                  <div
                    key={technique.id}
                    className="search-result-card"
                    onClick={() => handleTechniqueClick(technique.id)}
                  >
                    <div className="search-result-header">
                      <h4>{technique.name}</h4>
                      <span 
                        className="category-label"
                        style={{ backgroundColor: getCategoryColor(technique.category) }}
                      >
                        {technique.category}
                      </span>
                    </div>
                    <p>{technique.description.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No techniques found for "{searchTerm}"</p>
                <p>Try searching for different terms or browse by category below</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-card"
            onClick={() => handleCategoryClick(category.name)}
            style={{ 
              background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
              boxShadow: `0 8px 25px ${category.color}40`
            }}
          >
            <h2>{category.name}</h2>
            <p className="technique-count">{category.count} Techniques</p>
            <div className="category-icon">
              {category.name === 'Submission' && '🥋'}
              {category.name === 'Guard' && '🛡️'}
              {category.name === 'Takedown' && '⚡'}
              {category.name === 'Escape (Submission Escapes / Counters)' && '🔄'}
              {category.name === 'Takedown Defenses / Escapes' && '🛡️'}
              {category.name === 'Guard Escapes / Pass-Outs' && '🚪'}
            </div>
          </div>
        ))}
      </div>

      <div className="stats-section">
        <div className="stats-card">
          <h3>📊 Total Techniques</h3>
          <p className="stats-number">{techniques.length}</p>
        </div>
        <div className="stats-card">
          <h3>🏷️ Categories</h3>
          <p className="stats-number">{categories.length}</p>
        </div>
      </div>
    </div>
  );
};

export default ContentMenu; 