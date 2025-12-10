import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  User,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  X,
  Check,
  RefreshCw
} from 'lucide-react';
import { authApi, AdminUser } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

// Role badge colors
const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: 'rgba(100, 167, 11, 0.1)', text: '#64a70b' },
  staff: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6' },
};

interface UserFormData {
  email: string;
  name: string;
  role: 'admin' | 'staff';
  password?: string;
}

const AdminUsers: React.FC = () => {
  const { isAdmin, user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

  // Form states
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    role: 'staff',
    password: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleAddUser = async () => {
    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const result = await authApi.createUser(
        formData.email,
        formData.password || '',
        formData.name || undefined,
        formData.role
      );

      if (result.success) {
        setShowAddModal(false);
        setFormData({ email: '', name: '', role: 'staff', password: '' });
        loadUsers();
      } else {
        setFormError(result.error || 'Failed to create user');
      }
    } catch (err) {
      setFormError('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    setFormLoading(true);
    setFormError(null);

    try {
      const success = await authApi.updateUser(editingUser.id, {
        name: formData.name,
        role: formData.role,
      });

      if (success) {
        setEditingUser(null);
        setFormData({ email: '', name: '', role: 'staff', password: '' });
        loadUsers();
      } else {
        setFormError('Failed to update user');
      }
    } catch (err) {
      setFormError('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setFormLoading(true);
    setFormError(null);

    try {
      const success = await authApi.deleteUser(deletingUser.id);

      if (success) {
        setDeletingUser(null);
        loadUsers();
      } else {
        setFormError('Failed to delete user');
      }
    } catch (err) {
      setFormError('An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    try {
      await authApi.updateUser(user.id, { isActive: !user.isActive });
      loadUsers();
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name || '',
      role: user.role,
    });
    setFormError(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Only admins can access this page
  if (!isAdmin) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-red-700 font-semibold">Access Denied</p>
            <p className="text-red-600 text-sm">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#64a70b] animate-spin" />
          <p className="text-gray-600 neuzeit-font">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Hearns', sans-serif" }}>
            User Management
          </h1>
          <p className="text-gray-600 text-sm neuzeit-font mt-1">
            Manage admin users and their permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors neuzeit-font text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setFormData({ email: '', name: '', role: 'staff', password: '' });
              setFormError(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#64a70b] text-white hover:bg-[#578f09] transition-colors neuzeit-font text-sm"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b]"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 neuzeit-font text-sm">{error}</p>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  User
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Role
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Created
                </th>
                <th className="w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
                          {(user.name || user.email).substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 neuzeit-font">
                            {user.name || 'Unnamed'}
                            {user.id === currentAdmin?.id && (
                              <span className="ml-2 text-xs text-gray-500">(You)</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          backgroundColor: roleColors[user.role]?.bg,
                          color: roleColors[user.role]?.text,
                        }}
                      >
                        <Shield className="w-3.5 h-3.5" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActive(user)}
                        disabled={user.id === currentAdmin?.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.isActive
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        } ${user.id === currentAdmin?.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {user.isActive ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {user.id !== currentAdmin?.id && (
                          <button
                            onClick={() => setDeletingUser(user)}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 neuzeit-font">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b]"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b]"
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b]"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] bg-white"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors neuzeit-font text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={formLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#64a70b] text-white hover:bg-[#578f09] transition-colors neuzeit-font text-sm disabled:opacity-50"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 neuzeit-font">Edit User</h2>
              <button
                onClick={() => setEditingUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b]"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1.5">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                  disabled={editingUser.id === currentAdmin?.id}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm neuzeit-font focus:outline-none focus:ring-2 focus:ring-[#64a70b]/20 focus:border-[#64a70b] bg-white disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                {editingUser.id === currentAdmin?.id && (
                  <p className="text-xs text-gray-400 mt-1">You cannot change your own role</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors neuzeit-font text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                disabled={formLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#64a70b] text-white hover:bg-[#578f09] transition-colors neuzeit-font text-sm disabled:opacity-50"
              >
                {formLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 text-center neuzeit-font mb-2">
                Delete User
              </h2>
              <p className="text-gray-600 text-center text-sm mb-6">
                Are you sure you want to delete <strong>{deletingUser.name || deletingUser.email}</strong>?
                This action cannot be undone.
              </p>
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{formError}</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors neuzeit-font text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={formLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors neuzeit-font text-sm disabled:opacity-50"
                >
                  {formLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
