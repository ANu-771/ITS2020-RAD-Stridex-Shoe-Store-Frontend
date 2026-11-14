import api from './api';

export const uploadService = {
  uploadSingle: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post<{ success: boolean; data: { url: string } }>('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data.url;
  },

  uploadMultiple: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const res = await api.post<{ success: boolean; data: { urls: string[] } }>('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data.urls;
  },
};
