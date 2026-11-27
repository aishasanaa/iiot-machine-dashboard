import React from 'react';
import './StatusBadge.css';

const STATUS_CONFIG = {
  running: { label: 'Running', className: 'badge--running' },
  idle:    { label: 'Idle',    className: 'badge--idle'    },
  fault:   { label: 'Fault',   className: 'badge--fault'   },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: '' };
  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}
