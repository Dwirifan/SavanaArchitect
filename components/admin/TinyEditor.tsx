"use client";
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { compressImageToBlob } from "@/lib/compress";
import { uploadToSupabase } from "@/lib/upload";

export function TinyEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const idRef = useRef(`tiny-${Math.random().toString(36).slice(2)}`);
  return (
    <div className="tiny-wrapper rounded-xl border border-[var(--line)] overflow-hidden bg-[var(--bg)] focus-within:border-[var(--ink)] transition-colors">
      <Editor
        id={idRef.current}
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6.8.4/tinymce.min.js"
        value={value}
        onEditorChange={onChange}
        init={{
          height: 320,
          menubar: false,
          branding: false,
          statusbar: false,
          placeholder: placeholder || "Tulis konten di sini...",
          plugins: "link lists image table code wordcount",
          toolbar: "undo redo | bold italic underline | bullist numlist | link image | blocks | code",
          toolbar_mode: "sliding",
          content_style: "body{font-family:Inter,system-ui,sans-serif;font-size:13px;line-height:1.6;color:#111110;padding:12px} p{margin:0 0 8px} a{color:#111} img{max-width:100%;border-radius:8px}",
          skin: "oxide",
          content_css: "default",
          automatic_uploads: true,
          file_picker_types: "image",
          images_upload_handler: async (blobInfo: any) => {
            try {
              const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type });
              const compressed = await compressImageToBlob(file, 1200, 0.7);
              const f = new File([compressed], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
              const url = await uploadToSupabase(f, "editor");
              return url;
            } catch (e: any) {
              throw new Error(e.message || "Upload gagal");
            }
          },
          file_picker_callback: (cb: any) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = (input.files as FileList)[0];
              if (!file) return;
              try {
                const blob = await compressImageToBlob(file, 1200, 0.7);
                const f = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
                const url = await uploadToSupabase(f, "editor");
                cb(url, { title: file.name });
              } catch (e: any) { alert(e.message); }
            };
            input.click();
          },
        }}
      />
    </div>
  );
}
