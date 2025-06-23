import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { toast } from "../hooks/use-toast";
import {
  ChefHat,
  ArrowLeft,
  Store,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  Globe,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

const outletTypes = [
  "Dine-In",
  "Takeaway",
  "Drive-Thru",
  "Delivery Only",
  "Cloud Kitchen",
  "Café",
  "Buffet",
  "Fine Dining",
  "Quick Service Restaurant",
  "Food Court Stall",
  "Bakery",
  "Dessert Parlour",
  "Juice Bar",
  "Bar & Grill",
  "Pub",
  "Lounge",
  "Sweet Shop",
  "Pizzeria",
  "Seafood Restaurant",
  "Ethnic Cuisine Restaurant",
  "Family Style Restaurant",
  "Pop-Up Restaurant",
  "Theme Restaurant",
  "Food Truck",
  "Tiffin Service",
];

const RestaurantSignup = () => {
  const [form, setForm] = useState({
    owner_name: "",
    outlet_name: "",
    mobile_no: "",
    outlet_type: "Dine-In",
    email: "",
    state: "",
    city: "",
    address: "",
    password: "",
    confirm_password: "",
    zip_code: "",
    country: "",
    logo_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setForm({ ...form, outlet_type: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/restaurant/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      toast({
        title: "Registration Successful",
        description: data.message || "Restaurant registered successfully!",
        variant: "default",
      });
      setTimeout(() => navigate("/restaurant/login"), 1200);
    } catch (err) {
      toast({
        title: "Registration Error",
        description: err.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/restaurant"
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">
                Back to Restaurant Portal
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                New! Register your restaurant
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Restaurant Registration
            </CardTitle>
            <CardDescription className="text-orange-100 text-lg mt-2">
              Register your restaurant • Fill in the details to get started.
              It's free!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner_name" className="text-sm font-medium text-gray-700">Owner Name</Label>
                    <Input id="owner_name" name="owner_name" type="text" value={form.owner_name} onChange={handleChange} className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile_no" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input id="mobile_no" name="mobile_no" type="tel" value={form.mobile_no} onChange={handleChange} className="h-11 pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="+1 (555) 123-4567" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="h-11 pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="your@email.com" required />
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* Restaurant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-orange-500" />
                  Restaurant Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="outlet_name" className="text-sm font-medium text-gray-700">Restaurant Name</Label>
                    <Input id="outlet_name" name="outlet_name" type="text" value={form.outlet_name} onChange={handleChange} className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="Your Restaurant Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outlet_type" className="text-sm font-medium text-gray-700">Restaurant Type</Label>
                    <Select onValueChange={handleSelectChange} defaultValue={form.outlet_type}>
                      <SelectTrigger className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select restaurant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {outletTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logo_url" className="text-sm font-medium text-gray-700">Logo URL (Optional)</Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input id="logo_url" name="logo_url" type="url" value={form.logo_url} onChange={handleChange} className="h-11 pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="https://example.com/logo.png" />
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Location Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input id="country" name="country" type="text" value={form.country} onChange={handleChange} className="h-11 pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="United States" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">State/Province</Label>
                    <Input id="state" name="state" type="text" value={form.state} onChange={handleChange} className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="California" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                    <Input id="city" name="city" type="text" value={form.city} onChange={handleChange} className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="San Francisco" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code" className="text-sm font-medium text-gray-700">Zip Code</Label>
                    <Input id="zip_code" name="zip_code" type="text" value={form.zip_code} onChange={handleChange} className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="94105" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">Complete Address</Label>
                    <Input id="address" name="address" type="text" value={form.address} onChange={handleChange} className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="123 Main Street, Suite 456" required />
                  </div>
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* Security Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-500" />
                  Security Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} className="h-11 pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="Create a strong password" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input id="confirm_password" name="confirm_password" type={showConfirmPassword ? "text" : "password"} value={form.confirm_password} onChange={handleChange} className="h-11 pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500" placeholder="Confirm your password" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <div className="pt-6">
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing up...
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/restaurant/login" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantSignup;
