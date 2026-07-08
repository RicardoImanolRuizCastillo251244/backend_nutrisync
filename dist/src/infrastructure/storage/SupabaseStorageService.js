"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseStorageService = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../../shared/config/env");
class SupabaseStorageService {
    constructor() {
        this.client = (0, supabase_js_1.createClient)(env_1.env.SUPABASE_URL, env_1.env.SUPABASE_SERVICE_ROLE_KEY);
    }
    async upload(input) {
        const bucket = env_1.env.SUPABASE_STORAGE_BUCKET;
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
    async getSignedReadUrl(key, expiresInSeconds = 3600) {
        const bucket = env_1.env.SUPABASE_STORAGE_BUCKET;
        const { data, error } = await this.client.storage
            .from(bucket)
            .createSignedUrl(key, expiresInSeconds);
        if (error) {
            throw new Error(`Supabase signed URL failed: ${error.message}`);
        }
        return data.signedUrl;
    }
}
exports.SupabaseStorageService = SupabaseStorageService;
//# sourceMappingURL=SupabaseStorageService.js.map