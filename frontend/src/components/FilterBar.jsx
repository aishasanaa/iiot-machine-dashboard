import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilterStatus,
  setSearchQuery,
  selectFilterStatus,
  selectSearchQuery,
} from '../store/machinesSlice';
import './FilterBar.css';

const STATUSES = ['all', 'running', 'idle', 'fault'];

export default function FilterBar() {
  const dispatch = useDispatch();
  const filterStatus = useSelector(selectFilterStatus);
  const searchQuery  = useSelector(selectSearchQuery);

  return (
    <div className="filter-bar">
      {/* Search by name */}
      <input
        className="filter-bar__search"
        type="text"
        placeholder="Search machines..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
      />

      {/* Filter by status */}
      <div className="filter-bar__buttons">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`filter-btn filter-btn--${s} ${filterStatus === s ? 'active' : ''}`}
            onClick={() => dispatch(setFilterStatus(s))}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
