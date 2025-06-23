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
    navigate('/restaurant'); // Redirect to home page
    // Optionally, force a reload to clear Redux state
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">InstantMenu</span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/restaurant" className="text-gray-700 hover:text-orange-600 transition-colors">Dashboard</Link>
            <Link to="/restaurant/orders" className="text-gray-700 hover:text-orange-600 transition-colors">Orders</Link>
            <Link to="/restaurant/menu" className="text-gray-700 hover:text-orange-600 transition-colors">Menu</Link>
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
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
                  <span className="font-medium text-gray-800">{restaurant?.outlet_name || 'Restaurant'}</span>
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
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 pb-4">
            <div className="pt-4 space-y-3">
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
                    onClick={() => navigate('/restaurant/profile')}
                  >
                    Edit Profile
                  </Button>
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default RestaurantNavbar;
