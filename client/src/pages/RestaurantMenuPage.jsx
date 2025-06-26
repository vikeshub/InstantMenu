import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import RestaurantNavbar from '../components/layout/RestaurantNavbar';
import { Pencil, Trash2 } from 'lucide-react';
import { API_LIST, API_DOMAIN } from '../api/apiList';

const RestaurantMenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const titleRef = useRef();
  const descRef = useRef();

  // Get restaurant ID from Redux if available, else from localStorage
  const restaurantProfile = useSelector(state => state.restaurant?.profile || state.restaurant?.restaurant);
  const restaurantUser = JSON.parse(localStorage.getItem('restaurantUser') || 'null');
  const restaurantId = restaurantProfile?._id || restaurantUser?._id || null;

  const API_MENUS_BY_RESTAURANT = restaurantId ? `${API_DOMAIN}/api/menus/restaurant/${restaurantId}` : null;
  const API_ADD_MENU = `${API_DOMAIN}/api/menus`;
  const API_EDIT_MENU = (id) => `${API_DOMAIN}/api/menus/${id}`;
  const API_DELETE_MENU = (id) => `${API_DOMAIN}/api/menus/${id}`;
  const API_TOGGLE_MENU = (id) => `${API_DOMAIN}/api/menus/${id}/toggle-active`;

  useEffect(() => {
    const fetchMenus = async () => {
      if (!restaurantId) {
        setError('Restaurant ID not found. Please log in again.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('restaurantAccessToken');
        const res = await fetch(API_MENUS_BY_RESTAURANT, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch menus');
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        setError(err.message || 'Error fetching menus');
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const handleAddMenu = async (e) => {
    e.preventDefault();
    if (!restaurantId) {
      setAddError('Restaurant ID not found. Please log in again.');
      return;
    }
    setAddLoading(true);
    setAddError(null);
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_ADD_MENU, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          restaurant_id: restaurantId,
          title: titleRef.current.value,
          description: descRef.current.value,
        }),
      });
      if (!res.ok) throw new Error('Failed to add menu');
      setShowModal(false);
      titleRef.current.value = '';
      descRef.current.value = '';
      // Refresh menu list
      const data = await res.json();
      setMenus((prev) => [...prev, data]);
    } catch (err) {
      setAddError(err.message || 'Error adding menu');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (menu) => {
    setEditId(menu._id);
    setEditTitle(menu.title);
    setEditDesc(menu.description);
    setEditError(null);
  };

  const handleEditSave = async (menuId) => {
    setEditLoading(true);
    setEditError(null);
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_EDIT_MENU(menuId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editTitle,
          description: editDesc,
        }),
      });
      if (!res.ok) throw new Error('Failed to update menu');
      const updated = await res.json();
      setMenus((prev) => prev.map((m) => m._id === menuId ? { ...m, ...updated } : m));
      setEditId(null);
    } catch (err) {
      setEditError(err.message || 'Error updating menu');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
    setEditError(null);
  };

  const handleDelete = (menuId) => {
    setDeleteId(menuId);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_DELETE_MENU(deleteId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete menu');
      setMenus((prev) => prev.filter((m) => m._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setDeleteError(err.message || 'Error deleting menu');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setDeleteError(null);
  };

  const handleToggle = async (menu) => {
    try {
      const token = localStorage.getItem('restaurantAccessToken');
      const res = await fetch(API_TOGGLE_MENU(menu._id), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to toggle active status');
      const updated = await res.json();
      setMenus((prev) => prev.map((m) => m._id === menu._id ? { ...m, ...updated } : m));
    } catch (err) {
      alert(err.message || 'Error toggling active status');
    }
  };

  // Custom Switch Toggle
  const SwitchToggle = ({ checked, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
      title={checked ? 'Set Inactive' : 'Set Active'}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );

  return (
    <>
      <RestaurantNavbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Menu</h1>
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded shadow"
            onClick={() => setShowModal(true)}
          >
            + Add Menu
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {(!restaurantId) ? (
            <p className="text-red-500">Restaurant ID not found. Please log in again.</p>
          ) : loading ? (
            <p className="text-gray-500">Loading menus...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : menus.length === 0 ? (
            <p className="text-gray-700">No menus found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {menus.map((menu) => (
                    <tr key={menu._id}>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {editId === menu._id ? (
                          <input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            disabled={editLoading}
                          />
                        ) : (
                          menu.title
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {editId === menu._id ? (
                          <input
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                            disabled={editLoading}
                          />
                        ) : (
                          menu.description
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <SwitchToggle checked={menu.is_active} onClick={() => handleToggle(menu)} />
                      </td>
                      <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                        {editId === menu._id ? (
                          <>
                            <button
                              className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() => handleEditSave(menu._id)}
                              disabled={editLoading}
                            >
                              Save
                            </button>
                            <button
                              className="p-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                              onClick={handleEditCancel}
                              disabled={editLoading}
                            >
                              Cancel
                            </button>
                            {editError && <span className="text-xs text-red-500 ml-2">{editError}</span>}
                          </>
                        ) : (
                          <>
                            <button title="Edit" className="p-2 rounded hover:bg-blue-50 text-blue-600" onClick={() => handleEditClick(menu)}>
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button title="Delete" className="p-2 rounded hover:bg-red-50 text-red-600" onClick={() => handleDelete(menu._id)}>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">Add New Menu</h2>
              <form onSubmit={handleAddMenu} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    ref={titleRef}
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    ref={descRef}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                {addError && <p className="text-red-500 text-sm">{addError}</p>}
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded"
                  disabled={addLoading}
                >
                  {addLoading ? 'Adding...' : 'Add Menu'}
                </button>
              </form>
            </div>
          </div>
        )}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
              <h2 className="text-lg font-bold mb-4">Delete Menu</h2>
              <p className="mb-4">Are you sure you want to delete this menu?</p>
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
      </div>
    </>
  );
};

export default RestaurantMenuPage;
