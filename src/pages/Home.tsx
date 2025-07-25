import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
}

const Home = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Create new document objects
        const newDocuments = files.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadDate: new Date(),
          url: URL.createObjectURL(file)
        }));
        
        setDocuments(prev => [...prev, ...newDocuments]);
        setIsUploading(false);
        setUploadProgress(0);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }, 300);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📁';
  };

  // Information cards data
  const infoCards = [
    {
      title: "Secure Storage",
      description: "Your medical documents are stored with bank-level encryption, ensuring your privacy and security.",
      icon: "fas fa-shield-alt"
    },
    {
      title: "Easy Access",
      description: "Access your medical records anytime, anywhere, from any device with internet connection.",
      icon: "fas fa-mobile-alt"
    },
    {
      title: "Share Securely",
      description: "Share your medical records with healthcare providers securely with controlled access.",
      icon: "fas fa-share-alt"
    },
    {
      title: "Stay Organized",
      description: "Keep all your medical documents organized in one place with smart categorization.",
      icon: "fas fa-folder-open"
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Your Health Records in One Secure Place</h1>
          <p>Arogya Locker helps you store, manage, and access your medical documents anytime, anywhere.</p>
          {isAuthenticated ? (
            <Link to="/documents" className="cta-button">View Your Documents</Link>
          ) : (
            <Link to="/login" className="cta-button">Get Started</Link>
          )}
        </div>
        <div className="hero-image">
          <img src="https://img.freepik.com/free-vector/online-doctor-concept-illustration_114360-1783.jpg" alt="Medical Records" />
        </div>
      </div>
      
      <div className="info-cards-section">
        <h2>Why Choose Arogya Locker?</h2>
        <div className="info-cards">
          {infoCards.map((card, index) => (
            <div key={index} className="info-card">
              <div className="card-icon">
                <i className={card.icon}></i>
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {isAuthenticated && (
        <>
          <div className="upload-section">
            <h2>Recently Uploaded Documents</h2>
            <p>Upload your medical documents securely to access them anytime.</p>
            
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="file-input"
              id="file-upload"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label htmlFor="file-upload" className="upload-button">
              <i className="fas fa-cloud-upload-alt"></i> Upload Documents
            </label>
            
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span>{uploadProgress}%</span>
              </div>
            )}
          </div>
          
          <div className="documents-section">
            {documents.length === 0 ? (
              <div className="no-documents">
                <p>You haven't uploaded any documents yet.</p>
              </div>
            ) : (
              <div className="documents-grid">
                {documents.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div className="document-icon">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="document-info">
                      <h3 className="document-name">{doc.name}</h3>
                      <p className="document-details">
                        {formatFileSize(doc.size)} • {doc.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="document-actions">
                      <button 
                        className="view-button"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        View
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Documents</h3>
            <p>Securely upload your medical records, prescriptions, and test results.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Organize & Categorize</h3>
            <p>Your documents are automatically organized by type and date.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Access Anywhere</h3>
            <p>Access your medical records anytime, anywhere from any device.</p>
          </div>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Arogya Locker</h3>
            <p>Your secure medical document storage solution.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/documents">Documents</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/chat">Support</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@arogyalocker.com</p>
            <p>Phone: +91 7360813252</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Arogya Locker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home; 