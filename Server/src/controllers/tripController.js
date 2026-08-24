import Trip from '../models/Trip.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import pdfGenerator from '../services/PdfGeneratorService.js';

/**
 * Controller handling user curated trips, saving selections, and exporting files.
 */
class TripController {

  // POST /api/trips
  createTrip = async (req, res, next) => {
    try {
      const {
        source,
        destination,
        budget,
        days,
        travelers,
        itinerary,
        recommendations,
        totalCost
      } = req.body;

      if (!source || !destination || !budget || !days) {
        return next(new ApiError(400, 'Incomplete details. Unable to store trip plan.'));
      }

      const trip = await Trip.create({
        user: req.user._id,
        source,
        destination,
        budget,
        days,
        travelers: travelers || 1,
        itinerary,
        recommendations,
        totalCost
      });

      return res.status(201).json(
        new ApiResponse(211, trip, 'Trip itinerary successfully persisted to dashboard!')
      );
    } catch (err) {
      next(err);
    }
  };

  // GET /api/trips
  getUserTrips = async (req, res, next) => {
    try {
      const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.status(200).json(
        new ApiResponse(200, trips, 'List of user stored trips loaded.')
      );
    } catch (err) {
      next(err);
    }
  };

  // GET /api/trips/:id
  getTripById = async (req, res, next) => {
    try {
      const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
      if (!trip) {
        return next(new ApiError(404, 'Itinerary plan was not found or access is denied.'));
      }
      return res.status(200).json(
        new ApiResponse(200, trip, 'Trip details retrieved successfully.')
      );
    } catch (err) {
      next(err);
    }
  };

  // DELETE /api/trips/:id
  deleteTrip = async (req, res, next) => {
    try {
      const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      if (!trip) {
        return next(new ApiError(404, 'No matching records found to delete.'));
      }
      return res.status(200).json(
        new ApiResponse(200, null, 'Itinerary plan deleted from account.')
      );
    } catch (err) {
      next(err);
    }
  };

  // GET /api/trips/:id/pdf
  exportTripPdf = async (req, res, next) => {
    try {
      const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
      if (!trip) {
        return next(new ApiError(404, 'Failed to build PDF. Trip not found or unauthorized.'));
      }

      // Configure dynamic HTTP download headers targeting client browsers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="TravelMind_${trip.destination}_itinerary.pdf"`);

      // Invoke PDF stream piping to Express direct outputs
      pdfGenerator.generateTripPdf(trip, res);
    } catch (err) {
      next(err);
    }
  };
}

export default new TripController();