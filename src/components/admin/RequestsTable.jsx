import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Pickaxe, Factory, Worm, Clock, CheckCircle, XCircle, Zap, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const gameIcons = {
  minecraft: { icon: Pickaxe, color: 'text-emerald-400' },
  satisfactory: { icon: Factory, color: 'text-orange-400' },
  terraria: { icon: Worm, color: 'text-purple-400' },
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  active: { label: 'Active', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: Zap },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
};

export default function RequestsTable({ requests, onApprove, onReject, onDelete, showActions = true, showDeleteButton = false, onRowClick }) {
  const safeRequests = Array.isArray(requests) ? requests : [];
  
  if (safeRequests.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No requests found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Date</th>
            <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">User</th>
            <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Discord</th>
            <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Game</th>
            <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Server Name</th>
            <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Status</th>
            {showActions && <th className="text-right py-4 px-4 text-slate-400 font-medium text-sm">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {safeRequests.map((request) => {
            const game = gameIcons[request.game] || gameIcons.minecraft;
            const GameIcon = game.icon;
            const status = statusConfig[request.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const isRejected = request.status === 'rejected';

            return (
              <tr 
                key={request.id} 
                onClick={() => onRowClick?.(request)}
                className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${isRejected ? 'opacity-50' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                <td className="py-4 px-4 text-slate-300 text-sm">
                  {format(new Date(request.created_date), 'MMM d, yyyy')}
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-white font-medium">{request.name}</p>
                    <p className="text-slate-500 text-xs">{request.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-slate-400 text-sm">
                  {request.discord || '—'}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <GameIcon className={`w-4 h-4 ${game.color}`} />
                    <span className="text-slate-300 capitalize">{request.game}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-white font-medium">
                  {request.server_name}
                </td>
                <td className="py-4 px-4">
                  <Badge variant="outline" className={`${status.color} border flex items-center gap-1.5 w-fit`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </Badge>
                </td>
                {showActions && (
                  <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove(request.id);
                            }}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReject(request.id);
                            }}
                            className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === 'active' && showDeleteButton && onDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(request.id);
                          }}
                          className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Terminate
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}