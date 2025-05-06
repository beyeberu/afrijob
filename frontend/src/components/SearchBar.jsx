import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isTyping, setIsTyping] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        onSearch(searchTerm);
      } else {
        onSearch('');
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search by job title, company, or skills..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsTyping(true);
        }}
        onKeyPress={handleKeyPress}
        onBlur={() => setIsTyping(false)}
      />
      <div className="search-icons">
        {searchTerm && (
          <FaTimes 
            className="clear-icon" 
            onClick={handleClear}
            aria-label="Clear search"
          />
        )}
        <FaSearch 
          className={`search-icon ${isTyping ? 'pulse' : ''}`} 
          onClick={() => searchTerm.trim() && onSearch(searchTerm)}
          aria-label="Search"
        />
      </div>
    </div>
  );
};

export default SearchBar;