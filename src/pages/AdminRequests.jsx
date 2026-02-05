import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RequestsTable from '@/components/admin/RequestsTable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRequests() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('skyserver_admin_auth') === 'true';
    if (!isLoggedIn) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['serverRequests'],
    queryFn: () => base44.entities.ServerRequest.list('-created_date'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.ServerRequest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serverRequests'] });
      toast.success('Request updated successfully');
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('skyserver_admin_auth');
    navigate(createPageUrl('AdminLogin'));
  };

  const handleApprove = (id) => {
    updateMutation.mutate({ id, status: 'active' });
  };

  const handleReject = (id) => {
    updateMutation.mutate({ id, status: 'rejected' });
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.server_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.discord?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar currentPage="AdminRequests" onLogout={handleLogout} />
      
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">All Requests</h1>
          <p className="text-slate-400 mt-1">Manage all server hosting requests</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search by name, email, or server..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 focus:border-sky-500 text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-800 text-white">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white hover:bg-slate-700">All Status</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-slate-700">Pending</SelectItem>
                <SelectItem value="active" className="text-white hover:bg-slate-700">Active</SelectItem>
                <SelectItem value="rejected" className="text-white hover:bg-slate-700">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading requests...</div>
          ) : (
            <RequestsTable 
              requests={filteredRequests} 
              onApprove={handleApprove} 
              onReject={handleReject} 
            />
          )}
        </div>

        {/* Results count */}
        <p className="text-slate-500 text-sm mt-4">
          Showing {filteredRequests.length} of {requests.length} requests
        </p>
      </main>
    </div>
  );
}