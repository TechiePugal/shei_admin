import React, { useEffect, useState } from 'react';
import { database, ref, onValue, remove, update } from '../firebase';
import { motion } from 'framer-motion';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const feedbackRef = ref(database, 'feedbacks');
    onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      const feedbackArray = data
        ? Object.entries(data).map(([id, val]) => ({ id, ...val }))
        : [];
      setFeedbacks(feedbackArray.reverse()); // latest first
    });
  }, []);

  const handleDelete = async (id) => {
    await remove(ref(database, `feedbacks/${id}`));
  };

  const handleStatusChange = async (id, status) => {
    await update(ref(database, `feedbacks/${id}`), { status });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
      {/* Feedback Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7f7f7', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Feedback</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Company</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Status</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>"{fb.quote}"</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{fb.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{fb.company}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <select
                    value={fb.status}
                    onChange={(e) => handleStatusChange(fb.id, e.target.value)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '0.5rem',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff',
                    }}
                  >
                    <option value="Not Publish">Not Publish</option>
                    <option value="Publish">Publish</option>
                  </select>
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleDelete(fb.id)}
                    style={{
                      backgroundColor: '#DC2626',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Feedback;
