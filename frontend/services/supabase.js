import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ALLOWED_EXTENSIONS = ["glb", "gltf", "fbx", "obj", "png", "jpg", "jpeg", "webp", "hdr", "exr", "zip"]

function validateFile(file) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext) return false;
    return ALLOWED_EXTENSIONS.includes(ext);
}


export async function uploadFile(file, userId) {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext) throw new Error("Invalid file");

    if (!validateFile(file)) {
        throw new Error("File type not allowed");
    }

    const fileKey = `${userId}_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
        .from("lead-attachments")
        .upload(fileKey, file, {
            upsert: false,
            contentType: file.type
        });

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from("lead-attachments")
        .getPublicUrl(fileKey);

    return {
        fileKey,
        fileUrl: data.publicUrl
    };
}
