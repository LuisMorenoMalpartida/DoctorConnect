// components/Patients.js
import React, { useState } from 'react';
import { usePatientData } from '../hooks/usePatientData';
import './Patients.css';

const Patients = () => {
  const { patients } = usePatientData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patients">
      <h2>Patients</h2>
      
      <div className="patients-header">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <table className="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Diagnosis</th>
            <th>Next appointment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.diagnosis}</td>
              <td>{patient.nextAppointment}</td>
              <td>
                <button className="view-btn">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button className="view-all-btn">View all patients</button>
    </div>
  );
};

export default Patients;