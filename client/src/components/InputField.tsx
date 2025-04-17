import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  register: any;
  error?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type} 
        id={name}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
