import React from 'react';

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
  isEditMode = false
}) => {
  const fileInputRef = React.useRef(null);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white text-gray-900 rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl relative mx-2">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-1 text-center">{isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
        <div className="flex flex-col items-center mb-2">
          {/* Image preview placeholder */}
          <div
            className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center mb-1 overflow-hidden cursor-pointer border border-dashed border-orange-400 hover:bg-orange-50 transition"
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
        <form onSubmit={onSubmit} className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium">Name*</label>
              <input
                type="text"
                value={addName}
                onChange={e => setAddName(e.target.value)}
                required
                className="mt-0.5 block w-full border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Status</label>
              <select
                value={addStatus}
                onChange={e => setAddStatus(e.target.value)}
                className="mt-0.5 block w-full border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="NoStatus">NoStatus</option>
                <option value="Special">Special</option>
                <option value="New">New</option>
                <option value="Offer">Offer</option>
                <option value="Seasonal">Seasonal</option>
                <option value="Bestseller">Bestseller</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium">Price*</label>
              <input
                type="number"
                value={addPrice}
                onChange={e => setAddPrice(e.target.value)}
                required
                className="mt-0.5 block w-full border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Discount Price</label>
              <input
                type="number"
                value={addDiscountedPrice}
                onChange={e => setAddDiscountedPrice(e.target.value)}
                className="mt-0.5 block w-full border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Item Type</label>
              <div className="flex gap-1 mt-0.5">
                <button type="button" onClick={() => setAddItemType('not-defined')} className={`flex-1 py-1 rounded text-xs ${addItemType==='not-defined' ? 'bg-gray-200 border-2 border-orange-500' : 'bg-white border border-gray-300'} text-gray-900 flex flex-col items-center`}>
                  <span className="text-lg">🚫</span>
                  <span className="text-[10px]">Not Defined</span>
                </button>
                <button type="button" onClick={() => setAddItemType('veg')} className={`flex-1 py-1 rounded text-xs ${addItemType==='veg' ? 'bg-green-100 border-2 border-green-400' : 'bg-white border border-gray-300'} text-gray-900 flex flex-col items-center`}>
                  <span className="text-lg">🟩</span>
                  <span className="text-[10px]">Veg</span>
                </button>
                <button type="button" onClick={() => setAddItemType('non-veg')} className={`flex-1 py-1 rounded text-xs ${addItemType==='non-veg' ? 'bg-red-100 border-2 border-red-400' : 'bg-white border border-gray-300'} text-gray-900 flex flex-col items-center`}>
                  <span className="text-lg">🟥</span>
                  <span className="text-[10px]">Non-Veg</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-5">
              <label className="block text-xs font-medium">Available</label>
              <input
                type="checkbox"
                checked={addIsAvailable}
                onChange={e => setAddIsAvailable(e.target.checked)}
                className="ml-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Spicy Level</label>
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
          </div>
          <div>
            <label className="block text-xs font-medium">Ingredients (comma separated)</label>
            <input
              type="text"
              value={addIngredients}
              onChange={e => setAddIngredients(e.target.value)}
              className="mt-0.5 block w-full border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Description</label>
            <textarea
              value={addDesc}
              onChange={e => setAddDesc(e.target.value)}
              required
              className="mt-0.5 block w-full border border-gray-300 bg-white text-gray-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {addError && <p className="text-red-500 text-xs">{addError}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 text-sm rounded mt-1"
            disabled={addLoading}
          >
            {addLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Menu Item' : 'Add Menu Item')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
