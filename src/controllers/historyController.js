import History from "../models/History.js";

export const addHistory = async (req, res) => {
  const { artisanId, service, amount, status } = req.body;
  const customerId = req.user.id;

  const history = await History.create({
    artisan: artisanId,
    customer: customerId,
    service,
    amount,
    status,
  });

  res.json({ message: "History added", history });
};

export const getUserHistory = async (req, res) => {
  const histories = await History.find({ customer: req.user.id })
    .populate("artisan", "walletAddress name service");
  res.json(histories);
};

export const getArtisanHistory = async (req, res) => {
  const { artisanId } = req.params;
  const histories = await History.find({ artisan: artisanId })
    .populate("customer", "walletAddress");
  res.json(histories);
};
