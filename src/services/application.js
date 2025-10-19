import axiosInstance from "../../store/axiosInstance";

export const restartMandate = async (applicationId, reason) => {
  const response = await axiosInstance.post(
    `/admin/applications/${applicationId}/restart-mandate`,
    { reason }
  );
  return response.data;
};
