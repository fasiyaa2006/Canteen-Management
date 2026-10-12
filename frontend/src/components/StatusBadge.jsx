import React from 'react';

const statusConfig = {
  PLACED: {
    label: 'Order Placed',
    bg: 'bg-blue-100 text-blue-800 border-blue-300',
    dot: 'bg-blue-500',
  },
  PREPARING: {
    label: 'Preparing in Kitchen',
    bg: 'bg-amber-100 text-amber-800 border-amber-300',
    dot: 'bg-amber-500 animate-pulse',
  },
  READY: {
    label: 'Ready for Pickup',
    bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  COLLECTED: {
    label: 'Collected',
    bg: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-rose-100 text-rose-800 border-rose-300',
    dot: 'bg-rose-500',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status,
    bg: 'bg-gray-100 text-gray-800 border-gray-300',
    dot: 'bg-gray-400',
  };

  return (
    <span className={`status-pill ${config.bg}`}>
      <span className={`status-dot ${config.dot}`} />
      {config.label}
    </span>
  );
}
