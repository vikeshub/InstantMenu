import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Truck } from 'lucide-react';

const Button = ({ children, className = '', variant = '', size = '', ...props }) => {
  let base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variants = {
    ghost: 'bg-transparent hover:bg-gray-100',
    default: 'bg-orange-600 hover:bg-orange-700 text-white',
  };
  let sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
  };
  return (
    <button
      className={`${base} ${variants[variant] || ''} ${sizes[size] || ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Separator = () => <div className="border-t border-gray-100 my-2" />;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FoodDash</span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">Home</Link>
            <Link to="/restaurant" className="text-gray-700 hover:text-orange-600 transition-colors">Restaurants</Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</Link>
          </div>
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart (0)
            </Button>
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
              <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Home</Link>
              <Link to="/restaurants" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Restaurants</Link>
              <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">About</Link>
              <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Contact</Link>
              <Separator />
              <div className="px-4 space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart (0)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
