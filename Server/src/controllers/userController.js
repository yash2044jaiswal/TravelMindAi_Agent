import Trip from '../models/Trip.js';
import Chat from '../models/Chat.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * Controller to compile core analytical indicators for the dashboard views.
 */
class UserController {

  // GET /api/users/dashboard
  getDashboardStats = async (req, res, next) => {
    try {
      const userId = req.user._id;

      // Gather parallel analytical counts
      const [totalTrips, recentTrips, chatCount] = await Promise.all([
        Trip.countDocuments({ user: userId }),
        Trip.find({ user: userId }).sort({ createdAt: -1 }).limit(3),
        Chat.countDocuments({ user: userId })
      ]);

      // Calculate total spending recorded
      const budgetAccumulator = await Trip.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, totalSpent: { $sum: '$totalCost.total' } } }
      ]);

      const totalSpentCalculated = budgetAccumulator.length > 0 ? budgetAccumulator[0].totalSpent : 0;

      // Real monthly trend for the last 6 months (trip count + spend), derived
      // from actual saved trips - no fabricated placeholder series.
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);

      const monthlyAgg = await Trip.aggregate([
        { $match: { user: userId, createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            trips: { $sum: 1 },
            budget: { $sum: '$totalCost.total' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);

      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const match = monthlyAgg.find(m => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1);
        monthlyTrend.push({
          month: d.toLocaleString('default', { month: 'short' }),
          trips: match ? match.trips : 0,
          budget: match ? match.budget : 0,
        });
      }

      // Average budget utilization across saved trips (real ratio, not fabricated).
      const utilizationAgg = await Trip.aggregate([
        { $match: { user: userId, budget: { $gt: 0 } } },
        { $project: { ratio: { $multiply: [{ $divide: ['$totalCost.total', '$budget'] }, 100] } } },
        { $group: { _id: null, avgUtilization: { $avg: '$ratio' } } },
      ]);
      const avgBudgetUtilization = utilizationAgg.length > 0 ? Math.round(utilizationAgg[0].avgUtilization) : null;

      return res.status(200).json(
        new ApiResponse(200, {
          totalTrips,
          chatCount,
          totalInvestment: totalSpentCalculated,
          recentTrips,
          monthlyTrend,
          avgBudgetUtilization
        }, 'Dashboard metrics loaded.')
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();