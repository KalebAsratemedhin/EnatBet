import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCurrentUserQuery, useUpdateUserProfileMutation } from '@/redux/api/authApi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

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
      await updateUserProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Error updating profile');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">Update Profile</h2>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex justify-center items-center text-white overflow-hidden">
                  {user?.profileImage ? (
                    <img
                      src={user?.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} disabled />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" {...register('phoneNumber')} />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
