// components/Toast.jsx
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000,
  position = 'top-right' 
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: 'text-green-600',
      progress: 'bg-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: 'text-red-600',
      progress: 'bg-red-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      progress: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      progress: 'bg-blue-500'
    }
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  const animationClasses = isExiting 
    ? 'animate-slide-out opacity-0' 
    : 'animate-slide-in';

  return (
    <div
      className={`fixed ${positions[position]} z-50 ${animationClasses}`}
    >
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg max-w-md ${colors[type].bg} ${colors[type].border}`}
      >
        <div className={`flex-shrink-0 ${colors[type].icon}`}>
          {icons[type]}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${colors[type].text}`}>
            {message}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ${colors[type].text} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Progress bar */}
      {duration && (
        <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${colors[type].progress} animate-progress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </>
  );
};

// Custom hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000, position = 'top-right') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration, position }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message, duration, position) => {
    addToast(message, 'success', duration, position);
  };

  const showError = (message, duration, position) => {
    addToast(message, 'error', duration, position);
  };

  const showWarning = (message, duration, position) => {
    addToast(message, 'warning', duration, position);
  };

  const showInfo = (message, duration, position) => {
    addToast(message, 'info', duration, position);
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default Toast;