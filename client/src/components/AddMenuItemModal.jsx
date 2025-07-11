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
  isEditMode = false
}) => {
  const fileInputRef = React.useRef(null);
  const [addonsList, setAddonsList] = React.useState([]);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

    // Sync addons with parent data
  React.useEffect(() => {
    if (Array.isArray(addonName) && Array.isArray(addonPrice) && addonName.length > 0) {
      const newAddonsList = addonName.map((name, idx) => {
        const price = addonPrice[idx];
        return { 
          name: String(name || ''), 
          price: String(price || '') 
        };
      });
      setAddonsList(newAddonsList);
    } else if (!isEditMode) {
      // Reset addons for new items
      setAddonsList([]);
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
              <Label className="block text-xs font-medium mb-1">Status</Label>
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
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 rounded mt-1 mb-2 flex items-center justify-center gap-1 text-xs"
            onClick={() => setShowAdvanced(v => !v)}
          >
            Advance Options
            <span>{showAdvanced ? '▲' : '▼'}</span>
          </button>
          {/* Collapsible Section */}
          {showAdvanced && (
            <div className="space-y-2 border-t border-gray-200 pt-2">
              {/* Spicy Level */}
              <div>
                <Label htmlFor="spicy-level" className="block text-xs font-medium">Spicy Level</Label>
                <select
                  value={addSpicyLevel}
                  onChange={e => setAddSpicyLevel(e.target.value)}
                  className="mt-0.5 block w-full border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Hot">Hot</option>
                  <option value="Extra Hot">Extra Hot</option>
                </select>
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
                </div>
                {addonsList.length > 0 && (
                  <div className="space-y-2">
                    {addonsList.map((addon, idx) => (
                      <div key={idx} className="flex items-center border border-gray-300 rounded-md p-2 bg-white shadow-sm">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                          <div>
                            <Label htmlFor={`addon-name-${idx}`} className="block text-xs font-medium text-gray-700 mb-0.5">Name*</Label>
                            <Input id={`addon-name-${idx}`} type="text" placeholder="e.g., Extra Cheese" value={addon.name} onChange={e => {
                                const newList = [...addonsList];
                                newList[idx].name = e.target.value;
                                setAddonsList(newList);
                              }} className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" />
                          </div>
                          <div>
                            <Label htmlFor={`addon-price-${idx}`} className="block text-xs font-medium text-gray-700 mb-0.5">Price*</Label>
                            <Input id={`addon-price-${idx}`} type="number" placeholder="0.00" step="0.01" min="0" value={addon.price} onChange={e => {
                                const newList = [...addonsList];
                                newList[idx].price = e.target.value;
                                setAddonsList(newList);
                              }} className="h-10 px-3 text-base w-full border border-gray-300 rounded mt-0.5" />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700 flex items-center justify-center p-0.5"
                          onClick={() => setAddonsList(addonsList.filter((_, i) => i !== idx))}
                          title="Remove addon"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-gray-400 text-xs mt-1 mb-2">Like: Cheese, Olives, Butter etc..</div>
                <button
                  type="button"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 text-sm rounded-md mt-1 shadow-sm transition-all duration-200"
                  onClick={() => setAddonsList([...addonsList, { name: '', price: '' }])}
                >
                  Add More Addons
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
          <Button type="submit" disabled={addLoading} className="w-full mt-2">
            {addLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Menu Item' : 'Add Menu Item')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
