export interface UploadInput {
  key: string;
  body: Buffer | Blob;
  contentType: string;
}

export interface StorageService {
  upload(input: UploadInput): Promise<{ key: string; url: string }>;
  getSignedReadUrl(key: string, expiresInSeconds?: number): Promise<string>;
  deleteObjects(keys: string[]): Promise<void>;
}