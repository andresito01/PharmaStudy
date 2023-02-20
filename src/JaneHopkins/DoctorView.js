import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { getClient } from '@vendia/client';
import EditPatientModal from './EditPatientModal';
import AddAppointmentModal from './AddAppointmentModal';
//import { query } from '@vendia/client/core';
import useJaneHopkins from '../hooks/useJaneHopkins';

function DoctorView() {
    const { entities } = useJaneHopkins();
    //const [patients, setPatients] = useState(null);
    //const [isLoading, setIsLoading] = useState(true);
    
    const [patients, setPatients] = useState([
        {
            id: 1,
            name: 'John Smith',
            age: 45,
            appointments: [
                { date: '2022-03-01', time: '10:00 AM' },
                { date: '2022-03-15', time: '2:00 PM' }
            ]
        },
        {
            id: 2,
            name: 'Mary Jones',
            age: 35,
            appointments: [
                { date: '2022-03-05', time: '11:00 AM' },
                { date: '2022-03-20', time: '3:00 PM' }
            ]
        }
    ]);
    
    //const navigate = useNavigate();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
    };

    const handleAppointment = (patient) => {
        setSelectedPatient(patient);
        setIsAppointmentModalOpen(true);
    };

    const handleEditModalClose = () => {
        setSelectedPatient(null);
        setIsEditModalOpen(false);
    };

    const handleAppointmentModalClose = () => {
        setSelectedPatient(null);
        setIsAppointmentModalOpen(false);
    };

    const handleEditSubmit = (patient) => {
        const updatedPatients = patients.map(p => {
            if (p.id === patient.id) {
                return { ...p, ...patient };
            }
            return p;
        });
        setPatients(updatedPatients);
        handleEditModalClose();
    };

    const handleAppointmentSubmit = (appointment) => {
        const updatedPatients = patients.map(p => {
            if (p.id === selectedPatient.id) {
                return { ...p, appointments: [...p.appointments, appointment] };
            }
            return p;
        });
        setPatients(updatedPatients);
        handleAppointmentModalClose();
    };
    /*
        const fetchData = async () => {
            const client = getClient();
            const result = await client.query({
                version: '2021-09-14',
                query: `
                    query ListPatients {
                        listPatients {
                            id
                            name
                            dob
                            insuranceNumber
                        }
                    }
                `
            });
            setPatients(result.data.listPatients);
        };
    
        useEffect(() => {
            fetchData();
        }, []);
    *//*
        useEffect(() => {
            const fetchPatients = async () => {
              try {
                const { items } = await entities.patient.list();
                setPatients(items);
              } catch (error) {
                console.error(error);
              }
            };
        
            fetchPatients();
          }, [entities.patient]); 
*/
    return (
        <div>
            <h1>Doctor Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Appointments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>{patient.age}</td>
                            <td>{patient.appointments.length}</td>
                            <td>
                                <button onClick={() => handleEdit(patient)}>Edit</button>
                                <button onClick={() => handleAppointment(patient)}>Add Appointment</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isEditModalOpen && (
                <EditPatientModal
                    patient={selectedPatient}
                    onSubmit={handleEditSubmit}
                    onClose={handleEditModalClose}
                />
            )}
            {isAppointmentModalOpen && (
                <AddAppointmentModal
                    patient={selectedPatient}
                    onSubmit={handleAppointmentSubmit}
                    onClose={handleAppointmentModalClose}
                />
            )}
        </div>
    );
}

export default DoctorView;
