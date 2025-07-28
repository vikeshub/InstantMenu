import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { MdArrowDropDown } from "react-icons/md";
import { IoMdArrowDropup } from "react-icons/io";
import { API_LIST } from "../api/apiList";
import { toast } from "../hooks/use-toast";

const AddMenuItemModal = ({
  show,
  onClose,
  onSubmit,
  addName,
  setAddName,
  addDesc,
  setAddDesc,
  addPrice,
  setAddPrice,
  addLoading,
  addError,
  addDiscountedPrice,
  setAddDiscountedPrice,
  addStatus,
  setAddStatus,
  addItemType,
  setAddItemType,
  addImageUrl,
  setAddImageUrl,
  addIsAvailable,
  setAddIsAvailable,
  addSpicyLevel,
  setAddSpicyLevel,
  addIngredients,
  setAddIngredients,
  addonName = [],
  addonPrice = [],
  isEditMode = false,
  menuId = null,
  itemId = null,
  onAddonDeleted = null
}) => {
  const fileInputRef = React.useRef(null);
  const [addonsList, setAddonsList] = React.useState([]);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [originalAddonCount, setOriginalAddonCount] = React.useState(0);

  // Function to handle delete addon API call
  const handleDeleteAddon = async (addonId) => {
    // Find the addon by ID
    const addonIndex = addonsList.findIndex(addon => addon.id === addonId);
    if (addonIndex === -1) {
      console.error('Addon not found:', addonId);
      return;
    }

    const addon = addonsList[addonIndex];
    
    console.log('Delete addon:', {
      addonId,
      addonIndex,
      originalAddonCount,
      isLocalAddon: addon.isLocal,
      totalAddons: addonsList.length
    });
    
    if (addon.isLocal) {
      // This is a local addon that hasn't been saved yet, just remove from local state
      setAddonsList(prev => prev.filter(a => a.id !== addonId));
      toast({
        title: "Success",
        description: "Addon removed from form",
        variant: "default",
      });
      return;
    }

    // This is a database addon, need to call API
    if (!menuId || !itemId) {
      toast({
        title: "Error",
        description: "Menu ID or Item ID is missing. Cannot delete addon.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const response = await fetch(API_LIST.DELETE_ADDON(menuId, itemId, addon.dbIndex), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete addon');
      }

      const result = await response.json();
      
      // Update the local addons list by removing the deleted addon
      setAddonsList(prev => prev.filter(a => a.id !== addonId));
      
      toast({
        title: "Success",
        description: "Addon deleted successfully",
        variant: "default",
      });

      // If this is edit mode and we have a callback to refresh the parent data
      if (isEditMode && result.item) {
        // Call the callback to update the parent component
        if (onAddonDeleted) {
          onAddonDeleted(result.item);
        }
      }
    } catch (error) {
      console.error('Error deleting addon:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete addon",
        variant: "destructive",
      });
    }
  };

    // Sync addons with parent data
  React.useEffect(() => {
    if (Array.isArray(addonName) && Array.isArray(addonPrice) && addonName.length > 0) {
      const newAddonsList = addonName.map((name, idx) => {
        const price = addonPrice[idx];
        return { 
          id: `addon-${idx}`, // Assign a unique ID
          name: String(name || ''), 
          price: String(price || ''),
          isLocal: false, // Indicate if it's a local addon
          dbIndex: idx // Store the original index from parent data
        };
      });
      setAddonsList(newAddonsList);
      setOriginalAddonCount(addonName.length); // Set original count from parent data
      console.log('Setting original addon count:', addonName.length, 'for edit mode:', isEditMode);
      console.log('Initial addons:', newAddonsList);
    } else if (!isEditMode) {
      // Reset addons for new items
      setAddonsList([]);
      setOriginalAddonCount(0); // Reset original count for new items
      console.log('Resetting addon count for new item');
    }
  }, [addonName, addonPrice, isEditMode]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2">
      <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-2 text-center">{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
        <div className="flex items-center justify-center mb-2">
          {/* Image preview placeholder */}
          <div
            className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer border border-dashed border-orange-400 hover:bg-orange-50 transition"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Click to upload image"
          >
            {addImageUrl ? (
              <img src={addImageUrl} alt="Menu Item" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400 text-xs">No Image</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = ev => setAddImageUrl(ev.target.result);
              reader.readAsDataURL(file);
              // Optionally, you can also upload the file to the server here
            }}
          />
        </div>
        <form onSubmit={e => {
          e.preventDefault();
          const formData = {
            name: String(addName || ''),
            description: String(addDesc || ''),
            price: Number(addPrice) || 0,
            discounted_price: Number(addDiscountedPrice) || 0,
            status: String(addStatus || ''),
            item_type: String(addItemType || ''),
            image_url: String(addImageUrl || ''),
            is_available: Boolean(addIsAvailable),
            spicy_level: String(addSpicyLevel || ''),
            ingredients: String(addIngredients || '').split(',').map(s => s.trim()).filter(Boolean),
            addons: addonsList.map(addon => ({
              name: String(addon.name || ''),
              price: String(addon.price || '')
            })),
          };
          onSubmit(formData);
        }} className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="item-name" className="block text-xs font-medium">Item Name*</Label>
              <Input id="item-name" type="text" value={addName} onChange={e => setAddName(e.target.value)} required className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" />
            </div>
            <div>
              <Label className="block text-xs font-medium">Status</Label>
              <Select value={addStatus} onValueChange={setAddStatus}>
                <SelectTrigger className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NoStatus">NoStatus</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Seasonal">Seasonal</SelectItem>
                  <SelectItem value="Bestseller">Bestseller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="item-price" className="block text-xs font-medium">Price*</Label>
              <Input id="item-price" type="number" value={addPrice} onChange={e => setAddPrice(e.target.value)} required className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" />
            </div>
            <div>
              <Label htmlFor="discount-price" className="block text-xs font-medium">Discount Price</Label>
              <Input id="discount-price" type="number" value={addDiscountedPrice} onChange={e => setAddDiscountedPrice(e.target.value)} className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" />
            </div>
            <div>
              <Label htmlFor="item-type" className="block text-xs font-medium">Item Type</Label>
              <div className="grid grid-cols-3 gap-1 mt-0.5">
                <button type="button" onClick={() => setAddItemType('not-defined')} className={`py-1 rounded text-xs ${addItemType==='not-defined' ? 'bg-gray-200 border-2 border-orange-500' : 'bg-white border border-gray-300'} text-gray-900 flex flex-col items-center`}>
                  <span className="text-sm">🚫</span>
                  <span className="text-[8px]">Not Defined</span>
                </button>
                <button type="button" onClick={() => setAddItemType('veg')} className={`py-1 rounded text-xs ${addItemType==='veg' ? 'bg-green-100 border-2 border-green-400' : 'bg-white border border-gray-300'} text-gray-900 flex flex-col items-center`}>
                  <span className="text-sm">🟩</span>
                  <span className="text-[8px]">Veg</span>
                </button>
                <button type="button" onClick={() => setAddItemType('non-veg')} className={`py-1 rounded text-xs ${addItemType==='non-veg' ? 'bg-red-100 border-2 border-red-400' : 'bg-white border border-gray-300'} text-gray-900 flex flex-col items-center`}>
                  <span className="text-sm">🟥</span>
                  <span className="text-[8px]">Non-Veg</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 h-10 mt-2">
              <Label htmlFor="now-available" className="block text-xs font-medium">Now Available</Label>
              <Checkbox id="now-available" checked={addIsAvailable} onCheckedChange={setAddIsAvailable} />
            </div>
          </div>
          {/* Collapse/Expand Button */}
          <button
            type="button"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 rounded mt-1 mb-2 flex items-center justify-center gap-1 text-xs h-10"
            onClick={() => setShowAdvanced(v => !v)}
          >
            Advance Options
            <span className="text-lg">{showAdvanced ? <IoMdArrowDropup /> : <MdArrowDropDown />}</span>
          </button>
          {/* Collapsible Section */}
          {showAdvanced && (
            <div className="space-y-2 border-t border-gray-200 pt-2">
              {/* Spicy Level */}
              <div>
                <Label htmlFor="spicy-level" className="block text-xs font-medium">Spicy Level</Label>
                <Select value={addSpicyLevel} onValueChange={setAddSpicyLevel}>
                  <SelectTrigger className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5">
                    <SelectValue placeholder="Select spicy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hot">Hot</SelectItem>
                    <SelectItem value="Extra Hot">Extra Hot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Ingredients */}
              <div>
                <Label htmlFor="ingredients" className="block text-xs font-medium">Ingredients</Label>
                <Input id="ingredients" type="text" value={addIngredients} onChange={e => setAddIngredients(e.target.value)} placeholder="comma separated" className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" />
              </div>
           
              {/* Addons */}
              <div>
                <div className="mb-1">
                  <h3 className="text-base font-semibold text-gray-800 inline-block border-b-2 border-green-500 pb-0.5">Addons</h3>
                  {isEditMode && originalAddonCount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                      Existing addons (from database) | 
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full ml-2 mr-1"></span>
                      New addons (not saved yet)
                    </p>
                  )}
                </div>
                {addonsList.length > 0 && (
                  <div className="space-y-2">
                    {addonsList.map((addon, idx) => {
                      const isLocalAddon = addon.isLocal;
                      return (
                        <div key={addon.id} className={`flex items-center ${isLocalAddon ? 'border-l-2 border-blue-400 pl-2' : ''}`}>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                          <div>
                            <Label htmlFor={`addon-name-${addon.id}`} className="block text-xs font-medium text-gray-700 mb-0.5">Name*</Label>
                            <Input id={`addon-name-${addon.id}`} type="text" placeholder="e.g., Extra Cheese" value={addon.name} onChange={e => {
                                setAddonsList(prev => prev.map(a => 
                                  a.id === addon.id ? { ...a, name: e.target.value } : a
                                ));
                              }} className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" required />
                          </div>
                          <div>
                            <Label htmlFor={`addon-price-${addon.id}`} className="block text-xs font-medium text-gray-700 mb-0.5">Price*</Label>
                            <Input id={`addon-price-${addon.id}`} type="number" placeholder="0.00" step="0.01" min="0" value={addon.price} onChange={e => {
                                setAddonsList(prev => prev.map(a => 
                                  a.id === addon.id ? { ...a, price: e.target.value } : a
                                ));
                              }} className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" required />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700 flex items-center justify-center p-0.5"
                          onClick={() => handleDeleteAddon(addon.id)}
                          title={isLocalAddon ? "Remove addon from form" : "Delete addon from database"}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                    })}
                  </div>
                )}
                <div className="text-gray-400 text-xs mt-1 mb-2">Like: Cheese, Olives, Butter etc..</div>
                <button
                  type="button"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 text-sm rounded-md mt-1 shadow-sm transition-all duration-200"
                  onClick={() => {
                    const newId = `local-addon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const newAddon = { 
                      id: newId, 
                      name: '', 
                      price: '', 
                      isLocal: true 
                    };
                    setAddonsList([...addonsList, newAddon]);
                    console.log('Added new local addon:', newAddon);
                  }}
                >
                  Add Addons
                </button>
              </div>
                 {/* Description */}
                 <div>
                <Label htmlFor="description" className="block text-xs font-medium">Description</Label>
                <Input id="description" type="text" value={addDesc} onChange={e => setAddDesc(e.target.value)} className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" />
              </div>
            </div>
          )}
          {addError && <p className="text-red-500 text-xs">{addError}</p>}
          <Button
            type="submit"
            disabled={addLoading}
            style={{ backgroundColor: isEditMode ? '#f87019' : '#16a34a', border: 'none' }}
            className={
              `w-full mt-2 ${isEditMode ? 'hover:bg-blue-700' : 'hover:bg-green-700'} text-white font-semibold py-2 text-base rounded shadow`
            }
          >
            {addLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Menu Item' : 'Add Menu Item')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
