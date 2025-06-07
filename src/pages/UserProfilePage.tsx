import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, User, Mail, Edit2, Save, X } from 'lucide-react';
import GoogleLoginButton from '../components/common/Login';

interface UserData {
  name?: string;
  email?: string;
  photo?: string;
  firstName?: string;
  lastName?: string;
  customAvatar?: string;
}

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData>({});
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('savr-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEditedUser(userData);
    } else {
      navigate('/');
    }
  }, [navigate]);


  // Generate avatar initials
  const getInitials = (name?: string, firstName?: string, lastName?: string): string => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedUser(prev => ({ ...prev, customAvatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSave = () => {
    const updatedUser = { ...user, ...editedUser };
    setUser(updatedUser);
    localStorage.setItem('savr-user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedUser(user || {});
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-center">
          <p className="text-xl mb-4">Please log in to view your profile</p>
          <GoogleLoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Main Content */}
      <div className="pt-16 sm:pt-20 md:pt-24 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-600 mb-2">User Profile</h1>
            <p className="text-stone-600">Manage your account settings</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold overflow-hidden border-4 border-amber-200">
                  {(isEditing ? editedUser.customAvatar : user.customAvatar) || user.photo ? (
                    <img 
                      src={(isEditing ? editedUser.customAvatar : user.customAvatar) || user.photo} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user.name, isEditing ? editedUser.firstName : user.firstName, isEditing ? editedUser.lastName : user.lastName)
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-stone-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={isEditing ? (editedUser.email || '') : (user.email || '')}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isEditing 
                      ? 'border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                      : 'border-stone-200 bg-stone-50'
                  } focus:outline-none transition-all`}
                />
              </div>

              {/* First Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-stone-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  First Name
                </label>
                <input
                  type="text"
                  value={isEditing ? (editedUser.firstName || '') : (user.firstName || '')}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your first name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isEditing 
                      ? 'border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                      : 'border-stone-200 bg-stone-50'
                  } focus:outline-none transition-all`}
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-stone-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Last Name
                </label>
                <input
                  type="text"
                  value={isEditing ? (editedUser.lastName || '') : (user.lastName || '')}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="Enter your last name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isEditing 
                      ? 'border-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500' 
                      : 'border-stone-200 bg-stone-50'
                  } focus:outline-none transition-all`}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-6 py-3 bg-stone-500 hover:bg-stone-600 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;