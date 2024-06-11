import PostureRecord from "../models/PostureRecord.js";

export const createPostureRecord = async (req, res) => {
  try {
    const createObject = ({
      user_id,
      good_posture,
      session_id,
      recorded_at,
    }) => {
      return new PostureRecord({
        user_id, //TODO: get this user_id from the token
        good_posture: good_posture ?? false,
        session_id: session_id ?? undefined,
        recorded_at: new Date(recorded_at),
      });
    };

    // INSERT MANY
    if (Array.isArray(req?.body)) {
      const records = req.body.map((data) => {
        return createObject(data);
      });

      const data = await PostureRecord.insertMany(records);
      res.status(201).json({
        data,
        error: null,
      });
      return;
    }

    // INSERT ONE
    const data = await createObject(req?.body).save();

    res.status(201).json({
      data,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error: JSON.stringify(error),
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // Optional filters
    const user_id = req?.query?.user_id;
    const good_posture = req?.query?.good_posture;
    const session_id = req?.query?.session_id;
    const start_date = req?.query?.start_date;
    const end_date = req?.query?.end_date;

    const data = await PostureRecord.find({
      ...(user_id !== undefined ? { user_id } : {}),
      ...(good_posture !== undefined ? { good_posture } : {}),
      ...(session_id !== undefined ? { session_id } : {}),
      ...(start_date !== undefined
        ? {
            recorded_at: {
              $gte: new Date(start_date),
            },
          }
        : {}),
      ...(end_date !== undefined
        ? {
            recorded_at: {
              $lte: new Date(end_date),
            },
          }
        : {}),
    }).exec();

    res.status(200).json({
      data,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await PostureRecord.findById(req?.params?.id).exec();

    res.status(200).json({
      data,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error,
    });
  }
};

export default {
  createPostureRecord,
  getAll,
  getById,
};
