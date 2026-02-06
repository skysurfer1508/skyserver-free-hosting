import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SyncWarningBanner() {
  return (
    <div className="bg-amber-500 border-b-2 border-amber-600">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-900 flex-shrink-0" />
            <p className="text-amber-900 font-medium">
              <span className="font-bold">Action Required:</span> Due to the current synchronization error, requests cannot be processed automatically. You <span className="font-bold">MUST open a ticket on our Discord</span> to get your server approved manually.
            </p>
          </div>
          <a
            href="https://discord.gg/pNMVZJrTcv"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="bg-amber-900 hover:bg-amber-950 text-white"
            >
              Open Discord Ticket
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}