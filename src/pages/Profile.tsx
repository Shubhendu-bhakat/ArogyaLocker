import { useState } from 'react';
import './Profile.css';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    dob: '1990-01-01',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '123 Main Street, City, State, 123456',
    emergencyContact: '+91 9876543211'
  });
  
  const [formData, setFormData] = useState<UserProfile>({...profile});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({...formData});
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setFormData({...profile});
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your personal information</p>
      </div>
      
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {profile.name.charAt(0)}
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="bloodGroup">Blood Group</label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  required
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="emergencyContact">Emergency Contact</label>
              <input
                type="tel"
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-buttons">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-row">
              <div className="detail-group">
                <h3>Full Name</h3>
                <p>{profile.name}</p>
              </div>
              
              <div className="detail-group">
                <h3>Email</h3>
                <p>{profile.email}</p>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-group">
                <h3>Phone Number</h3>
                <p>{profile.phone}</p>
              </div>
              
              <div className="detail-group">
                <h3>Date of Birth</h3>
                <p>{new Date(profile.dob).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-group">
                <h3>Gender</h3>
                <p>{profile.gender}</p>
              </div>
              
              <div className="detail-group">
                <h3>Blood Group</h3>
                <p>{profile.bloodGroup}</p>
              </div>
            </div>
            
            <div className="detail-group">
              <h3>Address</h3>
              <p>{profile.address}</p>
            </div>
            
            <div className="detail-group">
              <h3>Emergency Contact</h3>
              <p>{profile.emergencyContact}</p>
            </div>
            
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 