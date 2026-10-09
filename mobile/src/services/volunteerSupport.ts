import { api } from '@/services/api';

export type VolunteerSupportRequest = {
  id: number;
  type: string;
  description: string;
  created_at: string;
};

export async function getVolunteerSupportRequests(): Promise<VolunteerSupportRequest[]> {
  const { data } = await api.get<{ requests: VolunteerSupportRequest[] }>('/volunteer/support-requests');
  return data.requests;
}

export async function createVolunteerSupportRequest(type: string, description: string): Promise<void> {
  await api.post('/volunteer/support-requests', { type, description });
}
