"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Props = {
  uid: string;
  url: string | null;
  size?: number;
  avatarChangedCallback?: (publicUrl: string) => void;
};

export default function Avatar({
  uid,
  url,
  size = 100,
  avatarChangedCallback,
}: Props) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) {
      setAvatarUrl(url);
    }
  }, [url]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) {
        alert("Please select a file to upload.");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG formats are allowed.");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Upload error:", uploadError);
        alert("Failed to upload. Check bucket access.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;

      if (publicUrl) {
        setAvatarUrl(publicUrl);
        avatarChangedCallback?.(publicUrl);
      } else {
        console.error("⚠️ No public URL returned");
      }
    } catch (err) {
      console.error("Unexpected upload error:", err);
      alert("Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-full overflow-hidden border-4"
        style={{ width: size, height: size }}
      >
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-white w-6 h-6" />
          </div>
        )}

        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            width={size}
            height={size}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      <label
        htmlFor="avatar-upload"
        className="cursor-pointer bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition"
      >
        {uploading ? "Uploading..." : "Upload"}
        <input
          id="avatar-upload"
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
