/ Format date/time
export const formatDate = (date, format = 'short') => {
  if (!date) return '-';
  
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  return d.toLocaleDateString();
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date, 'short');
};

// Format numbers with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('en-US');
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(decimals)}%`;
};

// Format match score
export const formatScore = (score1, score2) => {
  return `${score1 || 0} - ${score2 || 0}`;
};

// Format match time
export const formatMatchTime = (time) => {
  if (!time) return '0:00';
  
  // If time is just a number (minutes)
  if (typeof time === 'number') {
    return `${time}'`;
  }
  
  // If time is already formatted
  return time;
};

// Format team name (truncate if too long)
export const formatTeamName = (name, maxLength = 20) => {
  if (!name) return '-';
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};

// Format status badge text
export const formatStatus = (status) => {
  const statusMap = {
    live: 'LIVE',
    upcoming: 'UPCOMING',
    finished: 'FINISHED',
    pending: 'PENDING',
    correct: 'CORRECT',
    incorrect: 'INCORRECT'
  };
  return statusMap[status] || status.toUpperCase();
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};
