import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMachines,
  selectFilteredMachines,
  selectMachinesStatus,
  selectMachinesError,
} from '../store/machinesSlice';
import MachineCard from './MachineCard';
import FilterBar from './FilterBar';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch  = useDispatch();
  const machines  = useSelector(selectFilteredMachines);
  const status    = useSelector(selectMachinesStatus);
  const error     = useSelector(selectMachinesError);

  // Fetch machines when the component first mounts
  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__title-group">
          <span className="dashboard__icon">⚙️</span>
          <div>
            <h1 className="dashboard__title">IIoT Machine Dashboard</h1>
            <p className="dashboard__subtitle">Factory Floor — Live Machine Monitoring</p>
          </div>
        </div>
        <div className="dashboard__summary">
          <span>{machines.length} machine{machines.length !== 1 ? 's' : ''} shown</span>
        </div>
      </header>

      <FilterBar />

      {/* Loading state */}
      {status === 'loading' && (
        <div className="dashboard__state">
          <div className="spinner" />
          <p>Loading machines...</p>
        </div>
      )}

      {/* Error state */}
      {status === 'failed' && (
        <div className="dashboard__state dashboard__state--error">
          <p>⚠️ {error}</p>
          <button onClick={() => dispatch(fetchMachines())}>Retry</button>
        </div>
      )}

      {/* Empty state */}
      {status === 'succeeded' && machines.length === 0 && (
        <div className="dashboard__state">
          <p>No machines match your search.</p>
        </div>
      )}

      {/* Machine grid */}
      {status === 'succeeded' && machines.length > 0 && (
        <div className="dashboard__grid">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      )}
    </div>
  );
}
