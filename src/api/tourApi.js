// src/api/tourApi.js
import api from "./axiosConfig";

// 1. 내 견적 목록 가져오기 (마이페이지용)
export const getMyRequests = async () => {
  try {
    // GET /api/tour-requests/me
    const response = await api.get("/api/tour-requests/me");
    return response.data; // 서버에서 준 리스트 반환
  } catch (error) {
    console.error("내 견적 목록 조회 실패:", error);
    throw error;
  }
};

// 2. 견적 신청하기 (메인페이지용)
export const createTourRequest = async (requestData) => {
  try {
    // POST /api/tour-requests
    const response = await api.post("/api/tour-requests", requestData);
    return response.data;
  } catch (error) {
    console.error("견적 신청 실패:", error);
    throw error;
  }
};

// 3. 예약 취소하기
export const cancelTourRequest = async (id) => {
  try {
    // POST /api/tour-requests/{id}/cancel
    const response = await api.post(`/api/tour-requests/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error("취소 실패:", error);
    throw error;
  }
};

// 4. 내 프로필 정보 가져오기
export const getMyProfile = async () => {
  try {
    // 백엔드 스웨거에서 "내 정보 조회" API 주소를 확인해서 맞춰야 함
    // (예시: /api/members/me 또는 /api/users/me 등)
    const response = await api.get("/api/members/me"); 
    return response.data;
  } catch (error) {
    console.error("내 정보 조회 실패:", error);
    throw error;
  }
};