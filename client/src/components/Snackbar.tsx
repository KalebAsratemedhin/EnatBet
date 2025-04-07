import React, { useEffect } from 'react';

type SnackbarProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

const Snackbar: React.FC<SnackbarProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 text-white rounded shadow-lg ${bgColor} z-50`}>
      {message}
    </div>
  );
};

export default Snackbar;
