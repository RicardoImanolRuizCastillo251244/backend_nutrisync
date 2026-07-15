import { createClient } from "@supabase/supabase-js";
import type { StorageService } from "@/modules/voice-notes/domain/ports/services/StorageService";
import { env } from "@/shared/config/env";

export class SupabaseStorageService implements StorageService {
  private client;

  constructor() {
    this.client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async upload(input: { key: string; body: Buffer; contentType: string }) {
    const bucket = env.SUPABASE_STORAGE_BUCKET;
    const { error } = await this.client.storage
      .from(bucket)
      .upload(input.key, input.body, {
        contentType: input.contentType,
        upsert: true,
      });

    if (error) throw new Error(`Supabase upload failed: ${error.message}`);

    const { data } = this.client.storage.from(bucket).getPublicUrl(input.key);
    return { key: input.key, url: data.publicUrl };
  }

  async getSignedReadUrl(key: string, expiresInSeconds = 3600) {
    const bucket = env.SUPABASE_STORAGE_BUCKET;
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(key, expiresInSeconds);
    if (error) throw new Error(`Supabase signed URL failed: ${error.message}`);
    return data.signedUrl;
  }

  async deleteObjects(keys: string[]) {
    if (keys.length === 0) return;
    const bucket = env.SUPABASE_STORAGE_BUCKET;
    const { error } = await this.client.storage.from(bucket).remove(keys);
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
  }
}