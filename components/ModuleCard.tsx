import React from 'react';

type ModuleCardProps = {
  title: string;
  subtitle: string;
  status: 'Available' | 'Busy' | 'Closed' | 'Upcoming' | string;
  extraInfo?: string;
};

export const ModuleCard = ({ title, subtitle, status, extraInfo }: ModuleCardProps) => {
  // Helper to determine status badge colors
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'busy':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'closed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'upcoming':
        return 'bg-[#c9a86a]/10 text-[#c9a86a] border-[#c9a86a]/20';
      default:
        return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  return (
    <div className="card p-6 rounded-[18px] bg-[#1a1a1a]/40 backdrop-blur-md border border-white/5 hover:border-[#c9a86a]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>

      {/* Status Badge */}
      <div className="flex items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}>
          {status}
        </span>
      </div>

      {/* Optional Footer */}
      {extraInfo && (
        <div className="mt-auto pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500">{extraInfo}</p>
        </div>
      )}
    </div>
  );
};