import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { useSigninMutation } from '../api/authApi';
import Snackbar from './Snackbar';
import LoadingSpinner from './LoadingSpinner';

const signinSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type SigninFormValues = yup.InferType<typeof signinSchema>;

const SigninForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: yupResolver(signinSchema),
  });
  const [signin, { isError, isLoading, error, isSuccess }] = useSigninMutation();
  const navigator = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);


  const onSubmit = async (data: SigninFormValues) => {
    try {
      const response = await signin(data).unwrap();
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('User signed in:', response.user);
      // Redirect, show message, etc.
    } catch (err) {
      console.error('Signin error:', err);
    }
  };


  useEffect(() => {
    if (isError) {
      console.error('Sigin error:', error);
      setSnackbar({ message: 'Error Signing in', type: 'error' });
    }
    if (isSuccess) {
      setSnackbar({ message: 'Signed in', type: 'success' });

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      navigator(`/dashboard/${user.role}`); 
    }
  }, [isError, isSuccess, error]);
  

  return (
    <div className="p-10  bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">Sign In to <span className='text-red-500'>Enat Bet</span></h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className='w-96'>
        <InputField label="Email" name="email" type="email" register={register} error={errors.email?.message} />
        <InputField label="Password" name="password" type="password" register={register} error={errors.password?.message} />

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Sign In
        </button>
        <p className="text-sm text-gray-600 mt-4 text-center">
        Don’t have an account?{' '}
       
       { 
       isLoading ?
        <LoadingSpinner /> :
        <Link to="/signup" className="text-red-500 hover:underline">
            Sign Up
        </Link> 
       }
      </p>

      <p className="text-xs text-gray-500 mt-2 text-center">
        By signing in, you agree to our{' '}
        <a href="/terms" target="_blank" className="underline text-red-500">
          Terms & Conditions
        </a>{' '}
        and{' '}
        <a href="/privacy" target="_blank" className="underline text-red-500">
          Privacy Policy
        </a>.
      </p>
      </form>
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
};

export default SigninForm;
