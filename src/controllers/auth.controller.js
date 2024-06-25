import { refreshToken } from "../shared/auth.js";

const refresh = async (req, res) => {
  try {
    const newToken = refreshToken(req.params.token);

    res.status(200).json({ data: { token: newToken }, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export default {
  refresh,
};
