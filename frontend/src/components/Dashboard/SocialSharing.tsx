import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SocialSharingProps {
  donationCount: number;
  lastDonationDate: string | null;
  bloodType: string | null;
}

const SocialSharing: React.FC<SocialSharingProps> = ({ 
  donationCount, 
  lastDonationDate, 
  bloodType 
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // Generate sharing message
  const generateShareMessage = () => {
    const username = user?.email?.split('@')[0] || 'A donor';
    let message = `${username} has donated blood ${donationCount} time${donationCount !== 1 ? 's' : ''}`;
    
    if (bloodType) {
      message += ` (Blood Type: ${bloodType})`;
    }
    
    message += `. Each donation can save up to 3 lives! Join me in making a difference. #BloodDonationAwareness #SaveLives`;
    
    return message;
  };

  // Generate URL for sharing
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${user?.id}`;
  };

  // Handle social media sharing
  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const message = encodeURIComponent(generateShareMessage());
    const url = encodeURIComponent(generateShareUrl());
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Copy share link to clipboard
  const copyToClipboard = () => {
    const message = generateShareMessage();
    const url = generateShareUrl();
    const fullMessage = `${message}\n\n${url}`;
    
    navigator.clipboard.writeText(fullMessage)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Generate a shareable card
  const generateShareCard = () => {
    setShowShareCard(true);
  };

  return (
    <div className="social-sharing-container">
      <h3>Share Your Impact</h3>
      <p>Let others know about your contribution and inspire them to donate!</p>
      
      <div className="sharing-buttons">
        <button 
          className="share-btn twitter"
          onClick={() => handleShare('twitter')}
          aria-label="Share on Twitter"
        >
          <i className="fab fa-twitter"></i> Twitter
        </button>
        
        <button 
          className="share-btn facebook"
          onClick={() => handleShare('facebook')}
          aria-label="Share on Facebook"
        >
          <i className="fab fa-facebook"></i> Facebook
        </button>
        
        <button 
          className="share-btn linkedin"
          onClick={() => handleShare('linkedin')}
          aria-label="Share on LinkedIn"
        >
          <i className="fab fa-linkedin"></i> LinkedIn
        </button>
        
        <button 
          className="share-btn copy-link"
          onClick={copyToClipboard}
          aria-label="Copy sharing link"
        >
          <i className={`fas ${copied ? 'fa-check' : 'fa-link'}`}></i> 
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        
        <button 
          className="share-btn generate-card"
          onClick={generateShareCard}
          aria-label="Generate shareable card"
        >
          <i className="fas fa-image"></i> Generate Card
        </button>
      </div>
      
      {showShareCard && (
        <div className="share-card-container">
          <div className="share-card">
            <div className="share-card-header">
              <h3>Blood Donation Achievement</h3>
            </div>
            
            <div className="share-card-content">
              <div className="share-card-icon">
                <i className="fas fa-tint"></i>
              </div>
              
              <div className="share-card-stats">
                <div className="stat">
                  <span className="stat-value">{donationCount}</span>
                  <span className="stat-label">Donations</span>
                </div>
                
                <div className="stat">
                  <span className="stat-value">{donationCount * 3}</span>
                  <span className="stat-label">Lives Impacted</span>
                </div>
                
                {bloodType && (
                  <div className="stat">
                    <span className="stat-value">{bloodType}</span>
                    <span className="stat-label">Blood Type</span>
                  </div>
                )}
              </div>
              
              <p className="share-card-message">
                Each donation can save up to 3 lives. Join me in making a difference!
              </p>
              
              <div className="share-card-footer">
                <span className="share-card-logo">Blood Donation Awareness</span>
                <span className="share-card-url">{window.location.origin}</span>
              </div>
            </div>
            
            <button 
              className="close-card-btn"
              onClick={() => setShowShareCard(false)}
              aria-label="Close share card"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <button 
              className="download-card-btn"
              onClick={() => {
                // In a real implementation, this would generate and download an image
                alert('In a production app, this would download the card as an image.');
              }}
              aria-label="Download share card"
            >
              <i className="fas fa-download"></i> Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialSharing; 