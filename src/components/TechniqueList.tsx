import React from 'react';
import { useNavigate } from 'react-router-dom';
import { techniques } from '../data/techniques';

const TechniqueList: React.FC = () => {
  const navigate = useNavigate();

  const handleTechniqueClick = (techniqueId: string) => {
    navigate(`/technique/${techniqueId}`);
  };

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Submission': '#ff6b6b',
      'Guard': '#4ecdc4',
      'Takedown': '#45b7d1',
      'Escape': '#96ceb4',
      'Takedown Defenses': '#feca57',
      'Positions': '#ff9ff3',
      'Sweeps': '#54a0ff'
    };
    return colors[category] || '#95a5a6';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>BJJ Techniques</h1>
        <p>Master the art of Brazilian Jiu-Jitsu with these fundamental techniques</p>
      </div>
      
      <div className="technique-grid">
        {techniques.map((technique) => (
          <div
            key={technique.id}
            className="technique-card"
            onClick={() => handleTechniqueClick(technique.id)}
          >
            <div className="technique-header">
              <h3>{technique.name}</h3>
              <span 
                className="category-label"
                style={{ backgroundColor: getCategoryColor(technique.category) }}
              >
                {technique.category}
              </span>
            </div>
            <p>{technique.description.substring(0, 150)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechniqueList; 