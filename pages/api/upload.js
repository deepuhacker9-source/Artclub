import formidable from "formidable";
import fs from "fs";
import { supabase } from "../../lib/supabaseClient";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parse error" });

    const file = files.photo;
    let storagePath = null;
    if (file) {
      const f = Array.isArray(file) ? file[0] : file;
      try {
        const buffer = fs.readFileSync(f.filepath);
        const fileName = `${Date.now()}_${(f.originalFilename || "upload").replace(/\s+/g, "_")}`;
        const { data, error: upErr } = await supabase.storage.from("artworks").upload(fileName, buffer, { contentType: f.mimetype, upsert: false });
        if (upErr) return res.status(500).json({ error: upErr.message });
        storagePath = data.path || fileName;
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "File processing failed" });
      }
    }

    const insertPayload = {
      name: fields.name || null,
      email: fields.email || null,
      event_date: fields.event_date || null,
      address: fields.address || null,
      notes: fields.notes || null,
      storage_path: storagePath,
      status: "pending",
      price: fields.price ? Number(fields.price) : undefined,
    };

    if (fields.customer_id) insertPayload.customer_id = fields.customer_id;

    const { error: insertError } = await supabase.from("requests").insert(insertPayload);
    if (insertError) return res.status(500).json({ error: insertError.message });

    return res.status(200).json({ message: "Request submitted successfully" });
  });
}