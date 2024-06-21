import axios from "axios";

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
