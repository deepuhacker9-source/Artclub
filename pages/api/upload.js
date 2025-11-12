import formidable from "formidable";
import fs from "fs";
import { supabase } from "../../lib/supabaseClient";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const form = formidable({ multiples: false, keepExtensions: true });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // For formidable v3, files.photo may be array or single object:
    const photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;

    if (!photoFile) {
      return res.status(400).json({ error: "No photo file uploaded" });
    }

    const filePath = photoFile.filepath || photoFile.path || photoFile._writeStream?.path;
    if (!filePath) {
      console.error("Invalid photo file object:", photoFile);
      return res.status(400).json({ error: "Invalid photo file path" });
    }

    const fileData = fs.readFileSync(filePath);
    const fileExt = photoFile.originalFilename?.split(".").pop() || "jpg";
    const fileName = `${Date.now()}.${fileExt}`;

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("requests")
      .upload(fileName, fileData, {
        cacheControl: "3600",
        upsert: false,
        contentType: photoFile.mimetype || "image/jpeg",
      });

    if (uploadError) throw uploadError;

    // Insert metadata into requests table
    const { error: dbError } = await supabase.from("requests").insert([
      {
        name: fields.name,
        email: fields.email,
        event_date: fields.event_date,
        address: fields.address,
        notes: fields.notes,
        photo_path: fileName,
        status: "pending",
      },
    ]);

    if (dbError) throw dbError;

    res.status(200).json({ message: "✅ Success" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
  }
