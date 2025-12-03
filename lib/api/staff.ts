import { axiosInstance } from '../axios';

// Staff entity matching API response
export interface Staff {
  _id: string;
  email: string;
  name?: string;
  role: 'staff';
  phone?: string;
  school?: string;
  createdAt?: string;
  updatedAt?: string;
  temporaryPassword?: string; // Only present in create response
}

// Paginated list response
export interface StaffListResponse {
  items: Staff[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Query parameters for listing staff members
export interface StaffQueryParams {
  q?: string;          // Search across name and email
  email?: string;      // Filter by exact email
  school?: string;     // Filter by school ObjectId
  page?: number;       // Page number (1-based)
  limit?: number;      // Page size (1-100)
  sortBy?: string;     // Field to sort by
  order?: 'asc' | 'desc'; // Sort order
}

// Data for creating a new staff member
export interface CreateStaffData {
  email: string;       // Required: unique email
  name?: string;       // Optional: display name
  phone?: string;      // Optional: contact phone
  school?: string;     // Optional: school ObjectId
}

// Data for updating an existing staff member
export interface UpdateStaffData {
  name?: string;       // Optional: updated display name
  email?: string;      // Optional: updated email (must be unique)
  phone?: string;      // Optional: updated contact number
  school?: string;     // Optional: new school ObjectId
}

// Delete response
export interface DeleteStaffResponse {
  deleted: boolean;
}

export const staffApi = {
  /**
   * Get paginated list of staff members with optional filters
   */
  getStaff: async (params?: StaffQueryParams): Promise<StaffListResponse> => {
    const { data } = await axiosInstance.get<StaffListResponse>('/staff', {
      params,
    });
    return data;
  },

  /**
   * Get a single staff member by ID
   */
  getStaffById: async (id: string): Promise<Staff> => {
    const { data } = await axiosInstance.get<Staff>(`/staff/${id}`);
    return data;
  },

  /**
   * Create a new staff member
   * Password is generated automatically by the system
   */
  createStaff: async (staffData: CreateStaffData): Promise<Staff> => {
    const { data } = await axiosInstance.post<Staff>('/staff', staffData);
    return data;
  },

  /**
   * Update an existing staff member
   */
  updateStaff: async (id: string, staffData: UpdateStaffData): Promise<Staff> => {
    const { data } = await axiosInstance.patch<Staff>(`/staff/${id}`, staffData);
    return data;
  },

  /**
   * Delete a staff member permanently
   */
  deleteStaff: async (id: string): Promise<DeleteStaffResponse> => {
    const { data } = await axiosInstance.delete<DeleteStaffResponse>(`/staff/${id}`);
    return data;
  },
};

