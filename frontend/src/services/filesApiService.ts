import apiService from '@/services/apiService';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  url?: string;
}

class FilesApiService {
  public async upload(file: File, metadata?: Record<string, any>): Promise<FileItem> {
    const res = await apiService.uploadFile<FileItem>('/files/upload', file, metadata);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to upload file');
  }

  public async uploadBulk(files: File[]): Promise<FileItem[]> {
    const res = await apiService.uploadFiles<FileItem[]>('/files/bulk-upload', files);
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to upload files');
  }

  public async list(): Promise<FileItem[]> {
    const res = await apiService.get<FileItem[]>('/files');
    if (res.success && res.data) return res.data;
    throw new Error(res.message || 'Failed to list files');
  }

  public async getDownloadUrl(id: string): Promise<string> {
    const res = await apiService.get<{ url: string }>(`/files/${id}`);
    if (res.success && res.data?.url) return res.data.url;
    throw new Error(res.message || 'Failed to get download URL');
  }

  public async delete(id: string): Promise<void> {
    const res = await apiService.delete(`/files/${id}`);
    if (!res.success) throw new Error(res.message || 'Failed to delete file');
  }
}

export default new FilesApiService(); 