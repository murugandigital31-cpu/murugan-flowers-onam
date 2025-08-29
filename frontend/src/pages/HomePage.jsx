import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  // Using local image paths instead of backend URLs
  const flowers = [
    { name: 'Marigold Orange', image: '/images/flowers/Marigold_Orange.webp', color: 'Orange', description: 'Vibrant orange marigolds commonly used in traditional designs', price: 'AED 125/kg' },
    { name: 'Marigold Yellow', image: '/images/flowers/Marigold Yellow.webp', color: 'Yellow', description: 'Bright yellow marigolds for auspicious occasions', price: 'AED 120/kg' },
    { name: 'Yellow Seventhi', image: '/images/flowers/Yellow_Seventhi.avif', color: 'Yellow', description: 'Traditional yellow flowers for ceremonial arrangements', price: 'AED 135/kg' },
    { name: 'White Seventhi', image: '/images/flowers/White_seventhi.webp', color: 'White', description: 'Pure white flowers symbolizing peace and purity', price: 'AED 130/kg' },
    { name: 'Purple Seventhi', image: '/images/flowers/Purple_seventhi.webp', color: 'Purple', description: 'Elegant purple flowers for decorative patterns', price: 'AED 140/kg' },
    { name: 'Naatu Seventhi', image: '/images/flowers/Naatu Seventhi.avif', color: 'Yellow', description: 'Native variety with unique fragrance', price: 'AED 150/kg' },
    { name: 'Red Rose', image: '/images/flowers/red_rose.webp', color: 'Red', description: 'Classic red roses for decorative patterns', price: 'AED 190/kg' },
    { name: 'Yellow Rose', image: '/images/flowers/Yellow rose.png', color: 'Yellow', description: 'Bright yellow roses for festive arrangements', price: 'AED 180/kg' },
    { name: 'Orange Rose', image: '/images/flowers/Orange_rose.png', color: 'Orange', description: 'Vibrant orange roses for colorful designs', price: 'AED 185/kg' },
    { name: 'Pink Arali', image: '/images/flowers/Pink arali.webp', color: 'Pink', description: 'Delicate pink flowers for inner patterns', price: 'AED 165/kg' },
    { name: 'Red Arali', image: '/images/flowers/Red Arali.png', color: 'Red', description: 'Bright red arali flowers for vivid designs', price: 'AED 165/kg' },
    { name: 'Savukku', image: '/images/flowers/Savukku.png', color: 'Green', description: 'Green foliage for complementing flower arrangements', price: 'AED 50/kg' },
    { name: 'Vadamalli', image: '/images/flowers/Vaadamalli.png', color: 'Purple', description: 'Exotic purple flowers for accent designs', price: 'AED 210/kg' },
    { name: 'Panneer Rose', image: '/images/flowers/Penner rose.webp', color: 'Pink', description: 'Delicate pink roses for intricate patterns', price: 'AED 175/kg' },
    { name: 'White Lilly', image: '/images/flowers/Lilly.png', color: 'White', description: 'Elegant white lilies for premium arrangements', price: 'AED 230/kg' }
  ];
  
  // Using public folder for bg_onam images
  const bgImages = [
    '/images/bg_onam/pngwing.com (18).png',
    '/images/bg_onam/pngwing.com (19).png',
    '/images/bg_onam/pngwing.com (20).png',
    '/images/bg_onam/pngwing.com (21).png',
    '/images/bg_onam/pngwing.com (22).png',
    '/images/bg_onam/pngwing.com (23).png',
    '/images/bg_onam/pngwing.com (24).png'
  ];

  // State for filter and animations
  const [filteredFlowers, setFilteredFlowers] = useState(flowers);
  const [selectedColor, setSelectedColor] = useState('All');
  const [hoveredFlower, setHoveredFlower] = useState(null);
  const [quickViewFlower, setQuickViewFlower] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewQuantity, setQuickViewQuantity] = useState(0.5);
  
  // Available colors for filter
  const colors = ['All', 'Red', 'Yellow', 'Orange', 'Pink', 'Purple', 'White', 'Green'];
  
  // Filter flowers by color
  useEffect(() => {
    if (selectedColor === 'All') {
      setFilteredFlowers(flowers);
    } else {
      setFilteredFlowers(flowers.filter(flower => flower.color === selectedColor));
    }
  }, [selectedColor]);
  
  // Handle quick view
  const openQuickView = (flower) => {
    setQuickViewFlower(flower);
    setQuickViewQuantity(0.5); // Reset quantity when opening new quick view
  };
  
  const closeQuickView = () => {
    setQuickViewFlower(null);
  };

  // Cart functions
  const addToCart = (flower, quantity = 0.5) => {
    setCartItems(prevItems => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find(item => item.name === flower.name);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item => 
          item.name === flower.name 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { ...flower, quantity }];
      }
    });
    
    // Pulse animation for cart button
    const cartBtn = document.querySelector('.btn-cart');
    if (cartBtn) {
      cartBtn.classList.add('pulse');
      setTimeout(() => {
        cartBtn.classList.remove('pulse');
      }, 300);
    }
    
    // Show cart after adding
    setIsCartOpen(true);
  };

  const removeFromCart = (flowerName) => {
    setCartItems(prevItems => prevItems.filter(item => item.name !== flowerName));
  };

  const updateQuantity = (flowerName, newQuantity) => {
    if (newQuantity < 0.5) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.name === flowerName 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Extract the numeric price value
      const priceStr = item.price.replace('AED ', '').replace('/kg', '');
      const price = parseFloat(priceStr);
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };
  
  const handleCheckoutViaWhatsApp = () => {
    // Format cart items for WhatsApp message
    const cartItemsText = cartItems.map(item => 
      `${item.name} (${item.color}) - ${item.quantity} kg - ${item.price}`
    ).join('\n');
    
    const totalPrice = `AED ${getTotalPrice()}`;
    
    // Create WhatsApp message
    const message = encodeURIComponent(
      `*New Order from Murugan Flowers*\n\n` +
      `I would like to order the following flowers:\n\n` +
      `${cartItemsText}\n\n` +
      `*Total Price:* ${totalPrice}\n\n` +
      `Please confirm availability and delivery details.`
    );
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/971565007474?text=${message}`, '_blank');
  };

  return (
    <div className="home-page">
      {/* Background decoration with Onam images - using array of image paths */}
      <div className="background-decoration">
        <img 
          src={bgImages[0]} 
          alt="Onam decoration" 
          className="bg-decoration-img bg-img-1" 
          onError={(e) => console.error("Image failed to load:", e.target.src)}
          onLoad={() => console.log("Image loaded successfully:", bgImages[0])}
        />
        <img 
          src={bgImages[1]} 
          alt="Onam decoration" 
          className="bg-decoration-img bg-img-2" 
          onError={(e) => console.error("Image failed to load:", e.target.src)}
          onLoad={() => console.log("Image loaded successfully:", bgImages[1])}
        />
        <img 
          src={bgImages[2]} 
          alt="Onam decoration" 
          className="bg-decoration-img bg-img-3" 
          onError={(e) => console.error("Image failed to load:", e.target.src)}
          onLoad={() => console.log("Image loaded successfully:", bgImages[2])}
        />
        <img 
          src={bgImages[3]} 
          alt="Onam decoration" 
          className="bg-decoration-img bg-img-4" 
          onError={(e) => console.error("Image failed to load:", e.target.src)}
          onLoad={() => console.log("Image loaded successfully:", bgImages[3])}
        />
        <img 
          src={bgImages[4]} 
          alt="Onam decoration" 
          className="bg-decoration-img bg-img-5" 
          onError={(e) => console.error("Image failed to load:", e.target.src)}
          onLoad={() => console.log("Image loaded successfully:", bgImages[4])}
        />
        <img 
          src={bgImages[5]} 
          alt="Onam decoration" 
          className="bg-decoration-img bg-img-6" 
          onError={(e) => console.error("Image failed to load:", e.target.src)}
          onLoad={() => console.log("Image loaded successfully:", bgImages[5])}
        />
        <img 
          src={bgImages[6]} 
          alt="Onam decoration" 
          className="bg-decoration-img bg-img-7" 
          onError={(e) => console.error("Image failed to load:", e.target.src)}
          onLoad={() => console.log("Image loaded successfully:", bgImages[6])}
        />
      </div>
      
      {/* Debug div to show if images exist */}
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.7)', 
        color: 'white', 
        padding: '10px', 
        zIndex: 9999,
        display: 'none' // Change to 'block' to show for debugging
      }}>
        <p>Background Image 1: <img src={bgImages[0]} alt="" style={{ width: '50px', height: '50px' }} /></p>
      </div>
      
      <div className="container">
        {/* Header Section */}
        <section className="header-section">
          <div className="header-branding">
            <div className="brand-text">
              <h1 className="main-title">Murugan Flowers</h1>
              <p className="subtitle">Traditional Onam Flower Arrangements</p>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/designer" className="btn btn-primary btn-large">Design Your Pookkolam</Link>
            <button 
              className="btn btn-cart"
              onClick={() => setIsCartOpen(true)}
            >
              <span className="cart-text">View Cart</span>
              <span className="cart-icon-symbol">🛒</span>
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </button>
          </div>
        </section>

        {/* Remove floating cart icon since we've added it to the header */}
      
      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-sidebar-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Shopping Cart</h2>
              <button className="close-cart" onClick={() => setIsCartOpen(false)}>×</button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="empty-cart-message">
                <p>Your cart is empty</p>
                <button 
                  className="continue-shopping-btn"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">{item.price}</p>
                        <div className="cart-item-color">
                          <span>Color: </span>
                          <span 
                            className="color-dot" 
                            style={{ backgroundColor: item.color.toLowerCase() }}
                          ></span>
                          <span>{item.color}</span>
                        </div>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.name, Math.max(0.5, item.quantity - 0.5))}
                            className="quantity-btn"
                            disabled={item.quantity <= 0.5}
                          >
                            -
                          </button>
                          <span className="quantity-display">{item.quantity} kg</span>
                          <button 
                            onClick={() => updateQuantity(item.name, item.quantity + 0.5)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.name)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-price">AED {getTotalPrice()}</span>
                  </div>
                  <button 
                    className="checkout-btn"
                    onClick={handleCheckoutViaWhatsApp}
                  >
                    Checkout via WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
        {/* Flower Showcase Section */}
        <section className="flower-showcase-section">
          <h2 className="section-title">Available Onam Flowers</h2>
          
          {/* Color filter tabs */}
          <div className="color-filter-tabs">
            {colors.map((color) => (
              <button 
                key={color} 
                className={`color-tab ${selectedColor === color ? 'active' : ''}`}
                style={{
                  backgroundColor: color === 'All' ? '#4CAF50' : color.toLowerCase(),
                  color: ['Yellow', 'White', 'All'].includes(color) ? '#333' : '#fff'
                }}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
          
          {/* Flower grid with animations */}
          <div className="flower-grid">
            {filteredFlowers.map((flower, index) => (
              <div 
                key={index} 
                className={`flower-card ${hoveredFlower === index ? 'expanded' : ''}`}
                onMouseEnter={() => setHoveredFlower(index)}
                onMouseLeave={() => setHoveredFlower(null)}
              >
                <div className="flower-image-container">
                  <img 
                    src={flower.image} 
                    alt={flower.name} 
                    className="flower-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsb3dlciBJbWFnZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
                <div className="flower-info">
                  <div className="flower-header">
                    <h3 className="flower-name">{flower.name}</h3>
                    <span className="flower-color-dot" style={{ backgroundColor: flower.color.toLowerCase() }}></span>
                  </div>
                  <p className="flower-description">{flower.description}</p>
                  <div className="flower-footer">
                    <span className="flower-color-label">Color: {flower.color}</span>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(flower)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                {hoveredFlower === index && (
                  <div className="flower-card-actions">
                    <button 
                      className="quick-view-btn"
                      onClick={() => openQuickView(flower)}
                    >
                      Quick View
                    </button>
                    <button 
                      className="add-to-cart-btn-hover"
                      onClick={() => addToCart(flower)}
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredFlowers.length === 0 && (
            <div className="no-flowers-message">
              <p>No flowers found for the selected color. Please try another filter.</p>
            </div>
          )}
          
          {/* Quick View Modal */}
          {quickViewFlower && (
            <div className="quick-view-modal" onClick={closeQuickView}>
              <div className="quick-view-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={closeQuickView}>&times;</button>
                <div className="quick-view-layout">
                  <div className="quick-view-image">
                    <img 
                      src={quickViewFlower.image} 
                      alt={quickViewFlower.name} 
                      onError={(e) => {
                        console.error("Quick view image failed to load:", quickViewFlower.image);
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsb3dlciBJbWFnZTwvdGV4dD48L3N2Zz4=';
                      }}
                      onLoad={() => console.log("Quick view image loaded successfully:", quickViewFlower.image)}
                    />
                  </div>
                  <div className="quick-view-details">
                    <h2>{quickViewFlower.name}</h2>
                    <div className="quick-view-price">{quickViewFlower.price}</div>
                    <div className="quick-view-color">
                      <span>Color: </span>
                      <span className="color-value">{quickViewFlower.color}</span>
                      <span 
                        className="color-sample" 
                        style={{ backgroundColor: quickViewFlower.color.toLowerCase() }}
                      ></span>
                    </div>
                    <div className="quick-view-description">
                      <h3>Description</h3>
                      <p>{quickViewFlower.description}</p>
                    </div>
                    <div className="quick-view-usage">
                      <h3>Traditional Usage</h3>
                      <p>Commonly used in traditional Onam pookalam designs, especially in the 
                      {quickViewFlower.color === 'White' || quickViewFlower.color === 'Green' ? ' outer ' : 
                       quickViewFlower.color === 'Red' || quickViewFlower.color === 'Orange' ? ' central ' : 
                       ' middle '} 
                      layers of the design.</p>
                    </div>
                      <div className="quick-view-actions">
                      <div className="quick-view-quantity">
                        <label>Quantity (kg):</label>
                        <div className="quantity-selector">
                          <button 
                            className="quantity-btn" 
                            onClick={() => setQuickViewQuantity(Math.max(0.5, quickViewQuantity - 0.5))}
                            disabled={quickViewQuantity <= 0.5}
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            min="0.5" 
                            step="0.5" 
                            value={quickViewQuantity} 
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value >= 0.5) {
                                setQuickViewQuantity(value);
                              }
                            }}
                            className="quantity-input"
                          />
                          <button 
                            className="quantity-btn" 
                            onClick={() => setQuickViewQuantity(quickViewQuantity + 0.5)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        className="add-to-cart-btn-modal"
                        onClick={() => {
                          addToCart(quickViewFlower, quickViewQuantity);
                          closeQuickView();
                        }}
                      >
                        Add to Cart - {quickViewFlower.price.replace('/kg', '')} × {quickViewQuantity} kg
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;