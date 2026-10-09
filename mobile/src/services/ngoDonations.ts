import { api } from '@/services/api';
import { mapApiDonationToDonation, type ApiDonation } from '@/services/donations';
import type { Donation } from '@/types/donation';

type ApiNgoDonation = ApiDonation & {
  user?: { id: number; name: string; role: string };
  rejected_by_current_ngo?: boolean;
};

export type NgoDonation = Donation & {
  donorName: string;
  donorRole: string;
  rejectedByCurrentNgo?: boolean;
};

type ApiNgoRejection = { id: number; created_at: string; donation: ApiNgoDonation };
export type NgoRejection = { id: string; createdAt: string; donation: NgoDonation };

function mapNgoRejection(item: ApiNgoRejection): NgoRejection {
  return { id: String(item.id), createdAt: item.created_at, donation: mapNgoDonation(item.donation) };
}

export type AvailableVolunteer = {
  id: string;
  name: string;
};

function mapNgoDonation(item: ApiNgoDonation): NgoDonation {
  return {
    ...mapApiDonationToDonation(item),
    donorName: item.user?.name ?? 'Donor',
    donorRole: item.user?.role ?? 'donor',
    rejectedByCurrentNgo: item.rejected_by_current_ngo,
  };
}

export async function getNgoDonations() {
  const { data } = await api.get<{
    available_donations: ApiNgoDonation[];
    my_donations: ApiNgoDonation[];
    rejected_donations?: ApiNgoRejection[];
  }>('/ngo/donations');

  return {
    available: data.available_donations.map(mapNgoDonation),
    mine: data.my_donations.map(mapNgoDonation),
    rejected: (data.rejected_donations ?? []).map(mapNgoRejection),
  };
}

export async function getNgoDonation(id: string): Promise<NgoDonation> {
  const { data } = await api.get<{ donation: ApiNgoDonation }>(
    `/ngo/donations/${encodeURIComponent(id)}`,
  );
  return mapNgoDonation(data.donation);
}

export async function acceptNgoDonation(id: string): Promise<NgoDonation> {
  const { data } = await api.post<{ donation: ApiNgoDonation }>(
    `/ngo/donations/${encodeURIComponent(id)}/accept`,
  );
  return mapNgoDonation(data.donation);
}

export async function getAvailableVolunteers(): Promise<AvailableVolunteer[]> {
  const { data } = await api.get<{
    volunteers: { id: number; name: string; is_available: boolean }[];
  }>('/ngo/volunteers');
  return data.volunteers.map((volunteer) => ({
    id: String(volunteer.id),
    name: volunteer.name,
  }));
}

export async function rejectNgoDonation(id: string): Promise<NgoRejection> {
  const { data } = await api.post<{ rejection: ApiNgoRejection }>(`/ngo/donations/${encodeURIComponent(id)}/reject`);
  return mapNgoRejection(data.rejection);
}

export async function assignNgoVolunteer(id: string, volunteerId: string): Promise<NgoDonation> {
  const { data } = await api.post<{ donation: ApiNgoDonation }>(
    `/ngo/donations/${encodeURIComponent(id)}/assign`,
    { volunteer_id: Number(volunteerId) },
  );
  return mapNgoDonation(data.donation);
}
