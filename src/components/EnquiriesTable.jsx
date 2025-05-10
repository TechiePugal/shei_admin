import React, { useEffect, useState } from 'react';
import { database, ref, onValue, update, remove } from '../firebase';
import AddProductForm from './AddProductForm';
const EnquiriesTable = () => {
  const [enquiries, setEnquiries] = useState([]);

  // Fetch enquiries from Firebase
  useEffect(() => {
    const enquiriesRef = ref(database, 'enquiries');
    onValue(enquiriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedEnquiries = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setEnquiries(loadedEnquiries.reverse()); // show latest first
      }
    });
  }, []);

  // Handle the status change
  const handleStatusChange = (id, newStatus) => {
    const enquiryRef = ref(database, `enquiries/${id}`);
    update(enquiryRef, { status: newStatus })
      .then(() => {
        const updatedEnquiries = enquiries.map((entry) =>
          entry.id === id ? { ...entry, status: newStatus } : entry
        );
        setEnquiries(updatedEnquiries);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  // Handle the deletion of an enquiry
  const handleDelete = (id) => {
    const enquiryRef = ref(database, `enquiries/${id}`);
    remove(enquiryRef)
      .then(() => {
        const updatedEnquiries = enquiries.filter((entry) => entry.id !== id);
        setEnquiries(updatedEnquiries);
      })
      .catch((error) => {
        console.error('Error deleting enquiry:', error);
      });
  };

  return ( 
    <div style={styles.container}>
      <h2 style={styles.heading}>Submitted Enquiries</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Email</th>
            <th style={styles.tableHeader}>Phone</th>
            <th style={styles.tableHeader}>Company</th>
            <th style={styles.tableHeader}>Message</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Status</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((entry) => (
            <tr key={entry.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{entry.name}</td>
              <td style={styles.tableCell}>{entry.email}</td>
              <td style={styles.tableCell}>{entry.phone}</td>
              <td style={styles.tableCell}>{entry.company}</td>
              <td style={styles.tableCell}>{entry.message}</td>
              <td style={styles.tableCell}>{new Date(entry.timestamp).toLocaleString()}</td>
              <td style={styles.tableCell}>
                <select
                  value={entry.status || 'Incomplete'}
                  onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                  style={styles.statusSelect}
                >
                  <option value="Incomplete">Incomplete</option>
                  <option value="Complete">Complete</option>
                  <option value="Not Responding">Not Responding</option>
                </select>
              </td>
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleDelete(entry.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    backgroundColor: '#f1f5f9',
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    color: '#4b5563',
    fontWeight: '500',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderTop: '1px solid #e5e7eb',
    '&:hover': {
      backgroundColor: '#f9fafb',
    },
  },
  tableCell: {
    padding: '12px',
    fontSize: '14px',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
  },
  statusSelect: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#6b7280',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default EnquiriesTable;
