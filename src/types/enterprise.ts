
export interface EnterpriseInquiry {
  id?: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone?: string;
  company_size?: '1-50' | '51-200' | '201-1000' | '1000+';
  industry?: string;
  requirements?: string;
  estimated_users?: number;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EnterpriseFormData {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  company_size: '1-50' | '51-200' | '201-1000' | '1000+';
  industry: string;
  requirements: string;
  estimated_users: string;
  message: string;
}
