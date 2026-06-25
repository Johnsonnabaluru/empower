/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { LogOut, Plus, Users, Landmark, TrendingUp, LandmarkIcon, Building2, Sparkles, User, HelpCircle } from 'lucide-react';
import { Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../constants';
import SearchBar from './SearchBar';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';

interface DashboardProps {
  onLogout: () => void;
  userEmail: string;
}

export default function Dashboard({ onLogout, userEmail }: DashboardProps) {
  // ==========================================
  // EMPLOYEE CORE DATABASE STATE (LocalStorage)
  // ==========================================
  const [employees, setEmployees] = useState<Employee[]>([]);

  // ==========================================
  // FILTERS & SEARCHING STATES
  // ==========================================
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' });

  // ==========================================
  // SORTING STATES
  // ==========================================
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // ==========================================
  // MODAL FORMS MANAGEMENT
  // ==========================================
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // ==========================================
  // PERSISTENCE ENGINE (READ)
  // ==========================================
  useEffect(() => {
    /* 
       Auth flow & Data storage compliance check: 
       Load employees from local storage.
    */
    const stored = localStorage.getItem('empower_employees_db');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Employee[];
        // Auto-purge any old legacy seed dummy data (with IDs like emp-1 to emp-6)
        const containsLegacyDummyData = parsed.some((emp) =>
          ['emp-1', 'emp-2', 'emp-3', 'emp-4', 'emp-5', 'emp-6'].includes(emp.id)
        );

        if (containsLegacyDummyData) {
          setEmployees([]);
          localStorage.setItem('empower_employees_db', JSON.stringify([]));
        } else {
          setEmployees(parsed);
        }
      } catch (e) {
        console.error('Failed to parse employee data from localStorage', e);
        setEmployees(INITIAL_EMPLOYEES);
        localStorage.setItem('empower_employees_db', JSON.stringify(INITIAL_EMPLOYEES));
      }
    } else {
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.setItem('empower_employees_db', JSON.stringify(INITIAL_EMPLOYEES));
    }
  }, []);

  // ==========================================
  // PERSISTENCE ENGINE (WRITE)
  // ==========================================
  const saveEmployeesToLocalStorage = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem('empower_employees_db', JSON.stringify(newEmployees));
  };

  // ==========================================
  // CRUD COMMANDS
  // ==========================================
  
  // Handle Add / Edit form submit
  const handleFormSubmit = (formData: {
    name: string;
    email: string;
    jobTitle: string;
    department: string;
    salary: number;
  }) => {
    if (selectedEmployee) {
      // UPDATE ACTION
      const updatedList = employees.map((emp) =>
        emp.id === selectedEmployee.id
          ? { ...emp, ...formData } // retain ID and original createdAt stamp
          : emp
      );
      saveEmployeesToLocalStorage(updatedList);
    } else {
      // CREATE ACTION
      const newEmployee: Employee = {
        id: `emp-${Date.now()}`, // generate unique ID based on millisecond timestamp
        ...formData,
        createdAt: new Date().toISOString(),
      };
      saveEmployeesToLocalStorage([newEmployee, ...employees]);
    }
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  // Delete an employee from state and localStorage
  const handleDeleteEmployee = (id: string) => {
    const filtered = employees.filter((emp) => emp.id !== id);
    saveEmployeesToLocalStorage(filtered);
  };

  // Open the form with an existing employee selected for editing
  const handleOpenEditForm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  // Open the form in creation mode (no employee selected)
  const handleOpenAddForm = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  // Close form modal cleanly
  const handleCloseForm = () => {
    setSelectedEmployee(null);
    setIsFormOpen(false);
  };

  // ==========================================
  // SORTING CONTROLLER
  // ==========================================
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Switch to new sort field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // ==========================================
  // LIVE ANALYTICS AGGREGATOR (DASHBOARD STATS)
  // ==========================================
  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
  
  // Get distinct departments with actual members
  const uniqueDepartmentsCount = new Set(employees.map((emp) => emp.department)).size;

  // ==========================================
  // FILTER & SEARCH LOGIC
  // ==========================================
  const filteredEmployees = employees
    .filter((emp) => {
      // Keyword matches Name, Email, or Job Title
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesKeyword =
        !searchLower ||
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.jobTitle.toLowerCase().includes(searchLower);

      // Matches Department Filter
      const matchesDepartment = !selectedDepartment || emp.department === selectedDepartment;

      // Matches Salary Range Filter
      const minSalary = salaryRange.min !== '' ? parseFloat(salaryRange.min) : 0;
      const maxSalary = salaryRange.max !== '' ? parseFloat(salaryRange.max) : Infinity;
      const matchesSalary = emp.salary >= minSalary && emp.salary <= maxSalary;

      return matchesKeyword && matchesDepartment && matchesSalary;
    })
    // Apply sorting selection
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'salary') {
        comparison = a.salary - b.salary;
      } else if (sortField === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (sortField === 'department') {
        comparison = a.department.localeCompare(b.department);
      } else if (sortField === 'jobTitle') {
        comparison = a.jobTitle.localeCompare(b.jobTitle);
      } else {
        // Fallback or default is 'name'
        comparison = a.name.localeCompare(b.name);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div id="dashboard-container" className="min-h-screen bg-[#080808] flex flex-col font-sans text-gray-200">
      
      {/* ========================================================
          TOP NAVIGATION BAR
          ======================================================== */}
      <nav id="dashboard-navbar" className="bg-[#0e0e0e] border-b border-white/10 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo Group */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-950/50">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight font-display">Empower</span>
                <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-semibold bg-white/10 text-gray-400 rounded-md border border-white/10">
                  v1.2
                </span>
              </div>
            </div>

            {/* Profile & Logout Action */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 border border-white/10 font-bold">
                  {userEmail[0].toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white truncate max-w-[150px]">{userEmail}</p>
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">Administrator</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                id="logout-button"
                className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                title="Log out from session"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ========================================================
          CORE MAIN WRAPPER
          ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Welcome Section */}
        <div id="dashboard-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Enterprise Dashboard
            </h1>
            <p className="text-sm text-gray-400">
              Welcome back. Oversee, analyze, and manage your global staff directory below.
            </p>
          </div>

          <button
            onClick={handleOpenAddForm}
            id="register-employee-button"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4.5 py-2.5 rounded-xl shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>Register Employee</span>
          </button>
        </div>

        {/* ========================================================
            METRICS & ANALYTICS INTERACTIVE GRID
            ======================================================== */}
        <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Headcount */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 hover:border-white/20 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Headcount</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{totalEmployees}</h3>
            </div>
          </div>

          {/* Card 2: Total Payroll */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 hover:border-white/20 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Annual Payroll</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">
                ${totalPayroll.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Card 3: Average Salary */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 hover:border-white/20 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Salary</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">
                ${Math.round(averageSalary).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Card 4: Departments */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 hover:border-white/20 hover:bg-white/10 transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Sectors</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{uniqueDepartmentsCount}</h3>
            </div>
          </div>
        </div>

        {/* ========================================================
            SEARCH, FILTER BAR & TABLE VIEWER SECTION
            ======================================================== */}
        <div id="directory-panel" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display">
              Employee Directory
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              Showing {filteredEmployees.length} of {totalEmployees} employees
            </span>
          </div>

          {/* SearchBar Filter */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            salaryRange={salaryRange}
            onSalaryRangeChange={setSalaryRange}
          />

          {/* Employee Records Interactive Grid */}
          <EmployeeTable
            employees={filteredEmployees}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteEmployee}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </div>
      </main>

      {/* ========================================================
          MODAL EMPLOYEE REGISTRATION FORM OVERLAY
          ======================================================== */}
      {isFormOpen && (
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}

      {/* Footer Branding line */}
      <footer className="py-6 border-t border-white/5 bg-[#0a0a0a] text-center text-xs text-gray-500">
        Empower Employee Hub. Fully sandboxed and secured using standard Web Cryptography and Browser Key-Value storage mechanisms.
      </footer>
    </div>
  );
}
