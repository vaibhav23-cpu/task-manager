import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

function Dashboard() {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get(`${API_BASE_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setStats(response.data))
    .catch(() => navigate('/login'));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Team Task Manager</h1>
        <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}>Logout</button>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Total Projects</h3>
          <p style={{ fontSize: '2em' }}>{stats.total_projects || 0}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: '2em' }}>{stats.total_tasks || 0}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Completed Tasks</h3>
          <p style={{ fontSize: '2em' }}>{stats.completed_tasks || 0}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Overdue Tasks</h3>
          <p style={{ fontSize: '2em', color: 'red' }}>{stats.overdue_tasks || 0}</p>
        </div>
      </div>
      
      <nav>
        <Link to="/tasks" style={{ marginRight: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '3px' }}>View Tasks</Link>
      </nav>
    </div>
  );
}

export default Dashboard;