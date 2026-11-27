import React from 'react';
import { useDispatch } from 'react-redux';
import { selectMachine } from '../store/machinesSlice';
import StatusBadge from './StatusBadge';
import './MachineCard.css';

export default function MachineCard({ machine }) {
  const dispatch = useDispatch();
  const { id, name, status, temperature, vibration } = machine;

  return (
    <div
      className={`machine-card machine-card--${status}`}
      onClick={() => dispatch(selectMachine(id))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && dispatch(selectMachine(id))}
    >
      <div className="machine-card__header">
        <span className="machine-card__id">{id}</span>
        <StatusBadge status={status} />
      </div>

      <h3 className="machine-card__name">{name}</h3>

      <div className="machine-card__metrics">
        <div className="metric">
          <span className="metric__icon">🌡️</span>
          <span className="metric__value">{temperature}°C</span>
          <span className="metric__label">Temperature</span>
        </div>
        <div className="metric">
          <span className="metric__icon">📳</span>
          <span className="metric__value">{vibration} mm/s</span>
          <span className="metric__label">Vibration</span>
        </div>
      </div>

      <p className="machine-card__hint">Click for details →</p>
    </div>
  );
}
