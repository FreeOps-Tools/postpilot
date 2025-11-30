import express from 'express';
import multer from 'multer';
import { accountsDb } from '../database';
import { PlatformService } from '../services/platformService';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/post', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 },
]), async (req, res) => {
  try {
    const { text, platforms } = req.body;
    const images = req.files?.['images'] as Express.Multer.File[] || [];
    const videos = req.files?.['videos'] as Express.Multer.File[] || [];

    if (!text || !platforms) {
      return res.status(400).json({ error: 'Missing required fields: text, platforms' });
    }

    const platformList = Array.isArray(platforms) ? platforms : [platforms];
    const results = [];

    for (const platform of platformList) {
      const account = accountsDb.findByPlatform(platform)[0];
      if (!account) {
        results.push({
          success: false,
          platform,
          error: 'Account not authenticated',
        });
        continue;
      }

      const result = await PlatformService.postToPlatform(platform, account, {
        text,
        images: images as any,
        videos: videos as any,
      });

      results.push(result);
    }

    res.json({ results });
  } catch (error: any) {
    console.error('Post error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

