import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Truck } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantProfile } from '../../features/restaurant/restaurantSlice';
import { toast } from '../../hooks/use-toast';

const RestaurantNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const { profile: restaurant, user, status } = useSelector(state => state.restaurant);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Only fetch profile if accessToken exists (user is logged in)
  useEffect(() => {
    const token = localStorage.getItem('restaurantAccessToken');
    if (token) {
      dispatch(fetchRestaurantProfile());
    }
  }, [dispatch]);

  // Close mobile menu on route change
  useEffect(() => {
    const closeMenu = () => setIsMenuOpen(false);
    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurantUser');
    localStorage.removeItem('restaurantAccessToken');
    document.cookie = 'jwt=; Max-Age=0; path=/;';
    toast({
      title: 'Logged out',
      description: 'User logged out successfully.',
      variant: 'default',
    });
    setDropdownOpen(false);
    navigate('/restaurant');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 truncate">InstantMenu</span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/restaurant" className="text-gray-700 hover:text-orange-600 transition-colors whitespace-nowrap">Dashboard</Link>
            <Link to="/restaurant/orders" className="text-gray-700 hover:text-orange-600 transition-colors whitespace-nowrap">Orders</Link>
            <Link to="/restaurant/menu" className="text-gray-700 hover:text-orange-600 transition-colors whitespace-nowrap">Menu</Link>
          </div>
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {!user || !localStorage.getItem('restaurantAccessToken') ? (
              <Button variant="ghost" size="sm">
                <Link to="/restaurant/login">Sign In</Link>
              </Button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  <img
                    src={restaurant?.logo_url || 'https://ui-avatars.com/api/?name=R'}
                    alt="avatar"
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                  />
                  <span className="font-medium text-gray-800 truncate max-w-[100px]">{restaurant?.outlet_name || 'Restaurant'}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/restaurant/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Hamburger Icon for Mobile */}
          <div className="flex lg:hidden items-center">
            <button
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} overflow-hidden bg-white border-t border-gray-100 shadow-sm`}
        >
          <div className="pt-4 pb-4 space-y-3">
            <Link to="/restaurant" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Dashboard</Link>
            <Link to="/restaurant/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Orders</Link>
            <Link to="/restaurant/menu" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Menu</Link>
            <Link to="/restaurant/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Profile</Link>
            <Separator />
            {!user ? (
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Link to="/restaurant/login">Sign In</Link>
              </Button>
            ) : (
              <div className="px-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => { setIsMenuOpen(false); navigate('/restaurant/profile'); }}
                >
                  Edit Profile
                </Button>
                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RestaurantNavbar;
