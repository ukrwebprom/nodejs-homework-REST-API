const ctrlWrapper = (ctrl) => {
  const wrap = async (req, res, next) => {
    try {
      await ctrl(req, res);
    } catch (err) {
      next(err);
    }
  };
  return wrap;
};

module.exports = ctrlWrapper;
