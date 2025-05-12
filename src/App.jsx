import React, { useState } from 'react';
import EnquiriesTable from './components/EnquiriesTable';
import AddProductForm from './components/AddProductForm';
import Feedback from './components/Feedback'; // your CRUD feedback card view

function App() {
  const [activeComponent, setActiveComponent] = useState('enquiries');

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        <button
          onClick={() => setActiveComponent('enquiries')}
          style={{
            ...styles.button,
            backgroundColor: activeComponent === 'enquiries' ? '#2563eb' : '#e5e7eb',
            color: activeComponent === 'enquiries' ? '#fff' : '#000',
          }}
        >
          View Enquiries
        </button>

        <button
          onClick={() => setActiveComponent('addProduct')}
          style={{
            ...styles.button,
            backgroundColor: activeComponent === 'addProduct' ? '#2563eb' : '#e5e7eb',
            color: activeComponent === 'addProduct' ? '#fff' : '#000',
          }}
        >
          Add Product
        </button>

        <button
          onClick={() => setActiveComponent('feedback')}
          style={{
            ...styles.button,
            backgroundColor: activeComponent === 'feedback' ? '#16a34a' : '#e5e7eb',
            color: activeComponent === 'feedback' ? '#fff' : '#000',
          }}
        >
          Feedback
        </button>
      </div>

      <div style={styles.content}>
        {activeComponent === 'enquiries' && <EnquiriesTable />}
        {activeComponent === 'addProduct' && <AddProductForm />}
        {activeComponent === 'feedback' && <Feedback />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  content: {
    marginTop: '20px',
  },
};

export default App;
