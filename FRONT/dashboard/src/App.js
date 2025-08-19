// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Statistics from './components/Statistics';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'patients': return <Patients />;
      case 'appointments': return <Appointments />;
      case 'statistics': return <Statistics />;
      default: return <Dashboard />;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // En una aplicación real, redirigiríamos al login
    alert('Sesión cerrada. En una app real, redirigiríamos al login.');
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>DoctorConnect</h2>
        <div className="login-form">
          <h3>Iniciar Sesión</h3>
          <input type="text" placeholder="Usuario" />
          <input type="password" placeholder="Contraseña" />
          <button onClick={() => setIsLoggedIn(true)}>Ingresar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>DoctorConnect</h1>
      </header>
      
      <nav className="sidebar">
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveTab('dashboard')}>Dashboard</li>
          <li className={activeTab === 'patients' ? 'active' : ''} 
              onClick={() => setActiveTab('patients')}>Patients</li>
          <li className={activeTab === 'appointments' ? 'active' : ''} 
              onClick={() => setActiveTab('appointments')}>Appointments</li>
          <li className={activeTab === 'statistics' ? 'active' : ''} 
              onClick={() => setActiveTab('statistics')}>Statistics</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;