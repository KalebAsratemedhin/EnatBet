import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../components/InputField';

const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
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

  const onSubmit = (data: SignupFormValues) => {
    console.log('Signup Data:', data);
    // TODO: call your backend API
  };

  return (
    <div className="p-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-red-500">Create an Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className='w-96'>
        <InputField label="Full Name" name="name" register={register} error={errors.name?.message} />
        <InputField label="Email" name="email" type="email" register={register} error={errors.email?.message} />
        <InputField label="Phone Number" name="phone" register={register} error={errors.phone?.message} />
        <InputField label="Address" name="address" register={register} error={errors.address?.message} />
        <InputField label="Password" name="password" type="password" register={register} error={errors.password?.message} />

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
