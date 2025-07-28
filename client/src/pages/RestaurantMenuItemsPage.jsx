import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RestaurantNavbar from '../components/layout/RestaurantNavbar';
import { API_LIST } from '../api/apiList';
import { Pencil, Trash2 } from 'lucide-react';
import AddMenuItemModal from '../components/AddMenuItemModal';
import { useToast } from '../hooks/use-toast';

const MenuItemsPage = () => {
  const { menuId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menu, setMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [addName, setAddName] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addDiscountedPrice, setAddDiscountedPrice] = useState("");
  const [addStatus, setAddStatus] = useState("NoStatus");
  const [addItemType, setAddItemType] = useState("not-defined");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addIsAvailable, setAddIsAvailable] = useState(true);
  const [addSpicyLevel, setAddSpicyLevel] = useState("Mild");
  const [addIngredients, setAddIngredients] = useState("");
  const [addAddonName, setAddAddonName] = useState([]);
  const [addAddonPrice, setAddAddonPrice] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const { toast } = useToast();
  const [menuIdError, setMenuIdError] = useState(null);

  useEffect(() => {
    if (!menuId) {
      setMenuIdError('Menu ID is missing or invalid.');
      setLoading(false);
      return;
    } else {
      setMenuIdError(null);
    }
    const fetchMenuAndItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('restaurantAccessToken');
        // Fetch menu details
        const menuRes = await fetch(API_LIST.EDIT_MENU(menuId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!menuRes.ok) throw new Error('Failed to fetch menu details');
        const menuData = await menuRes.json();
        setMenu(menuData);
        // Fetch menu items
        const res = await fetch(`${API_LIST.MENUITEMS_BY_MENU(menuId)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch menu items');
        const data = await res.json();
        setItems(data);
      } catch (err) {
        setError(err.message || 'Error fetching menu or items');
      } finally {
        setLoading(false);
      }
    };
    fetchMenuAndItems();
  }, [menuId]);

  // Toggle handler
  const handleToggle = async (item) => {
    if (!menuId) {
      alert('Menu ID is missing. Cannot toggle item availability.');
      return;
    }
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_LIST.UPDATE_MENUITEM(menuId, item._id), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          is_available: !item.is_available
        }),
      });
      if (!res.ok) throw new Error('Failed to toggle item availability');
      const updated = await res.json();
      setItems((prev) => prev.map((i) => i._id === item._id ? { ...i, ...updated } : i));
      toast({
        title: `Menu item is now ${updated.is_available ? 'available' : 'unavailable'}.`,
        status: 'success',
      });
    } catch (err) {
      alert(err.message || 'Error toggling item availability');
      toast({
        title: err.message || 'Error toggling item availability',
        status: 'error',
      });
    }
  };

  // Add menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!menuId) {
      setAddError('Menu ID is missing. Cannot add menu item.');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_LIST.ADD_MENUITEM(menuId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: addName,
          price: Number(addPrice),
          description: addDesc,
        }),
      });
      if (!res.ok) throw new Error('Failed to add menu item');
      const data = await res.json();
      setItems((prev) => [...prev, data]);
      setShowModal(false);
      setAddName("");
      setAddDesc("");
      setAddPrice("");
    } catch (err) {
      setAddError(err.message || 'Error adding menu item');
    } finally {
      setAddLoading(false);
    }
  };

  // Add menu item with form data (including addons)
  const handleAddMenuItemWithData = async (formData) => {
    if (!menuId) {
      setAddError('Menu ID is missing. Cannot add menu item.');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_LIST.ADD_MENUITEM(menuId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to add menu item');
      const data = await res.json();
      setItems((prev) => [...prev, data]);
      setShowModal(false);
      // Reset form
      setAddName("");
      setAddDesc("");
      setAddPrice("");
      setAddDiscountedPrice("");
      setAddStatus("NoStatus");
      setAddItemType("not-defined");
      setAddImageUrl("");
      setAddIsAvailable(true);
      setAddSpicyLevel("Mild");
      setAddIngredients("");
      setAddAddonName([]);
      setAddAddonPrice([]);
    } catch (err) {
      setAddError(err.message || 'Error adding menu item');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (item) => {
    setEditId(item._id);
    setEditName(item.name);
    setEditDesc(item.description);
    setEditPrice(item.price && item.price.$numberDecimal ? item.price.$numberDecimal : item.price);
    setEditError(null);
  };
  const handleEditSave = async (itemId) => {
    if (!menuId) {
      setEditError('Menu ID is missing. Cannot update menu item.');
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_LIST.UPDATE_MENUITEM(menuId, itemId), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          price: editPrice,
        }),
      });
      if (!res.ok) throw new Error('Failed to update menu item');
      const updated = await res.json();
      setItems((prev) => prev.map((i) => i._id === itemId ? { ...i, ...updated } : i));
      setEditId(null);
    } catch (err) {
      setEditError(err.message || 'Error updating menu item');
    } finally {
      setEditLoading(false);
    }
  };
  const handleEditCancel = () => {
    setEditId(null);
    setEditName("");
    setEditDesc("");
    setEditPrice("");
    setEditError(null);
  };

  // Delete handlers
  const handleDelete = (itemId) => {
    setDeleteId(itemId);
    setDeleteError(null);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;
    if (!menuId) {
      setDeleteError('Menu ID is missing. Cannot delete menu item.');
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_LIST.DELETE_MENUITEM(menuId, deleteId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete menu item');
      setItems((prev) => prev.filter((i) => i._id !== deleteId));
      setDeleteId(null);
      toast({ title: 'Menu item deleted', status: 'success' });
    } catch (err) {
      setDeleteError(err.message || 'Error deleting menu item');
      toast({ title: err.message || 'Error deleting menu item', status: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };
  const cancelDelete = () => {
    setDeleteId(null);
    setDeleteError(null);
  };

  // Custom Switch Toggle
  const SwitchToggle = ({ checked, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
      title={checked ? 'Set Unavailable' : 'Set Available'}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );

  const handleMenuItemClick = async (itemId) => {
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_LIST.GET_MENUITEM(itemId), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch menu item');
      const data = await res.json();
      setEditModalData(data);
      setEditModalOpen(true);
    } catch (err) {
      toast({ title: err.message || 'Error loading menu item', status: 'error' });
    }
  };

  const handleEditModalSave = async (updatedData) => {
    if (!editModalData) return;
    if (!menuId) {
      toast({ title: 'Menu ID is missing. Cannot update menu item.', status: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_LIST.UPDATE_MENUITEM(menuId, editModalData._id), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to update menu item');
      const updated = await res.json();
      setItems((prev) => prev.map((i) => i._id === updated._id ? updated : i));
      setEditModalOpen(false);
      setEditModalData(null);
      toast({ title: 'Menu item updated', status: 'success' });
    } catch (err) {
      toast({ title: err.message || 'Error updating menu item', status: 'error' });
    }
  };

  const handleAddonDeleted = (updatedItem) => {
    // Update the editModalData with the updated item data
    setEditModalData(updatedItem);
    // Also update the items list
    setItems((prev) => prev.map((i) => i._id === updatedItem._id ? updatedItem : i));
  };

  return (
    <>
      <RestaurantNavbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-2">{menu ? menu.title : 'Menu Items'}</h1>
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded shadow"
            onClick={() => setShowModal(true)}
            disabled={!menuId}
          >
            + Add Menu Item
          </button>
        </div>
        {menuIdError && (
          <div className="mb-4 text-red-600 font-semibold">{menuIdError}</div>
        )}
        {menu && menu.description && (
          <p className="mb-4 text-gray-600">{menu.description}</p>
        )}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <p>Loading menu items...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : items.length === 0 ? (
            <p>No items found for this menu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item._id} onClick={() => handleMenuItemClick(item._id)} className="cursor-pointer hover:bg-orange-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {editId === item._id ? (
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            disabled={editLoading}
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {editId === item._id ? (
                          <input
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            disabled={editLoading}
                          />
                        ) : (
                          item.description
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-bold">
                        {editId === item._id ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            disabled={editLoading}
                          />
                        ) : (
                          `$${item.price && item.price.$numberDecimal ? Number(item.price.$numberDecimal).toFixed(2) : item.price}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <SwitchToggle checked={item.is_available} onClick={(e) => { e.stopPropagation(); handleToggle(item); }} />
                      </td>
                      <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                        {editId === item._id ? (
                          <>
                            <button
                              className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                              onClick={(e) => { e.stopPropagation(); handleEditSave(item._id); }}
                              disabled={editLoading}
                            >
                              Save
                            </button>
                            <button
                              className="p-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                              onClick={(e) => { e.stopPropagation(); handleEditCancel(); }}
                              disabled={editLoading}
                            >
                              Cancel
                            </button>
                            {editError && <span className="text-xs text-red-500 ml-2">{editError}</span>}
                          </>
                        ) : (
                          <>
                            <button title="Edit" className="p-2 rounded hover:bg-blue-50 text-blue-600" onClick={(e) => { e.stopPropagation(); handleEditClick(item); }}>
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button title="Delete" className="p-2 rounded hover:bg-red-50 text-red-600" onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}>
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {showModal && (
          <AddMenuItemModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={handleAddMenuItemWithData}
            addName={addName}
            setAddName={setAddName}
            addDesc={addDesc}
            setAddDesc={setAddDesc}
            addPrice={addPrice}
            setAddPrice={setAddPrice}
            addDiscountedPrice={addDiscountedPrice}
            setAddDiscountedPrice={setAddDiscountedPrice}
            addStatus={addStatus}
            setAddStatus={setAddStatus}
            addItemType={addItemType}
            setAddItemType={setAddItemType}
            addImageUrl={addImageUrl}
            setAddImageUrl={setAddImageUrl}
            addIsAvailable={addIsAvailable}
            setAddIsAvailable={setAddIsAvailable}
            addSpicyLevel={addSpicyLevel}
            setAddSpicyLevel={setAddSpicyLevel}
            addIngredients={addIngredients}
            setAddIngredients={setAddIngredients}
            addonName={addAddonName}
            addonPrice={addAddonPrice}
            addLoading={addLoading}
            addError={addError}
            menuId={menuId}
          />
        )}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <h2 className="text-lg font-bold mb-4">Delete Menu Item</h2>
              <p className="mb-4">Are you sure you want to delete this menu item?</p>
              {deleteError && <p className="text-red-500 text-sm mb-2">{deleteError}</p>}
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={cancelDelete}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
        {editModalOpen && editModalData && (
          <AddMenuItemModal
            show={editModalOpen}
            onClose={() => { setEditModalOpen(false); setEditModalData(null); }}
            onSubmit={handleEditModalSave}
            addName={editModalData.name}
            setAddName={val => setEditModalData(d => ({ ...d, name: val }))}
            addDesc={editModalData.description}
            setAddDesc={val => setEditModalData(d => ({ ...d, description: val }))}
            addPrice={editModalData.price && editModalData.price.$numberDecimal ? editModalData.price.$numberDecimal : editModalData.price}
            setAddPrice={val => setEditModalData(d => ({ ...d, price: val }))}
            addDiscountedPrice={editModalData.discounted_price && editModalData.discounted_price.$numberDecimal ? editModalData.discounted_price.$numberDecimal : editModalData.discounted_price}
            setAddDiscountedPrice={val => setEditModalData(d => ({ ...d, discounted_price: val }))}
            addStatus={editModalData.status}
            setAddStatus={val => setEditModalData(d => ({ ...d, status: val }))}
            addItemType={editModalData.item_type}
            setAddItemType={val => setEditModalData(d => ({ ...d, item_type: val }))}
            addImageUrl={editModalData.image_url}
            setAddImageUrl={val => setEditModalData(d => ({ ...d, image_url: val }))}
            addIsAvailable={editModalData.is_available}
            setAddIsAvailable={val => setEditModalData(d => ({ ...d, is_available: val }))}
            addSpicyLevel={editModalData.spicy_level}
            setAddSpicyLevel={val => setEditModalData(d => ({ ...d, spicy_level: val }))}
            addIngredients={editModalData.ingredients ? editModalData.ingredients.join(', ') : ''}
            setAddIngredients={val => setEditModalData(d => ({ ...d, ingredients: val.split(',').map(s => s.trim()) }))}
            addonName={editModalData.addons ? editModalData.addons.map(addon => String(addon.name || '')) : []}
            addonPrice={editModalData.addons ? editModalData.addons.map(addon => {
              // Handle MongoDB Decimal128 format for prices
              if (addon.price && addon.price.$numberDecimal) {
                return String(addon.price.$numberDecimal);
              }
              return String(addon.price || '');
            }) : []}
            addLoading={false}
            addError={null}
            isEditMode={true}
            menuId={menuId}
            itemId={editModalData._id}
            onAddonDeleted={handleAddonDeleted}
          />
        )}
      </div>
    </>
  );
};

export default MenuItemsPage;
