import { useEffect } from "react";

function NotFound() {
  useEffect(() => {
    document.title = "Not found";
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '10rem', margin: 0, fontWeight: 'bold' }}>404</h1>
      <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Oops! Sahifa topilmadi.</p>
      <button
        style={{
          padding: '12px 30px',
          fontSize: '1rem',
          color: '#764ba2',
          backgroundColor: '#fff',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'background-color 0.3s ease'
        }}
        onClick={() => window.location.href = '/'}
        onMouseEnter={e => e.target.style.backgroundColor = '#e0d4f7'}
        onMouseLeave={e => e.target.style.backgroundColor = '#fff'}
      >
        Bosh sahifaga qaytish
      </button>
    </div>
  );
}

export default NotFound;
