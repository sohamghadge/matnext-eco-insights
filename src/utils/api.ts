import { useAuthStore } from '@/stores/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const getHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().token;
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const uploadFile = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/user-management/v1/file?source=USER`, {
    method: 'POST',
    headers: getHeaders(),
    body: formData,
  });

  const data = await res.json();
  return data?.data?.dmsId || null;
};

export const getOcrData = async (payload: {
  jobType: string;
  source: string;
  dmsId: string;
}) => {
  const res = await fetch(`${BASE_URL}/job-management/v1/ocr`, {
    method: 'POST',
    headers: {
      ...getHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data?.data;
};
