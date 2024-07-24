import axios from "axios";

export const userBg = [
  "blue1",
  "blue2",
  "yellow1",
  "yellow2",
  "red1",
  "red2",
  "gray1",
];

export const userAvatar = [
  "Image01",
  "Image02",
  "Image03",
  "Image04",
  "Image05",
  "Image06",
  "Image07",
  "Image08",
  "Image09",
  "Image10",
];

export const getGoogleUser = async (token) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/userinfo/v2/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};
