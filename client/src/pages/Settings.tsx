import React, { useState } from 'react';
import { useChangePasswordMutation, useDeleteAccountMutation, useVerifyEmailMutation } from '../api/authApi'; // Assuming RTK Query setup
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Validation schema for change password
const passwordSchema = yup.object({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
});

const SettingsPage: React.FC = () => {
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();
  const [verifyEmail, { isLoading: isVerifyingEmail }] = useVerifyEmailMutation();
  const [emailVerified, setEmailVerified] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleChangePassword = async (data: any) => {
    try {
      await changePassword(data).unwrap();
      alert('Password changed successfully');
    } catch (err) {
      alert('Error changing password');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await verifyEmail().unwrap();
      setEmailVerified(true);
      alert('Email verified successfully');
    } catch (err) {
      alert('Error verifying email');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      alert('Account deleted successfully');
    } catch (err) {
      alert('Error deleting account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-red-500">Account Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700">Change Password</h2>
        <form onSubmit={handleSubmit(handleChangePassword)} className="mt-6">
          <div>
            <label htmlFor="oldPassword" className="block text-gray-600">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              {...register('oldPassword')}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
            {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}
          </div>
          <div className="mt-4">
            <label htmlFor="newPassword" className="block text-gray-600">New Password:</label>
            <input
              type="password"
              id="newPassword"
              {...register('newPassword')}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700">Email Verification</h2>
        <div className="mt-4">
          <button
            onClick={handleVerifyEmail}
            className={`px-6 py-2 rounded-md ${
              emailVerified ? 'bg-green-500' : 'bg-yellow-500'
            } text-white`}
            disabled={isVerifyingEmail || emailVerified}
          >
            {emailVerified ? 'Email Verified' : 'Verify Email'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700">Account Management</h2>
        <div className="mt-4">
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-500 text-white rounded-md"
            disabled={isDeletingAccount}
          >
            {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
