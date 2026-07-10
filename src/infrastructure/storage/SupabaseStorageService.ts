import { createClient } from "@supabase/supabase-js";
import type { StorageRepository, UploadInput } from "../../core/repositories/StorageRepository";
import { env } from "../../shared/config/env";

export class SupabaseStorageService implements StorageRepository {
  private readonly client: ReturnType<typeof createClient>;

  constructor() {
    this.client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  async upload(input: UploadInput): Promise<{ key: string; url: string }> {
    const bucket = env.SUPABASE_STORAGE_BUCKET;

    const { error } = await this.client.storage
      .from(bucket)
      .upload(input.key, input.body, {
        contentType: input.contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(input.key);

    return { key: input.key, url: data.publicUrl };
  }

  async getSignedReadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const bucket = env.SUPABASE_STORAGE_BUCKET;

    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(key, expiresInSeconds);

    if (error) {
      throw new Error(`Supabase signed URL failed: ${error.message}`);
    }

    return data.signedUrl;
  }

  async deleteObjects(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const bucket = env.SUPABASE_STORAGE_BUCKET;

    const { error } = await this.client.storage
      .from(bucket)
      .remove(keys);

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`);
    }
  }
}