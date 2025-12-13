// src/pages/agency/SentDispatchDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import "../../styles/sent-dispatch-detail.css";
import { getRouteDetail } from "../../api/agencyApi";

// "2025-01-02T04:16:00" -> "04:16"
function toHHmm(iso) {
  if (!iso) return "--:--";
  return iso.length >= 16 ? iso.slice(11, 16) : "--:--";
}

// 응답(route detail)을 기존 레이아웃에서 쓰는 화면 모델로 매핑
function mapDetailToView(routeDetail) {
  const date = routeDetail?.date ?? "";
  const dateTitle = date ? `${date} 배차 계획 상세` : "배차 계획 상세";
  const description = "사용자가 확정한 여행 정보를 확인할 수 있습니다.";

  const stops = Array.isArray(routeDetail?.stops) ? routeDetail.stops : [];
  const sortedStops = stops
    .slice()
    .sort((a, b) => Number(a?.stopOrder ?? 0) - Number(b?.stopOrder ?? 0));

  // 기존 레이아웃(탑승자/연락처/픽업/시간/인원/상태) 유지
  // 탑승자/연락처는 "-"로 고정, 행은 stops 기반으로 생성
  const passengers = sortedStops.map((s, idx) => ({
    id: `${routeDetail?.routeId ?? "route"}-${s?.stopOrder ?? idx + 1}`,
    name: "-", // 요청사항
    phone: "-", // 요청사항
    pickupLocation: s?.locationName ?? "-",
    pickupTime: toHHmm(s?.pickupTime),
    people: Number(routeDetail?.totalPassengerCount ?? 0), // stop별 인원 정보가 없어서 전체 인원 표시
    status: "확정",
  }));

  const stats = {
    pickupAreaCount: new Set(passengers.map((p) => p.pickupLocation)).size,
    requestCount: passengers.length,
    totalPeople: Number(routeDetail?.totalPassengerCount ?? 0),
  };

  return { dateTitle, description, passengers, stats };
}

function SentDispatchDetail() {
  const navigate = useNavigate();
  const { routeId } = useParams();

  const [detail, setDetail] = useState(null);
  const [activeTab, setActiveTab] = useState("확정");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function fetchDetail() {
      try {
        setLoading(true);
        setError("");

        // 상세보기 진입 시마다 다시 GET /api/agency/routes/{routeId}
        const res = await getRouteDetail(routeId);
        // getRouteDetail이 axios 응답을 그대로 주는 경우/ data만 주는 경우 둘 다 대응
        const routeDetail = res?.data?.data ?? res?.data ?? res;

        if (!routeDetail) throw new Error("상세 데이터가 없습니다.");

        const mapped = mapDetailToView(routeDetail);
        if (alive) setDetail(mapped);
      } catch (e) {
        console.error("getRouteDetail failed:", e);
        if (alive) {
          setError("상세 정보를 불러오지 못했습니다.");
          setDetail(null);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (routeId) fetchDetail();
    else {
      setLoading(false);
      setError("routeId가 없습니다.");
    }

    return () => {
      alive = false;
    };
  }, [routeId]);

  const confirmedList = useMemo(
    () => (detail?.passengers ?? []).filter((p) => p.status === "확정"),
    [detail]
  );

  const unconfirmedList = useMemo(
    () => (detail?.passengers ?? []).filter((p) => p.status !== "확정"),
    [detail]
  );

  const displayedList = activeTab === "확정" ? confirmedList : unconfirmedList;

  return (
    <div className="dispatch-page">
      <Header />
      <main className="dispatch-main detail-main">
        {/* 상단: 돌아가기 / 타이틀 영역 */}
        <div className="detail-header">
          <button
            className="detail-back"
            type="button"
            onClick={() => navigate("/agency-mypage/sent-dispatch")}
          >
            <span className="detail-back-icon">←</span>
            <span className="detail-back-text">목록으로 돌아가기</span>
          </button>

          {error && <div className="error-text">{error}</div>}
          <h2 className="detail-title">{detail?.dateTitle ?? "배차 계획 상세"}</h2>
          <p className="detail-subtitle">{detail?.description ?? ""}</p>
        </div>

        {/* 요약 카드 영역 (기존 레이아웃 유지: 3개) */}
        <section className="detail-summary-section">
          <div className="detail-summary-card">
            <div className="detail-summary-label">픽업 구역</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.stats?.pickupAreaCount ?? 0}개`}
            </div>
          </div>
          <div className="detail-summary-card">
            <div className="detail-summary-label">신청 건수</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.stats?.requestCount ?? 0}건`}
            </div>
          </div>
          <div className="detail-summary-card">
            <div className="detail-summary-label">총 인원</div>
            <div className="detail-summary-value">
              {loading ? "..." : `${detail?.stats?.totalPeople ?? 0}명`}
            </div>
          </div>
        </section>

        {/* 탭 영역: 확정 / 미확정 (기존 레이아웃 유지) */}
        <section className="detail-tab-section">
          <button
            type="button"
            className={activeTab === "확정" ? "detail-tab-btn active" : "detail-tab-btn"}
            onClick={() => setActiveTab("확정")}
          >
            확정
            <span className="detail-tab-count">{confirmedList.length}</span>
          </button>

          <button
            type="button"
            className={activeTab === "미확정" ? "detail-tab-btn active" : "detail-tab-btn"}
            onClick={() => setActiveTab("미확정")}
          >
            미확정
            <span className="detail-tab-count">{unconfirmedList.length}</span>
          </button>
        </section>

        {/* 테이블 영역 (기존 레이아웃 유지) */}
        <section className="detail-table-section">
          <table className="detail-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>연락처</th>
                <th>픽업 위치</th>
                <th>픽업 시간</th>
                <th>인원</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="detail-empty">
                    불러오는 중...
                  </td>
                </tr>
              )}

              {!loading &&
                displayedList.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.phone}</td>
                    <td>{p.pickupLocation}</td>
                    <td>{p.pickupTime}</td>
                    <td>{p.people}</td>
                    <td>
                      <span
                        className={
                          p.status === "확정"
                            ? "status-pill status-confirmed"
                            : "status-pill status-pending"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}

              {!loading && displayedList.length === 0 && (
                <tr>
                  <td colSpan={6} className="detail-empty">
                    표시할 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default SentDispatchDetail;
