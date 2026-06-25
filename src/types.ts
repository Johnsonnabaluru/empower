/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  salary: number;
  createdAt: string;
}

export type DepartmentType = 
  | 'Engineering'
  | 'Marketing'
  | 'Sales'
  | 'Human Resources'
  | 'Finance'
  | 'Design'
  | 'Operations';

export const DEPARTMENTS: DepartmentType[] = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Design',
  'Operations'
];

export interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  loginTime: string | null;
}
