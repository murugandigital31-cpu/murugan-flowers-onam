import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResultPage.css';

const ResultPage = ({ designResult }) => {
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const designImageRef = useRef(null);
  
  if (!designResult) {
    return (
      <div className="result-page">
        <div className="container">
          <div className="card text-center">
            <h2>No Design Data</h2>
            <p>Please create a design first.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/designer')}
            >
              Create Design
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const { 
    colors_detected, 
    mapped_flowers, 
    flowerList, 
    total_price, 
    totalPrice, 
    preview_image,
    uploaded_image,
    design_review
  } = designResult;
  
  // Use either mapped_flowers or flowerList depending on which is available
  const flowers = mapped_flowers || flowerList || [];
  
  const totalInr = total_price || totalPrice || 'AED 0';
  
  // Display either the uploaded image preview or the DALL-E generated image
  const displayImage = uploaded_image || preview_image || "/images/placeholder-preview.jpg";
  
  // Default review text if none is provided
  const reviewText = design_review || 
    `This traditional Onam pookkolam design features a beautiful arrangement of ${colors_detected ? colors_detected.join(', ') : ''} flowers 
    in a symmetrical pattern. The design is perfect for creating a vibrant and colorful Onam celebration.`;
  
  // Generate WhatsApp share message
  const generateShareMessage = () => {
    const flowerListText = flowers.map(item => 
      `${item.flower}: ${item.qty} - ${item.price}`
    ).join('\n');
    
    return encodeURIComponent(
      `*My Onam Pookkolam Design from Murugan Flowers*\n\n` +
      `${reviewText}\n\n` +
      `*Shopping List:*\n${flowerListText}\n\n` +
      `*Total Price:* ${totalInr}\n\n` +
      `Check out my custom Onam pookkolam design created with Murugan Flowers Designer!`
    );
  };
  
  // Handle sharing via WhatsApp
  const shareViaWhatsApp = () => {
    const message = generateShareMessage();
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };
  
  // Handle sharing via other platforms
  const shareViaEmail = () => {
    const subject = encodeURIComponent('My Onam Pookkolam Design');
    const body = generateShareMessage();
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  
  // Handle copy link
  const copyShareLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Link copied to clipboard!');
        setShareModalOpen(false);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  // Handle confirm order
  const handleConfirmOrder = () => {
    // Generate WhatsApp message for order confirmation
    const message = encodeURIComponent(
      `*New Pookkolam Order from Murugan Flowers*\n\n` +
      `I would like to order the following flowers for my Onam pookkolam:\n\n` +
      flowers.map(item => `${item.flower}: ${item.qty} - ${item.price}`).join('\n') + 
      `\n\n*Total Price:* ${totalInr}\n\n` +
      `Please confirm availability and delivery details.`
    );
    
    // Open WhatsApp with pre-filled message (replace with your actual phone number)
    window.open(`https://wa.me/971XXXXXXXXX?text=${message}`, '_blank');
  };
  
  return (
    <div className="result-page">
      <div className="container">
        <div className="result-header">
          <h1 className="page-title">Your Pookkolam Design</h1>
          <p className="subtitle">Here's your custom flower arrangement with pricing</p>
        </div>
        
        <div className="result-content">
          <div className="preview-section">
            <img 
              ref={designImageRef}
              src={displayImage} 
              alt="Pookkolam Preview" 
              className="preview-image"
            />
            <div className="design-review mt-2">
              <h3>Design Review</h3>
              <p>{reviewText}</p>
            </div>
          </div>
          
          <div className="details-section">
            <div className="card pricing-summary">
              <h2 className="card-title">Pricing Summary</h2>
              <div className="pricing-breakdown">
                <div className="total-price-display">
                  <span className="price-label">Total Estimated Cost</span>
                  <span className="price-value">{totalInr}</span>
                </div>
                <p className="pricing-note">Prices are based on current market rates and may vary at the time of purchase.</p>
              </div>
            </div>
            
            <div className="card">
              <h2 className="card-title">Flower Shopping List</h2>
              
              <table className="flower-list">
                <thead>
                  <tr>
                    <th>Flower</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {flowers.map((item, index) => (
                    <tr key={index}>
                      <td>{item.flower}</td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td></td>
                    <td><strong>{totalInr}</strong></td>
                  </tr>
                </tbody>
              </table>
              
              {colors_detected && (
                <div className="colors-detected mt-2">
                  <h3>Colors Detected</h3>
                  <div className="color-tags">
                    {colors_detected.map((color, index) => (
                      <span key={index} className="color-tag">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="actions">
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/designer')}
              >
                Create Another Design
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleConfirmOrder}
              >
                Confirm Order
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShareModalOpen(true)}
              >
                Share Design
              </button>
            </div>
            
            <div className="pricing-explanation">
              <h3>How Pricing is Calculated</h3>
              <p>Our system calculates the exact quantity of flowers needed based on your design specifications. The price is determined by multiplying the required quantity by the current market rate for each flower type. All prices include handling and preparation costs.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Share Modal */}
      {shareModalOpen && (
        <div className="share-modal-overlay" onClick={() => setShareModalOpen(false)}>
          <div className="share-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Share Your Design</h3>
            <div className="share-options">
              <div className="share-option" onClick={shareViaWhatsApp}>
                <div className="share-icon whatsapp-icon">
                  <i className="fa fa-whatsapp"></i>
                </div>
                <span>WhatsApp</span>
              </div>
              <div className="share-option" onClick={shareViaEmail}>
                <div className="share-icon email-icon">
                  <i className="fa fa-envelope"></i>
                </div>
                <span>Email</span>
              </div>
              <div className="share-option" onClick={copyShareLink}>
                <div className="share-icon link-icon">
                  <i className="fa fa-link"></i>
                </div>
                <span>Copy Link</span>
              </div>
            </div>
            <button className="close-modal" onClick={() => setShareModalOpen(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;