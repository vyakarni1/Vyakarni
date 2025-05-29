
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  handled_by?: string;
  admin_notes?: string;
}
