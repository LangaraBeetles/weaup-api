import User from "../models/User.js";

//Create User
const createUser = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      preferred_mode: req.body.preferred_mode,
      daily_goal: req.body.daily_goal,
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
    const {
      name,
      preferred_mode,
      daily_goal,
      is_setup_complete,
      device_id,
      hp,
      xp,
      level,
    } = req.body;

    const user = await User.findById(id);

    user.name = name ?? user.name;
    user.preferred_mode = preferred_mode ?? user.preferred_mode;
    user.daily_goal = daily_goal ?? user.daily_goal;
    user.is_setup_complete = is_setup_complete ?? user.is_setup_complete;
    user.device_id = device_id ?? user.device_id;
    user.hp = hp ?? user.hp;
    user.xp = xp ?? user.xp;
    user.level = level ?? user.level;

    const response = await user.save();
    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

//Get User by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await User.findById(id);

    if (!response) {
      return res.status(404).json({ data: null, error: "User not found" });
    }
    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

//Get Users
const getUsers = async (req, res) => {
  try {
    const response = await User.find();

    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

export default {
  createUser,
  updateUser,
  getUserById,
  getUsers,
};
