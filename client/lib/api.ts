import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

export const getSoccerMatches = async () => {
  const res = await api.get("/soccer/stored");
  return res.data.data;
};

export const getNBAGames = async () => {
  const res = await api.get("/nba/live");
  return res.data.data;
};

export const getSoccerAverages = async (teamId: number) => {
  const res = await api.get(`/soccer/averages/${teamId}`);
  return res.data.data;
};

export const getNBAAverages = async (teamId: number) => {
  const res = await api.get(`/nba/averages/${teamId}`);
  return res.data.data;
};
