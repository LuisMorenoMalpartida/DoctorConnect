// components/Statistics.js
import React from 'react';
import { usePatientData } from '../hooks/usePatientData';
import './Statistics.css';

const Statistics = () => {
  const { patients, stats } = usePatientData();

  const highRiskPatients = patients.filter(p => p.riskLevel === 'High');
  const mediumRiskPatients = patients.filter(p => p.riskLevel === 'Medium');
  const lowRiskPatients = patients.filter(p => p.riskLevel === 'Low');

  return (
    <div className="statistics">
      <h2>Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Recurrence Prediction</h4>
          <div className="risk-patients">
            <h5>High Risk Patients</h5>
            {highRiskPatients.slice(0, 4).map(patient => (
              <div key={patient.id} className="risk-patient">
                <span>{patient.name}</span>
                <span className="risk-percentage">{Math.floor(Math.random() * 20) + 10}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="stat-card">
          <h4>Patient Status</h4>
          <div className="status-counts">
            <div className="status-item">
              <span>Stable</span>
              <span className="count">{patients.filter(p => p.status === 'Stable').length}</span>
            </div>
            <div className="status-item">
              <span>In Treatment</span>
              <span className="count">{patients.filter(p => p.status === 'In Treatment').length}</span>
            </div>
            <div className="status-item">
              <span>Critical</span>
              <span className="count">{patients.filter(p => p.status === 'Critical').length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="patients-list">
        <h4>Patient List</h4>
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Symptom</th>
              <th>Treatment</th>
              <th>Adherence</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.symptom}</td>
                <td>{patient.treatment}</td>
                <td>
                  <span className={`adherence ${patient.adherence.toLowerCase()}`}>
                    {patient.adherence}
                  </span>
                </td>
                <td>
                  <span className={`risk-dot ${patient.riskLevel.toLowerCase()}`}>
                    ● {patient.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;