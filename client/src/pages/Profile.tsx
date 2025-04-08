import { useGetCurrentUserQuery } from '../api/authApi';

const Profile = () => {
  const { data: user, isLoading, isError, isSuccess } = useGetCurrentUserQuery();

  return (
    <div>
      Profile
      {isSuccess}
      {user.name}
    </div>
  )
}

export default Profile


// restaurant owner, delivery person, customer, admin
