import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name?: string;
  email?: string;
  photo?: string;
  firstName?: string;
  lastName?: string;
  customAvatar?: string;
}

interface UserAvatarProps {
  user: UserData;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const getInitials = (): string => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleClick = () => {
    navigate('/profile');
  };

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full bg-amber-500 hover:bg-amber-600 transition-all duration-200 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-amber-200 hover:border-amber-300 shadow-md hover:shadow-lg hover:scale-105 ${className}`}
      title="Go to profile"
    >
      {user.customAvatar || user.photo ? (
        <img 
          src={user.customAvatar || user.photo} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      ) : (
        getInitials()
      )}
    </button>
  );
};

export default UserAvatar;