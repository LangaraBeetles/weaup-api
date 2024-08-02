import User from "../models/User.js";
import { signObject } from "../shared/auth.js";
import { userAvatar, userBg } from "../shared/user.js";

//Create User
const createUser = async (req, res) => {
  try {
    let avatar_bg = userBg[0];
    let avatar_img = userAvatar[0];

    try {
      const randIndex = Math.floor(Math.random() * 7);
      avatar_bg = userBg[randIndex];
    } catch (error) {
      console.log("Error assigning the user bg", error.message);
    }

    try {
      const randIndex = Math.floor(Math.random() * 10);
      avatar_img = userAvatar[randIndex];
    } catch (error) {
      console.log("Error assigning the user avatar", error.message);
    }

    const newUser = new User({
      name: req.body.name,
      preferred_mode: req.body.preferred_mode,
      daily_goal: req.body.daily_goal,
      is_setup_complete: req.body.is_setup_complete,
      device_id: req.body.device_id,
      avatar_bg,
      avatar_img,
    });

    const response = await newUser.save();
    const user = response.toObject();
    const token = signObject(user);

    res.status(201).json({ data: { ...user, token }, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

//Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ data: null, error: "not found" });
      return;
    }

    user.name = req?.body?.name ?? user?.name;
    user.preferred_mode = req?.body?.preferred_mode ?? user?.preferred_mode;
    user.daily_goal = req?.body?.daily_goal ?? user?.daily_goal;
    user.is_setup_complete =
      req?.body?.is_setup_complete ?? user?.is_setup_complete;
    user.device_id = req?.body?.device_id ?? user?.device_id;

    user.xp = req?.body?.xp ?? user?.xp;
    user.hp = req?.body?.hp ?? user?.hp;
    user.level = req?.body?.level ?? user?.level;

    user.avatar_bg = req?.body?.avatar_bg ?? user?.avatar_bg;
    user.avatar_img = req?.body?.avatar_img ?? user?.avatar_img;

    user.daily_streak_counter =
      req?.body?.daily_streak_counter ?? user?.daily_streak_counter;

    user.badges = req?.body?.badges ?? user?.badges;

    const response = await user.save();
    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
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
    res.status(500).json({ data: null, error: error.message });
  }
};

//Get Users
const getUsers = async (req, res) => {
  try {
    const response = await User.find();

    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export default {
  createUser,
  updateUser,
  getUserById,
  getUsers,
};
