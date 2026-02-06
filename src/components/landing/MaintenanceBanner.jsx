import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MaintenanceBanner() {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 shadow-lg"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm md:text-base font-medium text-center">
          ⚠️ <strong>Maintenance in progress:</strong> We are currently upgrading our infrastructure. Server requests may be delayed.
        </p>
      </div>
    </motion.div>
  );
}