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
      const requests = await base44.entities.ServerRequest.list();
      return requests.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, credentials }) => {
      return base44.entities.ServerRequest.update(id, { status, credentials });
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
    mutationFn: async (id) => {
      await base44.entities.ServerRequest.delete(id);
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

  const handleApprove = async (id) => {
    const request = requests.find(r => r.id === id);
    if (!request) return;

    // Check available slots from backend
    try {
      const configs = await base44.entities.SystemConfig.list();
      if (configs && configs.length > 0) {
        const config = configs[0];
        const availableSlots = config.totalSlots - config.claimedSlots;
        
        if (availableSlots <= 0) {
          toast.error('No slots available!');
          return;
        }
      }

      // Open provisioning modal
      setProvisioningRequest(request);
    } catch (error) {
      console.error('Failed to check slots:', error);
      toast.error('Failed to check available slots');
    }
  };

  const handleProvisioningConfirm = async (credentials) => {
    const request = provisioningRequest;
    
    try {
      // Update request status and credentials
      await base44.entities.ServerRequest.update(request.id, {
        status: 'active',
        credentials
      });

      // No need to increment claimedSlots - it was already incremented when request was created

      queryClient.invalidateQueries({ queryKey: ['serverRequests'] });
      setProvisioningRequest(null);
      toast.success('Server activated successfully!');
    } catch (error) {
      console.error('Failed to activate server:', error);
      toast.error('Failed to activate server');
    }
  };

  const handleReject = (id) => {
    updateMutation.mutate({ id, status: 'rejected' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this server? This action cannot be undone.')) {
      return;
    }

    const request = requests.find(r => r.id === id);
    if (!request) return;

    try {
      // Decrement claimed slots
      const configs = await base44.entities.SystemConfig.list();
      if (configs && configs.length > 0) {
        const config = configs[0];
        await base44.entities.SystemConfig.update(config.id, {
          claimedSlots: Math.max(0, config.claimedSlots - 1)
        });
      }

      // Delete request
      deleteMutation.mutate(id);
    } catch (error) {
      console.error('Failed to delete server:', error);
      toast.error('Failed to delete server');
    }
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