import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHome, FaUsers, FaFileCode, FaEnvelope, FaShoppingCart } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FaHome /> },
    { name: 'Leads', path: '/leads', icon: <FaUsers /> },
    { name: 'Website Templates', path: '/website-templates', icon: <FaFileCode /> },
    { name: 'Email Templates', path: '/email-templates', icon: <FaEnvelope /> },
    { name: 'Orders', path: '/orders', icon: <FaShoppingCart /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Business Website Automater</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center p-4 hover:bg-gray-700 ${
                router.pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout; 