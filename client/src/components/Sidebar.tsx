import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../api/authApi'; // update path as needed

const Sidebar: React.FC = () => {
  const { data: user } = useGetCurrentUserQuery(undefined);

  const staticLinks = [
    { name: 'Home', href: '/' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Orders', href: '/orders' },
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings' },
    { name: 'Role Management', href: '/role-management' },
  ];

  const restaurantOwnerLinks = [
    { name: 'Restaurant Management', href: '/restaurant-management' },
  ];

  const adminLinks = [
    { name: 'Restaurant Applications', href: '/restaurant-applications' },
  ];

  const dashboardLinks = [
    { role: 'customer', name: 'Customer Dashboard', href: '/dashboard/customer' },
    { role: 'restaurant_owner', name: 'Restaurant Dashboard', href: '/dashboard/restaurant' },
    { role: 'delivery_person', name: 'Delivery Dashboard', href: '/dashboard/delivery' },
    { role: 'admin', name: 'Admin Dashboard', href: '/dashboard/admin' },
  ];

  const userRoles: string[] =  user?.role || [];


  useEffect(() => {
    if (user) {
      console.log('User roles:', userRoles, user);
    }
  }, [user]);

  return (
    <aside className="hidden md:block bg-gray-100 p-4">
      <nav className="space-y-4 flex flex-col">
        {staticLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            {link.name}
          </NavLink>
        ))}
        { userRoles.includes("restaurant_owner") && restaurantOwnerLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            {link.name}
          </NavLink>
        ))}

      { userRoles.includes("admin") && adminLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className={({ isActive }) =>
              isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
            }
          >
            {link.name}
          </NavLink>
        ))}

        {userRoles.length > 0 && (
          <div className="pt-4 border-t border-gray-300 mt-4">
            <p className="text-sm text-gray-500 uppercase mb-2">Dashboards</p>
            <div className='flex flex-col gap-3'>
            {dashboardLinks
              .filter((link) => userRoles.includes(link.role))
              .map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
{/* 
        {userRoles.length > 0 && (
          <div className="pt-4 border-t border-gray-300 mt-4">
            <p className="text-sm text-gray-500 uppercase mb-2">Dashboards</p>
            <div className='flex flex-col gap-3'>
            {dashboardLinks
              .filter((link) => userRoles.includes(link.role))
              .map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    isActive ? 'text-red-500 font-semibold' : 'text-gray-700'
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        )} */}
      </nav>
    </aside>
  );
};

export default Sidebar;
