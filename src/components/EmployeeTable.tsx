/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Mail, Briefcase, DollarSign, Building } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
}

// Map departments to high-contrast modern tailwind color tokens
export const getDepartmentBadgeStyles = (dept: string) => {
  switch (dept) {
    case 'Engineering':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'Marketing':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'Sales':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Human Resources':
      return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20';
    case 'Finance':
      return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    case 'Design':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    case 'Operations':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default:
      return 'bg-white/5 text-gray-300 border-white/10';
  }
};

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSortChange,
}: EmployeeTableProps) {
  // Simple confirmation logic
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 text-gray-500 group-hover:text-gray-300 transition-colors" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1.5 text-indigo-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1.5 text-indigo-400" />
    );
  };

  if (employees.length === 0) {
    return (
      <div id="no-employees-view" className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-dashed border-white/15 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-4 border border-white/10">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No employees found</h3>
        <p className="text-sm text-gray-400 mt-1 max-w-sm">
          No records match your selected search or filters. Try adjusting your queries or register a new employee.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ========================================================
          DESKTOP TABLE VIEW (Visible on md and larger screens)
          ======================================================== */}
      <div id="desktop-employee-table" className="hidden md:block overflow-hidden bg-white/5 border border-white/10 rounded-2xl shadow-xl">
        <table className="min-w-full divide-y divide-white/5 text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              {/* Employee Name Header */}
              <th scope="col" className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSortChange('name')}
                  className="group inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white focus:outline-none"
                >
                  Employee Name
                  {renderSortIcon('name')}
                </button>
              </th>
              {/* Email Header */}
              <th scope="col" className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSortChange('email')}
                  className="group inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white focus:outline-none"
                >
                  Email Address
                  {renderSortIcon('email')}
                </button>
              </th>
              {/* Job Title Header */}
              <th scope="col" className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSortChange('jobTitle')}
                  className="group inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white focus:outline-none"
                >
                  Job Title
                  {renderSortIcon('jobTitle')}
                </button>
              </th>
              {/* Department Header */}
              <th scope="col" className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSortChange('department')}
                  className="group inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white focus:outline-none"
                >
                  Department
                  {renderSortIcon('department')}
                </button>
              </th>
              {/* Salary Header */}
              <th scope="col" className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSortChange('salary')}
                  className="group inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white focus:outline-none"
                >
                  Annual Salary
                  {renderSortIcon('salary')}
                </button>
              </th>
              {/* Actions Header */}
              <th scope="col" className="relative px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-white/5 transition-colors">
                {/* Employee Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold border border-indigo-500/30">
                      {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{employee.name}</div>
                      <div className="text-xs text-gray-500">ID: {employee.id}</div>
                    </div>
                  </div>
                </td>
                {/* Email */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  <span className="font-mono text-xs">{employee.email}</span>
                </td>
                {/* Job Title */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  <span className="font-medium">{employee.jobTitle}</span>
                </td>
                {/* Department */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getDepartmentBadgeStyles(employee.department)}`}>
                    {employee.department}
                  </span>
                </td>
                {/* Salary */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-200 font-medium font-mono">
                  ${employee.salary.toLocaleString()}
                </td>
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {deletingId === employee.id ? (
                    <div className="flex items-center justify-end gap-2 animate-fadeIn">
                      <span className="text-xs text-rose-400 font-semibold mr-1">Confirm delete?</span>
                      <button
                        onClick={() => handleConfirmDelete(employee.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-lg border border-white/10 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-950/40 rounded-lg transition-all"
                        title="Edit Employee"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(employee.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-all"
                        title="Delete Employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          MOBILE GRID VIEW (Visible on mobile screens)
          ======================================================== */}
      <div id="mobile-employee-cards" className="block md:hidden space-y-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg space-y-4"
          >
            {/* Card Header Profile */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold border border-indigo-500/30">
                {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{employee.name}</h4>
                <p className="text-xs text-gray-500 truncate">ID: {employee.id}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getDepartmentBadgeStyles(employee.department)}`}>
                {employee.department}
              </span>
            </div>

            {/* Employee details */}
            <div className="space-y-2 text-xs border-y border-white/5 py-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Briefcase className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="font-medium truncate">{employee.jobTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="font-mono truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200 font-semibold">
                <DollarSign className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span>${employee.salary.toLocaleString()} / year</span>
              </div>
            </div>

            {/* Action panel */}
            <div className="flex items-center justify-end pt-1">
              {deletingId === employee.id ? (
                <div className="flex items-center gap-2 w-full justify-between bg-rose-950/40 p-2 rounded-xl border border-rose-500/20 text-rose-300">
                  <span className="text-xs text-rose-300 font-semibold">Confirm delete?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmDelete(employee.id)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(employee)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-indigo-950/40 hover:text-indigo-400 border border-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(employee.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-rose-950/40 hover:text-rose-400 border border-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
