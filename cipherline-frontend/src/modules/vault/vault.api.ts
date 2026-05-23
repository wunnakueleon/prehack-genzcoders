import api from "../../api";

export type VaultEntry = {
  id: string;
  userId: string;
  siteName: string;
  siteUrl: string | null;
  usernameForSite: string;
  encryptedPassword: string;
  expiryDate: string | null;
  breachStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEntryPayload = {
  userId: string;
  siteName: string;
  usernameForSite: string;
  encryptedPassword: string;
  siteUrl?: string;
  expiryDate?: string;
};

export type UpdateEntryPayload = Partial<Omit<CreateEntryPayload, "userId">> & {
  breachStatus?: string;
};

export const vaultApi = {
  getEntries: (userId: string) =>
    api.get<VaultEntry[]>("/vault", { params: { userId } }),

  createEntry: (payload: CreateEntryPayload) =>
    api.post<VaultEntry>("/vault", payload),

  updateEntry: (id: string, payload: UpdateEntryPayload) =>
    api.put<VaultEntry>(`/vault/${id}`, payload),

  deleteEntry: (id: string) =>
    api.delete<VaultEntry>(`/vault/${id}`),
};
