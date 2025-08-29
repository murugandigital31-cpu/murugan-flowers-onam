import React, { useState } from 'react';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('flowers');
  const [flowers, setFlowers] = useState([
    { id: 1, name: 'Marigold', color: 'Yellow', price: 40, image: 'https://i.pinimg.com/236x/1a/8a/9b/1a8a9b8b8e8e8e8e8e8e8e8e8e8e8e8e.jpg' },
    { id: 2, name: 'Rose', color: 'Red', price: 60, image: 'https://i.pinimg.com/236x/2a/8a/9b/2a8a9b8b8e8e8e8e8e8e8e8e8e8e8e8e.jpg' },
    { id: 3, name: 'Jasmine', color: 'White', price: 50, image: 'https://i.pinimg.com/236x/3a/8a/9b/3a8a9b8b8e8e8e8e8e8e8e8e8e8e8e8e.jpg' },
    { id: 4, name: 'Hibiscus', color: 'Red', price: 35, image: 'https://i.pinimg.com/236x/4a/8a/9b/4a8a9b8b8e8e8e8e8e8e8e8e8e8e8e8e.jpg' }
  ]);
  
  const [newFlower, setNewFlower] = useState({ name: '', color: '', price: '', image: '' });
  
  const handleAddFlower = (e) => {
    e.preventDefault();
    if (newFlower.name && newFlower.color && newFlower.price && newFlower.image) {
      const flower = {
        id: flowers.length + 1,
        ...newFlower,
        price: parseInt(newFlower.price)
      };
      setFlowers([...flowers, flower]);
      setNewFlower({ name: '', color: '', price: '', image: '' });
    }
  };
  
  const handleDeleteFlower = (id) => {
    setFlowers(flowers.filter(flower => flower.id !== id));
  };
  
  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'flowers' ? 'active' : ''}`}
            onClick={() => setActiveTab('flowers')}
          >
            Manage Flowers
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        
        {activeTab === 'flowers' && (
          <div className="tab-content">
            <h2>Manage Flowers</h2>
            
            <div className="flower-form">
              <h3>Add New Flower</h3>
              <form onSubmit={handleAddFlower}>
                <div className="form-group">
                  <label>Name:</label>
                  <input 
                    type="text" 
                    value={newFlower.name}
                    onChange={(e) => setNewFlower({...newFlower, name: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Color:</label>
                  <input 
                    type="text" 
                    value={newFlower.color}
                    onChange={(e) => setNewFlower({...newFlower, color: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Price (₹):</label>
                  <input 
                    type="number" 
                    value={newFlower.price}
                    onChange={(e) => setNewFlower({...newFlower, price: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Image URL:</label>
                  <input 
                    type="text" 
                    value={newFlower.image}
                    onChange={(e) => setNewFlower({...newFlower, image: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">Add Flower</button>
              </form>
            </div>
            
            <div className="flowers-list">
              <h3>Current Flowers</h3>
              <div className="flower-grid">
                {flowers.map(flower => (
                  <div key={flower.id} className="flower-card">
                    <img src={flower.image} alt={flower.name} className="flower-image" />
                    <div className="flower-info">
                      <h4>{flower.name}</h4>
                      <p>Color: {flower.color}</p>
                      <p>Price: ₹{flower.price}/bunch</p>
                      <button 
                        className="btn btn-accent"
                        onClick={() => handleDeleteFlower(flower.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="tab-content">
            <h2>Orders Management</h2>
            <p>Order management functionality would be implemented here.</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h2>Settings</h2>
            <p>Application settings would be managed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;