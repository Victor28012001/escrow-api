import Review from "../models/Review.js";
import Artisan from "../models/Artisan.js";

export const addReview = async (req, res) => {
  const { artisanId, rating, comment } = req.body;
  const customerId = req.user.id;

  const review = await Review.create({
    artisan: artisanId,
    customer: customerId,
    rating,
    comment,
  });

  // Update average rating
  const reviews = await Review.find({ artisan: artisanId });
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  await Artisan.findByIdAndUpdate(artisanId, { averageRating: avg });

  res.json({ message: "Review added", review });
};

export const getReviews = async (req, res) => {
  const { artisanId } = req.params;
  const reviews = await Review.find({ artisan: artisanId }).populate("customer", "walletAddress");
  res.json(reviews);
};
