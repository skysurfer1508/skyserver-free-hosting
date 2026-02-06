import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Search, Users as UsersIcon, Shield, User } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('skyserver_admin_auth') === 'true';
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
      return;
    }

    loadUsers();
  }, [navigate]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem('skyserver_admin_auth');
    navigate(createPageUrl('AdminLogin'));
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleSaveEdit = () => {
    if (!editForm.name || !editForm.email) {
      toast.error('Name and email are required');
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === editingUser.id);
    
    if (userIndex !== -1) {
      allUsers[userIndex].name = editForm.name;
      allUsers[userIndex].email = editForm.email;
      localStorage.setItem('users', JSON.stringify(allUsers));
      
      loadUsers();
      setEditingUser(null);
      toast.success('User updated successfully');
    }
  };

  const handleDeleteUser = (user) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete "${user.name}"? This will also delete all their server requests and cannot be undone.`)) {
      return;
    }

    // Delete user
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = allUsers.filter(u => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    // Delete all associated requests
    const allRequests = JSON.parse(localStorage.getItem('serverRequests') || '[]');
    const filteredRequests = allRequests.filter(r => r.email !== user.email);
    localStorage.setItem('serverRequests', JSON.stringify(filteredRequests));

    loadUsers();
    toast.success(`User "${user.name}" and their requests deleted`);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Never';
    try {
      return format(new Date(lastLogin), 'MMM d, yyyy h:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar currentPage="AdminUsers" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Manage registered users and their access</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
          <Badge variant="outline" className="text-slate-400">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">User</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Email</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Role</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Last Login</th>
                  <th className="text-left p-4 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-right p-4 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-slate-500 text-xs">ID: {user.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-300 text-sm">{user.email}</p>
                      </td>
                      <td className="p-4">
                        <Badge className={user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-700 text-slate-300'}>
                          {user.role === 'admin' ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            'User'
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-300 text-sm">{formatLastLogin(user.lastLogin)}</p>
                      </td>
                      <td className="p-4">
                        <Badge className={user.lastLogin ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700 text-slate-400'}>
                          {user.lastLogin ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditClick(user)}
                            className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Modal */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Edit User</DialogTitle>
              <DialogDescription className="text-slate-400">
                Update user information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  placeholder="email@example.com"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setEditingUser(null)}
                  variant="outline"
                  className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}