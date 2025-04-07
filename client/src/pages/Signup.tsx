import React from 'react';
import SignupForm from '../components/SignupForm';

const Signup: React.FC = () => {
 
  return (
    <div className="flex justify-center items-center bg-buffet bg-no-repeat bg-cover min-h-screen p-12">
      <SignupForm />
    </div>
  );
};

export default Signup;
