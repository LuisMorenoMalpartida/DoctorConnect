import React from 'react';
import { usePatientData } from '../hooks/usePatientData';
import './Dashboard.css';

const Dashboard = () => {
  const { patients, appointments, stats } = usePatientData();

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <h3>Welcome, Dr. Smith</h3>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h4>{patients.length} Active patients</h4>
        </div>
        <div className="stat-card">
          <h4>{appointments.filter(a => new Date(a.date) > new Date()).length} Appointments this month</h4>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="left-panel">
          <div className="chart-container">
            <h4>Consultations</h4>
            <div className="consultation-chart">
              <div className="chart-bars">
                <div className="bar" style={{height: '60%'}}><span>Jan</span></div>
                <div className="bar" style={{height: '40%'}}><span>Feb</span></div>
                <div className="bar" style={{height: '80%'}}><span>Mar</span></div>
                <div className="bar" style={{height: '30%'}}><span>Apr</span></div>
                <div className="bar" style={{height: '70%'}}><span>May</span></div>
                <div className="bar" style={{height: '50%'}}><span>Jun</span></div>
              </div>
            </div>
          </div>
          
          <div className="common-illnesses">
            <h4>Most common illnesses</h4>
            <ul>
              <li>Diabetes</li>
              <li>Asthma</li>
              <li>Hypertension</li>
            </ul>
          </div>
          
          <div className="prediction-section">
            <h4>Patient prediction</h4>
            <div className="risk-levels">
              <span className="risk low">Low</span>
              <span className="risk medium">Medium</span>
              <span className="risk high">High</span>
            </div>
          </div>
        </div>
        
        <div className="right-panel">
          <div className="upcoming-appointments">
            <h4>Upcoming appointments</h4>
            {appointments.slice(0, 3).map(app => (
              <div key={app.id} className="appointment-card">
                <div className="patient-info">
                  <h5>{app.patientName}</h5>
                  <p>{app.date} {app.time}</p>
                </div>
                <button className="view-btn">View</button>
              </div>
            ))}
            <button className="view-all-btn">View all patients</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;