import React, { useState, useEffect } from 'react';
import { database, ref, push, update, remove } from '../firebase'; // adjust if you're using Firebase
import { onValue } from 'firebase/database';

const categoryOptions = [
  'All Products',
  'Medical',
  'Aerospace and Defence',
  'Electric Vehicle',
  'Automotive',
  'General Engineering',
  'Oil & Gas',
  'Pneumatics',
  'Textile',
  'White Goods',
  'Compressor',
  'Railways',
  'Hydraulics',
  'Door Closer',
  'Low Pressure Die Casting Components'
];

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    link: '/contact',
  });

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const productArray = data
        ? Object.entries(data).map(([id, item]) => ({
            id,
            ...item,
          }))
        : [];
      setProducts(productArray);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingProduct) {
      // Update existing product
      const productRef = ref(database, `products/${editingProduct.id}`);
      update(productRef, formData)
        .then(() => {
          alert('Product updated successfully!');
          setEditingProduct(null);
          setFormData({
            title: '',
            category: '',
            image: '',
            link: '/contact',
          });
        })
        .catch((error) => {
          console.error('Error updating product:', error);
        });
    } else {
      // Create new product
      const productsRef = ref(database, 'products');
      push(productsRef, formData)
        .then(() => {
          alert('Product added successfully!');
          setFormData({
            title: '',
            category: '',
            image: '',
            link: '/contact',
          });
        })
        .catch((error) => {
          console.error('Error adding product:', error);
        });
    }
  };

  const handleDelete = (productId) => {
    const productRef = ref(database, `products/${productId}`);
    remove(productRef)
      .then(() => {
        alert('Product deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      category: product.category,
      image: product.image,
      link: product.link,
    });
    setEditingProduct(product);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Product Title"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="image"
          value={formData.image}
          placeholder="Image URL"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <div>
        <h3 style={styles.heading}>Product List</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              {/* Removed Description Header */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.category}</td>
                {/* Removed Description Cell */}
                <td>
                  <button
                    style={{ ...styles.button, ...styles.editButton }}
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  form: {
    maxWidth: '600px',
    margin: '40px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
  },
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  table: {
    width: '100%',
    marginTop: '40px',
    borderCollapse: 'collapse',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  editButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: 'green',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
    marginRight: '10px',
  },
  deleteButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AddProductForm;
