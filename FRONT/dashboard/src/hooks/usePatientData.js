import { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Datos CSV simulados
const patientsCSV = `id,name,age,diagnosis,nextAppointment,status,symptom,treatment,adherence,riskLevel
1,Maria Lopez,34,Diabetes,14/05 8:00 AM,Stable,High blood sugar,Metformin,Good,Medium
2,John Doe,45,Hypertension,16/05 10:30 AM,In Treatment,High blood pressure,Lisinopril,Good,Low
3,Sarah Johnson,29,Asthma,18/05 11:30 AM,Stable,Shortness of breath,Inhaler,Poor,High
4,Michael Brown,52,Heart Disease,20/05 9:00 AM,Critical,Chest pain,Statins,Good,High
5,Emily Davis,41,Arthritis,22/05 1:00 PM,In Treatment,Joint pain,Ibuprofen,Poor,Low
6,Nancy Perez,58,Hypertension,24/05 2:30 PM,Stable,Headaches,Antacid,Good,Low
7,Robert Johnson,63,Diabetes,26/05 9:30 AM,In Treatment,Thirst,Insulin,Poor,Medium
8,Carlos King,47,Asthma,28/05 10:00 AM,Stable,Wheezing,Inhaler,Good,Medium
9,James Hall,55,Diabetes,30/05 11:00 AM,In Treatment,Fatigue,Metformin,Poor,High
10,Donald Rogers,70,Arthritis,01/06 3:00 PM,Stable,Joint stiffness,Physical Therapy,Good,Low`;

const appointmentsCSV = `id,patientName,date,time,status,reason
1,Maria Lopez,2025-05-14,08:00 AM,Pending,Regular checkup
2,John Doe,2025-05-16,10:30 AM,Confirmed,Blood pressure check
3,Sarah Johnson,2025-05-18,11:30 AM,Pending,Asthma review
4,Michael Brown,2025-05-20,09:00 AM,Confirmed,Heart examination
5,Emily Davis,2025-05-22,01:00 PM,Pending,Joint pain evaluation`;

export const usePatientData = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Parse patients data
    Papa.parse(patientsCSV, {
      header: true,
      complete: (results) => {
        setPatients(results.data);
      }
    });

    // Parse appointments data
    Papa.parse(appointmentsCSV, {
      header: true,
      complete: (results) => {
        setAppointments(results.data);
      }
    });

    // Calculate stats
    setStats({
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      highRiskPatients: patients.filter(p => p.riskLevel === 'High').length
    });
  }, []);

  return { patients, appointments, stats };
};