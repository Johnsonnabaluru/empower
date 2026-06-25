/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, X, Filter } from 'lucide-react';
import { DEPARTMENTS } from '../types';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  salaryRange: { min: string; max: string };
  onSalaryRangeChange: (range: { min: string; max: string }) => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  salaryRange,
  onSalaryRangeChange,
}: SearchBarProps) {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleClearFilters = () => {
    onSearchChange('');
    onDepartmentChange('');
    onSalaryRangeChange({ min: '', max: '' });
  };

  const hasActiveFilters = searchTerm !== '' || selectedDepartment !== '' || salaryRange.min !== '' || salaryRange.max !== '';

  return (
    <div id="search-filter-container" className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <label htmlFor="search-input" className="sr-only">Search employees</label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Search by name, email, or job title..."
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 focus:outline-none"
              id="clear-search-button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Department Selection */}
        <div className="md:col-span-3">
          <label htmlFor="dept-filter" className="sr-only">Filter by Department</label>
          <div className="relative">
            <select
              id="dept-filter"
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="block w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#121212] text-gray-300">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-[#121212] text-gray-300">
                  {dept}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Salary Range Filter */}
        <div className="md:col-span-4 flex gap-2 items-center">
          <div className="w-1/2 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-gray-500 font-mono">$</span>
            <input
              id="min-salary-input"
              type="number"
              placeholder="Min Salary"
              value={salaryRange.min}
              onChange={(e) => onSalaryRangeChange({ ...salaryRange, min: e.target.value })}
              className="block w-full pl-6 pr-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          <span className="text-gray-500 text-xs">-</span>
          <div className="w-1/2 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-gray-500 font-mono">$</span>
            <input
              id="max-salary-input"
              type="number"
              placeholder="Max Salary"
              value={salaryRange.max}
              onChange={(e) => onSalaryRangeChange({ ...salaryRange, max: e.target.value })}
              className="block w-full pl-6 pr-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Active filters status / Reset Button */}
      {hasActiveFilters && (
        <div id="active-filters-row" className="flex flex-wrap gap-2 items-center justify-between pt-1">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-400 font-medium">Active criteria:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-white/10 text-gray-200 text-xs px-2.5 py-1 rounded-full font-medium border border-white/5">
                Keyword: "{searchTerm}"
                <button onClick={() => onSearchChange('')} className="hover:text-white focus:outline-none">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDepartment && (
              <span className="inline-flex items-center gap-1 bg-white/10 text-gray-200 text-xs px-2.5 py-1 rounded-full font-medium border border-white/5">
                Dept: {selectedDepartment}
                <button onClick={() => onDepartmentChange('')} className="hover:text-white focus:outline-none">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(salaryRange.min || salaryRange.max) && (
              <span className="inline-flex items-center gap-1 bg-white/10 text-gray-200 text-xs px-2.5 py-1 rounded-full font-medium border border-white/5">
                Salary: {salaryRange.min ? `$${parseInt(salaryRange.min).toLocaleString()}` : '$0'} - {salaryRange.max ? `$${parseInt(salaryRange.max).toLocaleString()}` : '∞'}
                <button onClick={() => onSalaryRangeChange({ min: '', max: '' })} className="hover:text-white focus:outline-none">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <button
            type="button"
            id="reset-all-filters-button"
            onClick={handleClearFilters}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium focus:outline-none focus:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
