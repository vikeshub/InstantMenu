import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantProfile, updateRestaurantProfile } from "../features/restaurant/restaurantSlice";
import { Button } from "../components/ui/button";
import RestaurantNavbar from '../components/layout/RestaurantNavbar';
import { API_LIST } from "../api/apiList";

const API_UPLOAD_URL = 'http://localhost:3000/api/upload';

const RestaurantProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, user, status, error } = useSelector((state) => state.restaurant);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('restaurantAccessToken');
    if (!token) {
      navigate("/restaurant/login");
    } else {
      dispatch(fetchRestaurantProfile());
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (profile && user) {
      setForm({
        owner_name: user.name,
        outlet_name: profile.outlet_name,
        mobile_no: user.phone,
        outlet_type: profile.outlet_type,
        email: user.email,
        state: profile.state,
        city: profile.city,
        address: profile.address,
        zip_code: profile.zip_code,
        country: profile.country,
        logo_url: profile.logo_url,
      });
    }
  }, [profile, user]);

  if (!profile || !user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateRestaurantProfile(form)).then((res) => {
      if (!res.error) setEditMode(false);
    });
  };

  return (
    <>
      <RestaurantNavbar />
      <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <img
            src={form.logo_url || 'https://ui-avatars.com/api/?name=R'}
            alt="logo"
            className="w-24 h-24 rounded-full border border-gray-200 object-cover mb-4"
          />
          {editMode ? (
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <input name="owner_name" value={form.owner_name || ''} onChange={handleChange} className="input" placeholder="Owner Name" />
              <input name="outlet_name" value={form.outlet_name || ''} onChange={handleChange} className="input" placeholder="Outlet Name" />
              <input name="mobile_no" value={form.mobile_no || ''} onChange={handleChange} className="input" placeholder="Mobile No" />
              <input name="outlet_type" value={form.outlet_type || ''} onChange={handleChange} className="input" placeholder="Outlet Type" />
              <input name="email" value={form.email || ''} onChange={handleChange} className="input" placeholder="Email" />
              <input name="state" value={form.state || ''} onChange={handleChange} className="input" placeholder="State" />
              <input name="city" value={form.city || ''} onChange={handleChange} className="input" placeholder="City" />
              <input name="address" value={form.address || ''} onChange={handleChange} className="input" placeholder="Address" />
              <input name="zip_code" value={form.zip_code || ''} onChange={handleChange} className="input" placeholder="Zip Code" />
              <input name="country" value={form.country || ''} onChange={handleChange} className="input" placeholder="Country" />
              <input name="logo_url" value={form.logo_url || ''} onChange={handleChange} className="input" placeholder="Logo URL" />
              <input
                type="file"
                accept="image/*"
                id="logo_file"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 mt-2"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const token = localStorage.getItem('restaurantAccessToken');
                    const res = await fetch(API_UPLOAD_URL, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                      body: formData,
                    });
                    const data = await res.json();
                    if (res.ok && data.imageUrl) {
                      setForm(f => ({ ...f, logo_url: data.imageUrl }));
                    } else {
                      alert(data.error || 'Upload failed');
                    }
                  } catch (err) {
                    alert('Upload failed: ' + err.message);
                  }
                }}
              />
              {form.logo_url && (
                <div className="mt-2">
                  <img src={form.logo_url} alt="Logo Preview" className="h-16 rounded shadow border border-gray-200" />
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <Button type="submit" className="bg-orange-600 text-white">Save</Button>
                <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">{profile.outlet_name || 'Restaurant'}</h2>
              <p className="text-gray-600 mb-1">Owner: {user.name}</p>
              <p className="text-gray-600 mb-1">Email: {user.email}</p>
              <p className="text-gray-600 mb-1">Mobile: {user.phone}</p>
              <p className="text-gray-600 mb-1">Type: {profile.outlet_type}</p>
              <p className="text-gray-600 mb-1">Address: {profile.address}, {profile.city}, {profile.state}, {profile.country} - {profile.zip_code}</p>
              <Button className="mt-4" onClick={() => setEditMode(true)}>Edit Profile</Button>
            </>
          )}
          {status === 'loading' && <p className="text-orange-600 mt-2">Saving...</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default RestaurantProfile;
