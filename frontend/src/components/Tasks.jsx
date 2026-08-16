import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch tasks and projects
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
      } catch {
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const updateTaskStatus = async (taskId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_BASE_URL}/tasks/${taskId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status } : task));
    } catch (error) {
      alert('Error updating task');
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await axios.post(`${API_BASE_URL}/projects`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowProjectForm(false);
      const projectsRes = await axios.get(`${API_BASE_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } });
      setProjects(projectsRes.data);
      alert('Project created successfully');
    } catch (error) {
      alert('Error creating project');
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await axios.post(`${API_BASE_URL}/tasks`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      // Refresh tasks
      const response = await axios.get(`${API_BASE_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(response.data);
    } catch (error) {
      alert('Error creating task');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Tasks</h1>
        <div>
          <button onClick={() => navigate('/dashboard')} style={{ marginRight: '10px', padding: '8px 16px' }}>Dashboard</button>
          <button onClick={() => setShowProjectForm(!showProjectForm)} style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '3px' }}>
            {showProjectForm ? 'Cancel Project' : 'Add Project'}
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}>
            {showForm ? 'Cancel' : 'Add Task'}
          </button>
        </div>
      </header>

      {showProjectForm && (
        <form onSubmit={createProject} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2>Create Project</h2>
          <div style={{ marginBottom: '10px' }}>
            <input name="name" placeholder="Project Name" required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea name="description" placeholder="Project Description" style={{ width: '100%', padding: '8px' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>Create Project</button>
        </form>
      )}

      {showForm && (
        <form onSubmit={createTask} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <div style={{ marginBottom: '10px' }}>
            <input name="title" placeholder="Task Title" required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <textarea name="description" placeholder="Description" style={{ width: '100%', padding: '8px' }}></textarea>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <select name="project_id" required style={{ width: '100%', padding: '8px' }}>
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input name="due_date" type="date" style={{ width: '100%', padding: '8px' }} />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>Create Task</button>
        </form>
      )}

      <div>
        {tasks.map(task => (
          <div key={task.id} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Project: {task.project_name} | Status: {task.status} | Due: {task.due_date || 'No due date'}</p>
              {task.assignee_name && <p>Assigned to: {task.assignee_name}</p>}
            </div>
            <div>
              <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)} style={{ padding: '5px' }}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;