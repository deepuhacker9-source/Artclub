import formidable from "formidable";
import fs from "fs";
import { supabase } from "../../lib/supabaseClient";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parse error" });

    const file = files.photo?.[0];
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}_${file.originalFilename}`;
    const fileBuffer = fs.readFileSync(file.filepath);

    const { data, error } = await supabase.storage
      .from("requests")
      .upload(fileName, fileBuffer, { contentType: file.mimetype });

    if (error) return res.status(500).json({ error: error.message });

    // Insert request record into database
    const { error: insertError } = await supabase.from("requests").insert({
      name: fields.name,
      email: fields.email,
      event_date: fields.event_date,
      address: fields.address,
      notes: fields.notes,
      storage_path: data.path, // ✅ file path inserted properly
      status: "pending",
    });

    if (insertError) return res.status(500).json({ error: insertError.message });

    res.status(200).json({ message: "Request submitted successfully!" });
  });
}
