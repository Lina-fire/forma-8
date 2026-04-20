import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Pagination({ totalProducts, productsPerPage, paginate }) {
  const { theme } = useTheme();
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav style={{ marginTop: '30px' }}>
      <ul className="pagination" style={{ justifyContent: 'center' }}>
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              style={{
                background: theme === 'light' ? '#fff' : '#2d2d2d',
                color: theme === 'light' ? '#1a4b6d' : '#a8d8ff',
                border: theme === 'light' ? '1px solid #1a4b6d' : '1px solid #a8d8ff',
                margin: '0 5px',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme === 'light' ? '#1a4b6d' : '#a8d8ff';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme === 'light' ? '#fff' : '#2d2d2d';
                e.target.style.color = theme === 'light' ? '#1a4b6d' : '#a8d8ff';
              }}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
