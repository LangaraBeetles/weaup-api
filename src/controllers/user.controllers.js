import User from "../models/user.js";
//import Level from "../models/level.js"; // TODO: Uncomment when Level collection is populated

//Create User
const createUser = async (req, res) => {
  try {
    //const level = await Level.findOne({ name: 1}) // TODO: Uncomment when Level collection is populated

    const newUser = new User({
      name: req.body.name,
      device_id: req.body.device_id,
      // level_id: level._id, // TODO: Uncomment when Level collection is populated
      is_setup_complete: req.body.is_setup_complete,
      preferred_mode: req.body.preferred_mode,
    });

    const response = await newUser.save();
    res.status(201).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

export default { createUser };
