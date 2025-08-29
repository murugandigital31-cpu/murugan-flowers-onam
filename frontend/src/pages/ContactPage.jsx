import React from 'react';
import '../styles/ContactPage.css';

const ContactPage = () => {
  // Branch information
  const branches = [
    { 
      name: 'Abu Shagara Branch',
      phone: '97165531449',
      mobile: '971544961010'
    },
    { 
      name: 'Al Nahda Branch',
      phone: '97165747812',
      mobile: '971588287040'
    },
    { 
      name: 'Abu Dhabi Branch',
      phone: '97122458889',
      mobile: '971544009822'
    },
    { 
      name: 'Burdubai Branch',
      phone: '97143390881',
      mobile: '971581383024'
    },
    { 
      name: 'Al Qusais Branch',
      phone: '97144484691',
      mobile: '971544941010'
    },
    { 
      name: 'Karama Branch',
      phone: '97145890241',
      mobile: '971542474546'
    },
    { 
      name: 'Mussafah Branch',
      phone: '97124403064',
      mobile: '971555073093'
    },
    { 
      name: 'Ruwais Branch',
      phone: '97126752333',
      mobile: '971564446410'
    }
  ];

  // Function to format phone number
  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('971')) {
      return `+${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 5)} ${phoneNumber.slice(5)}`;
    }
    return phoneNumber;
  };

  // Function to create WhatsApp link
  const createWhatsAppLink = (phoneNumber) => {
    return `https://wa.me/${phoneNumber}`;
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="page-title">Contact Us</h1>
        <p className="subtitle">Reach out to our branches for flower arrangements and pookkolam designs</p>
        
        <div className="contact-info">
          <div className="whatsapp-contact">
            <h2>Quick Contact</h2>
            <a 
              href="https://wa.me/971565007474" 
              className="whatsapp-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="whatsapp-icon">📱</span>
              Call/WhatsApp: +971 56 500 7474
            </a>
          </div>
          
          <div className="branches-grid">
            {branches.map((branch, index) => (
              <div key={index} className="branch-card">
                <h3 className="branch-name">{branch.name}</h3>
                <div className="branch-contact">
                  <div className="contact-row">
                    <span className="contact-icon">☎️</span>
                    <a href={`tel:+${branch.phone}`} className="contact-link">
                      {formatPhoneNumber(branch.phone)}
                    </a>
                  </div>
                  <div className="contact-row">
                    <span className="contact-icon">📱</span>
                    <a href={createWhatsAppLink(branch.mobile)} className="contact-link whatsapp-link" target="_blank" rel="noopener noreferrer">
                      {formatPhoneNumber(branch.mobile)}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="store-hours">
          <h2>Store Hours</h2>
          <table className="hours-table">
            <tbody>
              <tr>
                <td>Monday - Saturday</td>
                <td>9:00 AM - 9:00 PM</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>10:00 AM - 8:00 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="traditional-message">
          <div className="traditional-border">
            <p>We are dedicated to bringing the beauty of traditional Onam pookkolam designs to your celebrations. Contact us for custom designs and special arrangements for Onam festival!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;