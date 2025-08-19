// components/Appointments.js
import React, { useState } from 'react';
import { usePatientData } from '../hooks/usePatientData';
import './Appointments.css';

const Appointments = () => {
  const { appointments } = usePatientData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctor: 'Dr. Smith',
    date: '',
    time: '',
    status: 'Pending',
    reason: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({...newAppointment, [name]: value});
  };

  const handleScheduleAppointment = () => {
    // En una aplicación real, guardaríamos la cita
    alert(`Cita programada para ${newAppointment.patientName} el ${newAppointment.date} a las ${newAppointment.time}`);
    setShowScheduleForm(false);
    setNewAppointment({
      patientName: '',
      doctor: 'Dr. Smith',
      date: '',
      time: '',
      status: 'Pending',
      reason: ''
    });
  };

  return (
    <div className="appointments">
      <h2>Appointments</h2>
      
      <div className="calendar-view">
        <h3>August 2025</h3>
        <div className="calendar">
          <div className="weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="days-grid">
            {/* Días del calendario - simplificado para el ejemplo */}
            {[...Array(31)].map((_, i) => (
              <div key={i} className="day" onClick={() => setSelectedDate(new Date(2025, 7, i + 1))}>
                {i + 1}
                {appointments.filter(a => {
                  const appDate = new Date(a.date);
                  return appDate.getDate() === i + 1 && appDate.getMonth() === 7 && appDate.getFullYear() === 2025;
                }).map(app => (
                  <div key={app.id} className="appointment-indicator">
                    {app.patientName}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button className="schedule-btn" onClick={() => setShowScheduleForm(true)}>
        Schedule an appointment
      </button>
      
      {showScheduleForm && (
        <div className="schedule-form-overlay">
          <div className="schedule-form">
            <h3>Schedule Appointment</h3>
            <div className="form-group">
              <label>Patient</label>
              <input 
                type="text" 
                name="patientName"
                value={newAppointment.patientName}
                onChange={handleInputChange}
                placeholder="Patient name"
              />
            </div>
            <div className="form-group">
              <label>Doctor</label>
              <input 
                type="text" 
                name="doctor"
                value={newAppointment.doctor}
                onChange={handleInputChange}
                placeholder="Doctor"
              />
            </div>
            <div className="form-group">
              <label>Date & Time</label>
              <input 
                type="datetime-local" 
                name="date"
                value={newAppointment.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={newAppointment.status} onChange={handleInputChange}>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea 
                name="reason"
                value={newAppointment.reason}
                onChange={handleInputChange}
                placeholder="Reason for appointment"
              />
            </div>
            <div className="form-actions">
              <button onClick={() => setShowScheduleForm(false)}>Cancel</button>
              <button onClick={handleScheduleAppointment}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;