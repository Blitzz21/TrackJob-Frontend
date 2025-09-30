import api from "./api";

export const addFollowUp = async (followUp: any) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const res = await api.post("/followups", followUp, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getFollowUps = async (jobId: number) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const res = await api.get(`/followups/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
