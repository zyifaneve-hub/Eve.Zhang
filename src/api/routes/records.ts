import { Router } from 'express';
import { supabase } from '../supabaseClient.js';
import * as crypto from 'crypto';

const router = Router();

// GET all records
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    console.error('Error fetching records:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET a specific record
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) { res.status(404).json({ error: 'Record not found' }); return; }
    res.json(data);
  } catch (err: any) {
    console.error('Error fetching record:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST to create a record
router.post('/', async (req, res) => {
  try {
    const recordData = req.body;
    let imageUrl = recordData.image; // Assume it's an existing URL unless it's base64

    // If the image is a base64 string, upload it to Supabase Storage
    if (recordData.image && recordData.image.startsWith('data:image')) {
      const match = recordData.image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (match) {
        const ext = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${crypto.randomUUID()}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('record_images')
          .upload(filename, buffer, {
            contentType: `image/${ext}`
          });
          
        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase
          .storage
          .from('record_images')
          .getPublicUrl(filename);
          
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // Insert into DB
    const insertPayload = {
      title: recordData.title,
      artist: recordData.artist,
      price: recordData.price,
      media_grade: recordData.mediaGrade,
      sleeve_grade: recordData.sleeveGrade,
      format: recordData.format,
      label: recordData.label || null,
      year: recordData.year ? String(recordData.year) : null,
      catalog_number: recordData.catalogNumber || null,
      description: recordData.description || null,
      audio_features: recordData.audioFeatures || null,
      accessories: recordData.accessories || null,
      image_url: imageUrl,
      liked: false
    };

    const { data, error } = await supabase
      .from('records')
      .insert([insertPayload])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);

  } catch (err: any) {
    console.error('Error creating record:', err);
    res.status(500).json({ error: err.message });
  }
});

export const recordRoutes = router;
