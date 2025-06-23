import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import RestaurantNavbar from "../components/layout/RestaurantNavbar";

const RestaurantLanding = () => {
  return (
    <>
      <RestaurantNavbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-orange-600">
            Welcome to Restaurant Portal
          </h1>
          <p className="mb-8 text-gray-600">
            Manage your restaurant, menu, and orders with ease.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              asChild
              className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-medium"
            >
              <Link to="/restaurant/login">Restaurant Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full md:w-auto"
            >
              <Link to="/restaurant/signup">Restaurant Signup</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantLanding;
