import React, { useState } from 'react';

function AddAppointmentModal(props) {
    const { patient, onSubmit, onClose } = props;
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
  
    const handleSubmit = e => {
      e.preventDefault();
      onSubmit(patient.id, date, time);
    };
  
    return (
      <div>
        <h2>Add Appointment</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </label>
          <br />
          <label>
            Time:
            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          </label>
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  export default AddAppointmentModal;