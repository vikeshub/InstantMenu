import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "../hooks/use-toast";

const RestaurantSignup = () => {
  const [form, setForm] = useState({
    owner_name: "",
    outlet_name: "",
    mobile_no: "",
    outlet_type: "dine-in",
    email: "",
    state: "",
    city: "",
    address: "",
    password: "",
    confirm_password: "",
    zip_code: "",
    country: "",
    logo_url: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/restaurant/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      toast({
        title: "Registration Successful",
        description: data.message || "Restaurant registered successfully!",
        variant: "default"
      });
      setTimeout(() => navigate("/restaurant/login"), 1200);
    } catch (err) {
      toast({
        title: "Registration Error",
        description: err.message || "Registration failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <Link to="/restaurant" className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors">
            &larr; Back to Restaurant Portal
          </Link>
        </div>
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
           
            <CardTitle className="text-2xl font-bold text-gray-900">Register your restaurant</CardTitle>
            <CardDescription className="text-gray-600">Fill in the details to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="owner_name">Owner Name</Label>
                  <Input name="owner_name" value={form.owner_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="outlet_name">Outlet Name</Label>
                  <Input name="outlet_name" value={form.outlet_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="mobile_no">Mobile No</Label>
                  <Input name="mobile_no" value={form.mobile_no} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="outlet_type">Outlet Type</Label>
                  <Input name="outlet_type" value={form.outlet_type} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input name="state" value={form.state} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input name="city" value={form.city} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input name="address" value={form.address} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input name="zip_code" value={form.zip_code} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input name="country" value={form.country} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input name="logo_url" value={form.logo_url} onChange={handleChange} />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input name="password" type="password" value={form.password} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} required />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/restaurant/login" className="text-blue-600 hover:underline">Login here</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantSignup;
