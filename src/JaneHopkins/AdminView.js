import React, { useState } from 'react';

function AdminView() {
    const [patients, setPatients] = useState([
        {
            id: 1,
            name: 'John Smith',
            age: 45,
            appointments: [
                { date: '2022-03-01', time: '10:00 AM', doseCount: 1 },
                { date: '2022-03-15', time: '2:00 PM', doseCount: 2 },
                { date: '2022-03-29', time: '3:00 PM', doseCount: 3 }
            ],
            isEligible: true
        },
        {
            id: 2,
            name: 'Mary Jones',
            age: 35,
            appointments: [
                { date: '2022-03-05', time: '11:00 AM', doseCount: 1 },
                { date: '2022-03-20', time: '3:00 PM', doseCount: 2 }
            ],
            isEligible: true
        }
    ]);
    const [isCheckCompleteModalOpen, setIsCheckCompleteModalOpen] = useState(false);

    const handleCheckComplete = () => {
        const isComplete = patients.every(p => p.appointments.length === 5);
        if (isComplete) {
            setIsCheckCompleteModalOpen(true);
            notifyFDA();
        }
    };

    const handleCheckCompleteModalClose = () => {
        setIsCheckCompleteModalOpen(false);
    };

    const notifyFDA = () => {
        // code to notify the FDA
    };

    return (
        <div>
            <h1>Admin Profile</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Appointments</th>
                        <th>Eligibility</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>{patient.age}</td>
                            <td>{patient.appointments.length}</td>
                            <td>{patient.isEligible ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleCheckComplete}>Check Complete</button>
            {isCheckCompleteModalOpen && (
                <div>
                    <p>Study is complete. Results have been sent to FDA.</p>
                    <button onClick={handleCheckCompleteModalClose}>Close</button>
                </div>
            )}
        </div>
    );
}

export default AdminView;