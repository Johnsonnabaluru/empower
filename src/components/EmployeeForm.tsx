/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Employee, DEPARTMENTS } from '../types';

interface EmployeeFormProps {
  employee?: Employee | null; // If present, we are in EDIT mode
  onSubmit: (data: { name: string; email: string; jobTitle: string; department: string; salary: number }) => void;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  jobTitle?: string;
  department?: string;
  salary?: string;
}

export default function EmployeeForm({ employee, onSubmit, onClose }: EmployeeFormProps) {
  const isEditMode = !!employee;

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');

  // Validation Errors State
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize fields if editing an existing employee
  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setJobTitle(employee.jobTitle);
      setDepartment(employee.department);
      setSalary(employee.salary.toString());
    } else {
      setName('');
      setEmail('');
      setJobTitle('');
      setDepartment('');
      setSalary('');
    }
    setErrors({});
    setIsSubmitted(false);
  }, [employee]);

  // Form validation function
  const validate = (): boolean => {
    const tempErrors: FormErrors = {};

    if (!name.trim()) {
      tempErrors.name = 'Employee name is required.';
    } else if (name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!jobTitle.trim()) {
      tempErrors.jobTitle = 'Job title is required.';
    } else if (jobTitle.trim().length < 2) {
      tempErrors.jobTitle = 'Job title must be at least 2 characters.';
    }

    if (!department) {
      tempErrors.department = 'Please select a department.';
    }

    const salaryNum = parseFloat(salary);
    if (!salary.trim()) {
      tempErrors.salary = 'Salary is required.';
    } else if (isNaN(salaryNum) || salaryNum <= 0) {
      tempErrors.salary = 'Salary must be a positive number greater than 0.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validate()) {
      onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        jobTitle: jobTitle.trim(),
        department,
        salary: Math.round(parseFloat(salary) * 100) / 100, // round to 2 decimals
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div
        id="employee-form-modal"
        className="relative w-full max-w-lg bg-[#0e0e0e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-scaleUp"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
          <h3 id="form-modal-title" className="text-lg font-bold text-white font-display">
            {isEditMode ? 'Edit Employee Details' : 'Register New Employee'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Employee Name */}
          <div>
            <label htmlFor="form-employee-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              id="form-employee-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (isSubmitted) validate();
              }}
              className={`block w-full px-3.5 py-2.5 bg-[#121212] border ${
                errors.name ? 'border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50' : 'border-white/10 focus:ring-indigo-500 focus:border-indigo-500'
              } rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 transition-all`}
              placeholder="e.g. Johnathan Doe"
            />
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="form-employee-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              id="form-employee-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (isSubmitted) validate();
              }}
              className={`block w-full px-3.5 py-2.5 bg-[#121212] border ${
                errors.email ? 'border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50' : 'border-white/10 focus:ring-indigo-500 focus:border-indigo-500'
              } rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 transition-all`}
              placeholder="e.g. john.doe@empower.com"
            />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Grid for Department & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Department Dropdown */}
            <div>
              <label htmlFor="form-employee-dept" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Department *
              </label>
              <select
                id="form-employee-dept"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  if (isSubmitted) validate();
                }}
                className={`block w-full px-3.5 py-2.5 bg-[#121212] border ${
                  errors.department ? 'border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50' : 'border-white/10 focus:ring-indigo-500 focus:border-indigo-500'
                } rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 transition-all cursor-pointer`}
              >
                <option value="" disabled className="bg-[#121212] text-gray-500">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-[#121212] text-gray-300">
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.department}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label htmlFor="form-employee-title" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <input
                id="form-employee-title"
                type="text"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  if (isSubmitted) validate();
                }}
                className={`block w-full px-3.5 py-2.5 bg-[#121212] border ${
                  errors.jobTitle ? 'border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50' : 'border-white/10 focus:ring-indigo-500 focus:border-indigo-500'
                } rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 transition-all`}
                placeholder="e.g. Senior Frontend Developer"
              />
              {errors.jobTitle && (
                <p className="mt-1 flex items-center gap-1 text-xs text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.jobTitle}
                </p>
              )}
            </div>
          </div>

          {/* Salary Input */}
          <div>
            <label htmlFor="form-employee-salary" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Annual Salary (USD) *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 font-semibold font-mono">
                $
              </span>
              <input
                id="form-employee-salary"
                type="number"
                min="0"
                step="any"
                value={salary}
                onChange={(e) => {
                  setSalary(e.target.value);
                  if (isSubmitted) validate();
                }}
                className={`block w-full pl-8 pr-3 py-2.5 bg-[#121212] border ${
                  errors.salary ? 'border-rose-500/50 focus:ring-rose-500/50 focus:border-rose-500/50' : 'border-white/10 focus:ring-indigo-500 focus:border-indigo-500'
                } rounded-xl text-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 transition-all font-mono`}
                placeholder="e.g. 95000"
              />
            </div>
            {errors.salary && (
              <p className="mt-1 flex items-center gap-1 text-xs text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.salary}
              </p>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-sm font-semibold rounded-xl transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-950/50 focus:outline-none"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Save Changes' : 'Register Employee'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
