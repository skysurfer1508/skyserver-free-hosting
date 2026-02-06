import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pickaxe, Factory, Worm, Mail, User, Calendar, MessageSquare, Server as ServerIcon, Hash, Check, X, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';
import { format } from 'date-fns';

const gameIcons = {
  minecraft: { icon: Pickaxe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  satisfactory: { icon: Factory, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  terraria: { icon: Worm, color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
  active: { label: 'Active', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: Zap },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
};

export default function RequestDetailsModal({ request, isOpen, onClose, onApprove, onReject, onDelete }) {
  if (!request) return null;

  const game = gameIcons[request.game] || gameIcons.minecraft;
  const GameIcon = game.icon;
  const status = statusConfig[request.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${game.bg} flex items-center justify-center`}>
              <GameIcon className={`w-6 h-6 ${game.color}`} />
            </div>
            Request Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badge */}
          <div>
            <Badge variant="outline" className={`${status.color} border flex items-center gap-2 w-fit text-base px-4 py-2`}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </Badge>
          </div>

          {/* Server Name */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <ServerIcon className="w-4 h-4" />
              Server Name
            </div>
            <p className="text-xl font-bold text-white">{request.server_name}</p>
          </div>

          {/* Grid of Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/30">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <User className="w-4 h-4" />
                Player Name
              </div>
              <p className="text-white font-medium">{request.name}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="text-white font-medium text-sm">{request.email}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Hash className="w-4 h-4" />
                Discord
              </div>
              <p className="text-white font-medium">{request.discord || 'Not provided'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/30">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Submitted
              </div>
              <p className="text-white font-medium">
                {format(new Date(request.created_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Game Selection */}
          <div className="p-4 rounded-xl bg-slate-800/30">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <GameIcon className={`w-4 h-4 ${game.color}`} />
              Selected Game
            </div>
            <p className="text-white font-semibold text-lg capitalize">{request.game}</p>
          </div>

          {/* Message */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
              <MessageSquare className="w-4 h-4" />
              Message / Special Requests
            </div>
            {request.message ? (
              <p className="text-white leading-relaxed">{request.message}</p>
            ) : (
              <p className="text-slate-500 italic">No message provided</p>
            )}
          </div>

          {/* Actions */}
          {request.status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button
                onClick={() => {
                  onApprove(request.id);
                  onClose();
                }}
                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve Request
              </Button>
              <Button
                onClick={() => {
                  onReject(request.id);
                  onClose();
                }}
                variant="ghost"
                className="flex-1 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <X className="w-4 h-4 mr-2" />
                Reject Request
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}