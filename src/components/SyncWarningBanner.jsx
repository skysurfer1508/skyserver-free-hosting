import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SyncWarningBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 border-b-2 border-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white flex-shrink-0 animate-pulse" />
            <div>
              <p className="text-white font-bold text-lg mb-1">
                ⚠️ CRITICAL: Data Synchronization Issue
              </p>
              <p className="text-red-100 text-sm">
                The website is experiencing problems with synchronization and data storage. To request a server, please open a ticket on our Discord server for manual processing.
              </p>
            </div>
          </div>
          <a
            href="https://discord.gg/pNMVZJrTcv"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-white hover:bg-red-50 text-red-600 font-bold shadow-lg"
            >
              Open Discord Ticket
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}