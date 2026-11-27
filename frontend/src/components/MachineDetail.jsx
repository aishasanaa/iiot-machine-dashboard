import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSelection,
  acknowledgeFault,
  selectSelectedMachine,
} from '../store/machinesSlice';
import StatusBadge from './StatusBadge';
import './MachineDetail.css';

export default function MachineDetail() {
  const dispatch  = useDispatch();
  const machine   = useSelector(selectSelectedMachine);

  if (!machine) return null;

  const { id, name, status, temperature, vibration, lastUpdated } = machine;
  const formattedDate = new Date(lastUpdated).toLocaleString();

  const handleAcknowledge = () => {
    dispatch(acknowledgeFault(id));
    dispatch(clearSelection());
  };

  return (
    // Backdrop — click outside to close
    <div className="modal-backdrop" onClick={() => dispatch(clearSelection())}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal__header">
          <div>
            <span className="modal__id">{id}</span>
            <h2 className="modal__name">{name}</h2>
          </div>
          <button
            className="modal__close"
            onClick={() => dispatch(clearSelection())}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Status */}
        <div className="modal__row">
          <span className="modal__label">Status</span>
          <StatusBadge status={status} />
        </div>

        {/* Metrics */}
        <div className="modal__row">
          <span className="modal__label">Temperature</span>
          <span className="modal__value">{temperature}°C</span>
        </div>
        <div className="modal__row">
          <span className="modal__label">Vibration</span>
          <span className="modal__value">{vibration} mm/s</span>
        </div>
        <div className="modal__row">
          <span className="modal__label">Last Updated</span>
          <span className="modal__value">{formattedDate}</span>
        </div>

        {/* Acknowledge Fault button — only shown when status is 'fault' */}
        {status === 'fault' && (
          <button className="btn-acknowledge" onClick={handleAcknowledge}>
            ✅ Acknowledge Fault
          </button>
        )}
      </div>
    </div>
  );
}
