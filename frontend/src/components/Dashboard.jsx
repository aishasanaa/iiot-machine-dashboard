import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMachines,
  selectMachine,
  selectAllMachines,
  selectFilteredMachines,
  selectMachinesStatus,
  selectMachinesError,
} from '../store/machinesSlice';
import MachineCard from './MachineCard';
import StatusBadge from './StatusBadge';
import FilterBar from './FilterBar';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch    = useDispatch();
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const allMachines = useSelector(selectAllMachines);
  const machines    = useSelector(selectFilteredMachines);
  const status      = useSelector(selectMachinesStatus);
  const error       = useSelector(selectMachinesError);

  const totalCount   = allMachines.length;
  const runningCount = allMachines.filter((m) => m.status === 'running').length;
  const idleCount    = allMachines.filter((m) => m.status === 'idle').length;
  const faultCount   = allMachines.filter((m) => m.status === 'fault').length;

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
        <div className="dashboard__header-actions">
          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              Cards
            </button>
            <button
              className={`view-toggle__btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
          </div>
          <div className="dashboard__summary">
            <span>{machines.length} machine{machines.length !== 1 ? 's' : ''} shown</span>
          </div>
        </div>
      </header>

      {/* KPI Summary Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-card__label">Total Machines</span>
          <span className="kpi-card__value">{totalCount}</span>
        </div>
        <div className="kpi-card kpi-card--running">
          <span className="kpi-card__label">Running</span>
          <span className="kpi-card__value">{runningCount}</span>
        </div>
        <div className="kpi-card kpi-card--idle">
          <span className="kpi-card__label">Idle</span>
          <span className="kpi-card__value">{idleCount}</span>
        </div>
        <div className="kpi-card kpi-card--fault">
          <span className="kpi-card__label">Faults</span>
          <span className="kpi-card__value">{faultCount}</span>
        </div>
      </div>

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

      {/* Machine grid or table */}
      {status === 'succeeded' && machines.length > 0 && viewMode === 'cards' && (
        <div className="dashboard__grid">
          {machines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      )}

      {status === 'succeeded' && machines.length > 0 && viewMode === 'table' && (
        <div className="table-wrapper">
          <table className="machine-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Temperature</th>
                <th>Vibration</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((machine) => (
                <tr
                  key={machine.id}
                  onClick={() => dispatch(selectMachine(machine.id))}
                >
                  <td className="machine-table__id">{machine.id}</td>
                  <td className="machine-table__name">{machine.name}</td>
                  <td><StatusBadge status={machine.status} /></td>
                  <td>{machine.temperature}°C</td>
                  <td>{machine.vibration} mm/s</td>
                  <td className="machine-table__date">
                    {new Date(machine.lastUpdated).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
