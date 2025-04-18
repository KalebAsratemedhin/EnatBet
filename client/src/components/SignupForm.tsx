import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../components/InputField';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../api/authApi';

const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, 'Phone must be digits only')
    .min(10, 'Phone must be at least 10 digits')
    .required('Phone is required'),
  address: yup.string().required('Address is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type SignupFormValues = yup.InferType<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
  });
  const [signup, { isLoading, isError, error, isSuccess }] = useSignupMutation();
  const navigator = useNavigate();

  const onSubmit = async (data: SignupFormValues) => {
    console.log("signing up", data)
    try {
      const response = await signup(data).unwrap();
      console.log("response", response)
      // Assuming response = { token, user }
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('User signed up:', response.user);
      // You can redirect or show a success message
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  useEffect(() => {
    if (isError) {
      console.error('Signup error:', error);
    }
    if (isSuccess) {
      navigator("/dashboard"); 
      console.log('Signup successful');
    }
  }, [isError, isSuccess, error]);
  

  return (
    <div className="p-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">Sign Up to <span className='text-red-500'>Enat Bet</span></h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className='w-96'>
        <InputField label="Full Name" name="name" register={register} error={errors.name?.message} />
        <InputField label="Email" name="email" type="email" register={register} error={errors.email?.message} />
        <InputField label="Phone Number" name="phoneNumber" register={register} error={errors.phoneNumber?.message} />
        <InputField label="Address" name="address" register={register} error={errors.address?.message} />
        <InputField label="Password" name="password" type="password" register={register} error={errors.password?.message} />

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Sign Up
        </button>
        <p className="text-sm text-gray-600 mt-4 text-center">
        Already have an account?{' '}
        <Link to="/signin" className="text-red-500 hover:underline">
          Sign In
        </Link>
      </p>

      <p className="text-xs text-gray-500 mt-2 text-center">
        By signing up, you agree to our{' '}
        <a href="/terms" target="_blank" className="underline text-red-500">
          Terms & Conditions
        </a>{' '}
        and{' '}
        <a href="/privacy" target="_blank" className="underline text-red-500">
          Privacy Policy
        </a>.
      </p>
      </form>
    </div>
  );
};

export default SignupForm;
