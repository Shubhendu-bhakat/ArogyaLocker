import { useState, useEffect, useRef } from 'react';
import './Documents.css';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
  category: string;
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate loading documents from backend
    // In a real app, this would be an API call to fetch documents from your backend
    setTimeout(() => {
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Blood Test Results.pdf',
          type: 'application/pdf',
          size: 1024 * 1024 * 2.5, // 2.5MB
          uploadDate: new Date(2023, 5, 15),
          url: '#',
          category: 'lab-results'
        },
        {
          id: '2',
          name: 'X-Ray Report.jpg',
          type: 'image/jpeg',
          size: 1024 * 1024 * 3.2, // 3.2MB
          uploadDate: new Date(2023, 4, 22),
          url: '#',
          category: 'imaging'
        },
        {
          id: '3',
          name: 'Prescription.pdf',
          type: 'application/pdf',
          size: 1024 * 512, // 512KB
          uploadDate: new Date(2023, 6, 10),
          url: '#',
          category: 'prescriptions'
        },
        {
          id: '4',
          name: 'Vaccination Certificate.pdf',
          type: 'application/pdf',
          size: 1024 * 1024 * 1.1, // 1.1MB
          uploadDate: new Date(2023, 3, 5),
          url: '#',
          category: 'certificates'
        },
        {
          id: '5',
          name: 'MRI Scan.jpg',
          type: 'image/jpeg',
          size: 1024 * 1024 * 5.7, // 5.7MB
          uploadDate: new Date(2023, 2, 18),
          url: '#',
          category: 'imaging'
        },
        {
          id: '6',
          name: 'Discharge Summary.pdf',
          type: 'application/pdf',
          size: 1024 * 1024 * 1.8, // 1.8MB
          uploadDate: new Date(2023, 1, 30),
          url: '#',
          category: 'reports'
        }
      ];
      
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1500);
  }, []);

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

  const categories = [
    { id: 'all', name: 'All Documents' },
    { id: 'lab-results', name: 'Lab Results' },
    { id: 'imaging', name: 'Imaging' },
    { id: 'prescriptions', name: 'Prescriptions' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'reports', name: 'Reports' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDeleteDocument = (id: string) => {
    // In a real app, this would make an API call to delete the document from your backend
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
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
          url: URL.createObjectURL(file),
          category: getCategoryFromFileType(file.type)
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

  const getCategoryFromFileType = (type: string) => {
    if (type.includes('image')) return 'imaging';
    if (type.includes('pdf') && type.includes('prescription')) return 'prescriptions';
    if (type.includes('pdf') && type.includes('certificate')) return 'certificates';
    if (type.includes('pdf') && type.includes('lab')) return 'lab-results';
    return 'reports';
  };

  return (
    <div className="documents-container">
      <div className="documents-header">
        <h1>Your Medical Locker</h1>
        <p>Access all your medical documents in one secure place</p>
      </div>
      
      <div className="documents-actions">
        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="upload-container">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="file-input"
            id="document-upload"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="document-upload" className="upload-button">
            <i className="fas fa-cloud-upload-alt"></i> Upload Document
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
      </div>
      
      <div className="documents-content">
        <div className="categories-sidebar">
          <h3>Categories</h3>
          <ul className="categories-list">
            {categories.map(category => (
              <li 
                key={category.id}
                className={activeCategory === category.id ? 'active' : ''}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="documents-main">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading your documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="no-documents">
              {searchTerm ? (
                <p>No documents match your search.</p>
              ) : (
                <p>No documents in this category.</p>
              )}
            </div>
          ) : (
            <div className="documents-list">
              <div className="documents-list-header">
                <span className="column-name">Name</span>
                <span className="column-date">Date</span>
                <span className="column-size">Size</span>
                <span className="column-actions">Actions</span>
              </div>
              
              {filteredDocuments.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="document-name">
                    <span className="document-icon">{getFileIcon(doc.type)}</span>
                    <span className="name-text">{doc.name}</span>
                  </div>
                  <div className="document-date">
                    {doc.uploadDate.toLocaleDateString()}
                  </div>
                  <div className="document-size">
                    {formatFileSize(doc.size)}
                  </div>
                  <div className="document-actions">
                    <button 
                      className="view-button"
                      onClick={() => window.open(doc.url, '_blank')}
                      title="View document"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="download-button"
                      onClick={() => window.open(doc.url, '_blank')}
                      title="Download document"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteDocument(doc.id)}
                      title="Delete document"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Comment: Backend Integration Instructions
          1. Replace the mock data with actual API calls to fetch documents from your database
          2. Implement proper authentication to ensure users can only access their own documents
          3. Set up cloud storage (like Firebase Storage, AWS S3, etc.) to store the actual files
          4. Create API endpoints for:
             - Fetching all documents
             - Uploading new documents
             - Deleting documents
             - Downloading documents
          5. Add proper error handling for API calls
      */}
    </div>
  );
};

export default Documents; 