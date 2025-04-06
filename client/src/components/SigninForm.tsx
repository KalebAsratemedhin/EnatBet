import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../components/InputField';

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

  const onSubmit = (data: SigninFormValues) => {
    console.log('Signin Data:', data);
    // TODO: call your backend API
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-red-500">Sign In</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField label="Email" name="email" type="email" register={register} error={errors.email?.message} />
        <InputField label="Password" name="password" type="password" register={register} error={errors.password?.message} />

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SigninForm;
