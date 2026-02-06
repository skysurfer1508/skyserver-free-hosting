import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsCard from '@/components/admin/StatsCard';
import RequestsTable from '@/components/admin/RequestsTable';
import RequestDetailsModal from '@/components/admin/RequestDetailsModal';
import ProvisioningModal from '@/components/admin/ProvisioningModal';
import SyncWarningBanner from '@/components/SyncWarningBanner';
import { Inbox, Clock, Zap, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [provisioningRequest, setProvisioningRequest] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('skyserver_admin_auth') === 'true';
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['serverRequests'],
    queryFn: async () => {
      // Load from localStorage instead of backend
      const stored = localStorage.getItem('serverRequests');
      const requests = stored ? JSON.parse(stored) : [];
      return requests.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => {
      // Update in localStorage
      const allRequests = JSON.parse(localStorage.getItem('serverRequests') || '[]');
      const index = allRequests.findIndex(r => r.id === id);
      if (index !== -1) {
        allRequests[index].status = status;
        localStorage.setItem('serverRequests', JSON.stringify(allRequests));
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverRequests'] });
      toast.success('Request updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update request');
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      // Delete from localStorage
      const allRequests = JSON.parse(localStorage.getItem('serverRequests') || '[]');
      const filtered = allRequests.filter(r => r.id !== id);
      localStorage.setItem('serverRequests', JSON.stringify(filtered));
      return Promise.resolve();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['serverRequests'] });
      toast.success('Server terminated successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete server');
      console.error(error);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('skyserver_admin_auth');
    navigate(createPageUrl('AdminLogin'));
  };

  const handleApprove = (id) => {
    const request = requests.find(r => r.id === id);
    if (!request) return;

    // Check available slots
    const storedSlots = localStorage.getItem('availableSlots');
    const slots = storedSlots ? JSON.parse(storedSlots) : { minecraft: 5, terraria: 5, satisfactory: 3 };
    
    if (slots[request.game] <= 0) {
      toast.error(`No slots available for ${request.game}!`);
      return;
    }

    // Open provisioning modal instead of approving immediately
    setProvisioningRequest(request);
  };

  const handleProvisioningConfirm = async (credentials) => {
    const request = provisioningRequest;
    
    // CRITICAL: Update user's data in users array FIRST
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === request.email);
    
    if (userIndex === -1) {
      toast.error('User not found!');
      return;
    }

    // Find and update the user's request
    if (!users[userIndex].requests) {
      users[userIndex].requests = [];
    }
    
    const reqIndex = users[userIndex].requests.findIndex(r => r.id === request.id);
    if (reqIndex !== -1) {
      users[userIndex].requests[reqIndex].status = 'active';
      users[userIndex].requests[reqIndex].credentials = credentials;
    } else {
      // If request doesn't exist in user's array, add it
      users[userIndex].requests.push({
        ...request,
        status: 'active',
        credentials
      });
    }
    
    // Save updated users array
    localStorage.setItem('users', JSON.stringify(users));

    // Update global requests list
    const allRequests = JSON.parse(localStorage.getItem('serverRequests') || '[]');
    const index = allRequests.findIndex(r => r.id === request.id);
    if (index !== -1) {
      allRequests[index].status = 'active';
      allRequests[index].credentials = credentials;
      localStorage.setItem('serverRequests', JSON.stringify(allRequests));
    }
    
    // Store credentials separately for easier access
    const storedRequests = JSON.parse(localStorage.getItem('serverRequestsWithCreds') || '{}');
    storedRequests[request.id] = credentials;
    localStorage.setItem('serverRequestsWithCreds', JSON.stringify(storedRequests));

    // Decrement slot count
    const storedSlots = localStorage.getItem('availableSlots');
    const slots = storedSlots ? JSON.parse(storedSlots) : { minecraft: 5, terraria: 5, satisfactory: 3 };
    slots[request.game] = Math.max(0, slots[request.game] - 1);
    localStorage.setItem('availableSlots', JSON.stringify(slots));
    window.dispatchEvent(new Event('slotsUpdated'));

    queryClient.invalidateQueries({ queryKey: ['serverRequests'] });
    setProvisioningRequest(null);
    toast.success('Server activated successfully!');
  };

  const handleReject = (id) => {
    updateMutation.mutate({ id, status: 'rejected' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to terminate this server? This action cannot be undone.')) {
      return;
    }

    const request = requests.find(r => r.id === id);
    if (!request) return;

    // Increment slot count back
    const storedSlots = localStorage.getItem('availableSlots');
    const slots = storedSlots ? JSON.parse(storedSlots) : { minecraft: 5, terraria: 5, satisfactory: 3 };
    
    slots[request.game] = (slots[request.game] || 0) + 1;
    localStorage.setItem('availableSlots', JSON.stringify(slots));
    window.dispatchEvent(new Event('slotsUpdated'));

    // Delete request
    deleteMutation.mutate(id);
  };

  // Calculate stats - safely handle empty arrays
  const safeRequests = Array.isArray(requests) ? requests : [];
  const totalRequests = safeRequests.length;
  const pendingRequests = safeRequests.filter(r => r.status === 'pending').length;
  const activeServers = safeRequests.filter(r => r.status === 'active').length;
  const rejectedRequests = safeRequests.filter(r => r.status === 'rejected').length;

  // Get recent pending requests (max 5)
  const recentPending = safeRequests.filter(r => r.status === 'pending').slice(0, 5);
  const recentActive = safeRequests.filter(r => r.status === 'active').slice(0, 5);

  return (
    <>
      <SyncWarningBanner />
      <div className="min-h-screen bg-slate-950 flex">
        <AdminSidebar currentPage="Admin" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of your server hosting requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Requests" value={totalRequests} icon={Inbox} color="sky" />
          <StatsCard title="Pending Approval" value={pendingRequests} icon={Clock} color="yellow" />
          <StatsCard title="Active Servers" value={activeServers} icon={Zap} color="emerald" />
          <StatsCard title="Rejected" value={rejectedRequests} icon={XCircle} color="red" />
        </div>

        {/* Recent Pending Requests */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Recent Pending Requests</h2>
              <p className="text-slate-400 text-sm mt-1">Requests awaiting your approval</p>
            </div>
            <Link 
              to={createPageUrl('AdminRequests')}
              className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading requests...</div>
          ) : recentPending.length > 0 ? (
            <RequestsTable 
              requests={recentPending} 
              onApprove={handleApprove} 
              onReject={handleReject}
              onRowClick={setSelectedRequest}
            />
          ) : (
            <div className="p-12 text-center text-slate-500">
              No pending requests. All caught up! 🎉
            </div>
          )}
        </div>

        {/* Active Servers */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold text-white">Active Servers</h2>
            <p className="text-slate-400 text-sm mt-1">Currently running servers</p>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading servers...</div>
          ) : recentActive.length > 0 ? (
            <RequestsTable 
              requests={recentActive} 
              onApprove={handleApprove} 
              onReject={handleReject}
              onDelete={handleDelete}
              onRowClick={setSelectedRequest}
              showDeleteButton={true}
            />
          ) : (
            <div className="p-12 text-center text-slate-500">
              No active servers yet.
            </div>
          )}
        </div>

        {/* Details Modal */}
        <RequestDetailsModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Provisioning Modal */}
        <ProvisioningModal
          isOpen={!!provisioningRequest}
          onClose={() => setProvisioningRequest(null)}
          request={provisioningRequest}
          onConfirm={handleProvisioningConfirm}
        />
      </main>
      </div>
    </>
  );
}