import formidable from "formidable";
import fs from "fs";
import { supabase } from "../../lib/supabaseClient";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Parse error" });
    try {
      const file = files.photo;
      if (!file) return res.status(400).json({ error: "No photo uploaded" });

      const buffer = fs.readFileSync(file.filepath);
      const filename = `${Date.now()}_${file.originalFilename.replace(/\s+/g,"_")}`;
      // For now store in anonymous folder. If logged in, pass customer_id in fields and use that.
      const customerFolder = fields.customer_id || 'anonymous';
      const filepath = `${customerFolder}/${filename}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("requests")
        .upload(filepath, buffer, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      // create DB entry
      const { error: insertError } = await supabase.from("requests").insert([
        {
          customer_id: fields.customer_id || null,
          event_date: fields.date || null,
          address: fields.address || null,
          notes: fields.notes || null,
          storage_path: uploadData.path,
          status: "pending"
        }
      ]);

      if (insertError) throw insertError;

      return res.status(200).json({ success: true, path: uploadData.path });
    } catch (e) {
      console.error("upload error", e);
      return res.status(500).json({ error: e.message || "Server error" });
    }
  });
}
