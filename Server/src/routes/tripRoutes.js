import express from 'express';
import tripController from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, tripController.createTrip)
  .get(protect, tripController.getUserTrips);

router.route('/:id')
  .get(protect, tripController.getTripById)
  .delete(protect, tripController.deleteTrip);

router.get('/:id/pdf', protect, tripController.exportTripPdf);

export default router;