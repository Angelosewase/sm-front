import { axiosInstance } from "../axios";

export interface School {
  id: string;
  name: string;
  schoolType: string;
  establishedYear?: number;
  studentCapacity?: number;
  description?: string;
  address: string;
  city: string;
  district: string;
  phoneNumber: string;
  email: string;
  website?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  logoUrl?: string
}

export interface CreateSchoolPayload {
  name: string;
  schoolType: string;
  establishedYear?: number;
  studentCapacity?: number;
  description?: string;
  address: string;
  city: string;
  district: string;
  phoneNumber: string;
  email: string;
  website?: string;
  logo?: File;
}

export interface UpdateSchoolPayload {
  name?: string;
  schoolType?: string;
  establishedYear?: number;
  studentCapacity?: number;
  description?: string;
  address?: string;
  city?: string;
  district?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logo?: File;
}

const normalizeSchool = (school: any): School => {
  if (!school) {
    throw new Error("School payload is missing");
  }

  const id = school.id ?? school._id;
  if (!id) {
    throw new Error("School identifier is missing in the response payload");
  }

  return {
    id,
    name: school.name,
    schoolType: school.schoolType,
    establishedYear: school.establishedYear,
    studentCapacity: school.studentCapacity,
    description: school.description,
    address: school.address,
    city: school.city,
    district: school.district,
    phoneNumber: school.phoneNumber,
    email: school.email,
    website: school.website,
    logoUrl: school.logoUrl,
    status: school.status,
    createdAt: school.createdAt,
    updatedAt: school.updatedAt,
  };
};

export const schoolApi = {
  createSchool: async (payload: CreateSchoolPayload): Promise<School> => {
    const formData = new FormData();

    // Append all fields to formData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const { data } = await axiosInstance.post("/school", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return normalizeSchool(data);
  },

  listSchools: async (): Promise<School[]> => {
    const { data } = await axiosInstance.get("/school");
    return Array.isArray(data) ? data.map(normalizeSchool) : [];
  },

  getSchool: async (id: string): Promise<School> => {
    const { data } = await axiosInstance.get(`/school/${id}`);
    return normalizeSchool(data);
  },

  updateSchool: async (
    id: string,
    payload: UpdateSchoolPayload
  ): Promise<School> => {
    const formData = new FormData();

    // Append all fields to formData
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const { data } = await axiosInstance.patch(`/school/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return normalizeSchool(data);
  },
  deleteSchool: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/school/${id}`);
  },
};
