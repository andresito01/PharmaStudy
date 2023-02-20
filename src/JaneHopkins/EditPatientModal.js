import React, { useState } from 'react';

function EditPatientModal(props) {
  const { patient, onSubmit, onClose } = props;
  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(patient.id, name, age);
  };

  return (
    <div>
      <h2>Edit Patient Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Age:
          <input type="number" value={age} onChange={e => setAge(e.target.value)} />
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

export default EditPatientModal;