import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCurrentUserQuery, useUpdateUserProfileMutation } from '../api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().max(50, 'Name cannot exceed 50 characters').required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: yup.string().matches(
    /^(?:(?:\+251|251|0)?9\d{8}|(?:\+251|251|0)?1[1-9]\d{6})$/,
    'Please enter a valid Ethiopian phone number'
  ).required('Phone number is required'),
  address: yup.string().required('Address is required'),
}).required();

const ProfilePage = () => {
  const { data: user, isLoading } = useGetCurrentUserQuery();
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phoneNumber', user.phoneNumber);
      setValue('address', user.address);
    }
  }, [user, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('address', data.address);
    if (image) formData.append('profilePicture', image);

    try {
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      
      const response = await updateUserProfile(formData).unwrap();

      // Handle the response and show success message
      if (response.success) {
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.log("error", err);
      alert('Error updating profile');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex justify-center items-center text-2xl text-white">
            {user?.profileImage ? (
              <img src={user?.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase()
            )}
          </div>
          <input
            type="file"
            className="ml-4"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
            disabled
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            {...register('phoneNumber')}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
          />
          {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            {...register('address')}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md"
          />
          {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
