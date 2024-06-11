import User from "../models/user.js";
//import Level from "../models/level.js"; // TODO: Uncomment when Level collection is populated

//Create User
const createUser = async (req, res) => {
  try {
    //const level = await Level.findOne({ name: 1}) // TODO: Uncomment when Level collection is populated

    const newUser = new User({
      name: req.body.name,
      preferred_mode: req.body.preferred_mode,
      daily_goal: req.body.daily_goal,
      // level_id: level._id, // TODO: Uncomment when Level collection is populated
      is_setup_complete: req.body.is_setup_complete,
      device_id: req.body.device_id,
    });

    const response = await newUser.save();
    res.status(201).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

//Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, preferred_mode, daily_goal, is_setup_complete, device_id } =
      req.body;

    const user = await User.findById(id);

    user.name = name ?? user.name;
    user.preferred_mode = preferred_mode ?? user.preferred_mode;
    user.daily_goal = daily_goal ?? user.daily_goal;
    user.is_setup_complete = is_setup_complete ?? user.is_setup_complete;
    user.device_id = device_id ?? user.device_id;

    const response = await user.save();
    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};
export default {
  createUser,
  updateUser,
};
