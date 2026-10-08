import { api } from '@/services/api';
import { mapApiDonationToDonation, type ApiDonation } from '@/services/donations';
import type { Donation } from '@/types/donation';

type ApiNgoDonation = ApiDonation & {
  user?: { id: number; name: string; role: string };
};

export type NgoDonation = Donation & {
  donorName: string;
  donorRole: string;
};

export type AvailableVolunteer = {
  id: string;
  name: string;
};

function mapNgoDonation(item: ApiNgoDonation): NgoDonation {
  return {
    ...mapApiDonationToDonation(item),
    donorName: item.user?.name ?? 'Donor',
    donorRole: item.user?.role ?? 'donor',
  };
}

export async function getNgoDonations() {
  const { data } = await api.get<{
    available_donations: ApiNgoDonation[];
    my_donations: ApiNgoDonation[];
  }>('/ngo/donations');

  return {
    available: data.available_donations.map(mapNgoDonation),
    mine: data.my_donations.map(mapNgoDonation),
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

export async function assignNgoVolunteer(id: string, volunteerId: string): Promise<NgoDonation> {
  const { data } = await api.post<{ donation: ApiNgoDonation }>(
    `/ngo/donations/${encodeURIComponent(id)}/assign`,
    { volunteer_id: Number(volunteerId) },
  );
  return mapNgoDonation(data.donation);
}
