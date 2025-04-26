import React from 'react';
import SigninForm from '../components/SigninForm';

const Signin: React.FC = () => {
 
  return (
    <div className="flex justify-center items-center bg-[url(/kitchen-table-bg.jpg)]  bg-no-repeat bg-cover min-h-screen">
      <SigninForm />
    </div>
  );
};

export default Signin;
