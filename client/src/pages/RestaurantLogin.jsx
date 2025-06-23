import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "../hooks/use-toast";

const RestaurantLogin = () => {
  const [form, setForm] = useState({
    identifier: "",
    password: ""
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
      const response = await fetch("http://localhost:3000/api/restaurant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      // Store accessToken for protected API calls
      localStorage.setItem('restaurantAccessToken', data.accessToken);
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.user.name}!`,
        variant: "default"
      });
      setTimeout(() => navigate("/restaurant"), 1200);
    } catch (err) {
      toast({
        title: "Login Error",
        description: err.message || "Login failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Restaurant Login</CardTitle>
          <CardDescription>Sign in to your restaurant portal</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="identifier">Email or Mobile</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="Email or Mobile"
                value={form.identifier}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account? <Link to="/restaurant/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantLogin;
