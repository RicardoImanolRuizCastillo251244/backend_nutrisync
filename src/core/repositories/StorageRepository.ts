export interface UploadInput {
  key: string;
  contentType: string;
  body: Buffer;
}

export interface StorageRepository {
  upload(input: UploadInput): Promise<{ key: string; url: string }>;
  getSignedReadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
