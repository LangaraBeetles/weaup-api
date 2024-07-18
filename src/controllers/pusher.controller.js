import pusher from "../models/pusher.js";

/**
 *
 * @param {string} user_id
 * @param {} data
 */
export const sendMessage = (user_id, data) => {
  pusher.trigger(user_id, "message", data);
};
