import axios from "axios";

export const userAvatar = [
  "blue1",
  "blue2",
  "yellow1",
  "yellow2",
  "red1",
  "red2",
  "gray1",
];

export const getGoogleUser = async (token) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
