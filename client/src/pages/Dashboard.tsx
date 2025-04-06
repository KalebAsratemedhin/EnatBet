import { useGetCurrentUserQuery } from '../api/authApi';

const Dashboard = () => {
    const { data: user, isLoading, isError, isSuccess } = useGetCurrentUserQuery();

  return (
    <div className='text-black text-7xl'>
      Dashboard
      {isSuccess}
      {user.name}
      <p>Hello</p>
    </div>
  )
}

export default Dashboard