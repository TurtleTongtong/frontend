import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRequests, getMyProfile, cancelTourRequest } from "../../api/tourApi";
import Header from "../../components/Header";
import "../../styles/UserMyPage.css";

const LOCATION_ID_MAP = {
  1: "강남역",
  2: "서울역",
  3: "정왕역",
  4: "시흥시청"
};

export default function UserMyPage() {
  const [userInfo, setUserInfo] = useState(null); // 내 정보 상태

  useEffect(() => {
    // 페이지 들어오면 내 정보 가져오기
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setUserInfo(data); // 가져온 정보 저장
      } catch (error) {
        console.log("프로필 정보를 못 가져왔어요");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="mypage-wrapper">
      <Header />
      
      <main className="mypage-container">

        {/* 가져온 userinfo를 프로필 섹션에 전달 */}
        <ProfileSection user={userInfo} />

        {/* 2. 관심사 */}
        <InterestSection />

        {/* 3. 비밀번호 변경 */}
        <PasswordSection />

        {/* 4. 내 견적 확인 (카드 리스트) */}
        <EstimateListSection />

        {/* 5. 확정된 여행 (상세 정보) */}
        <ConfirmedTripSection />
      </main>
    </div>
  );
}

/* --- 하위 컴포넌트들 --- */

function EstimateListSection() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null); // 에러 메시지 상태 추가

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // 1. API 호출
        const response = await getMyRequests();
        console.log("📢 서버 응답 원본:", response); // F12 콘솔에서 구조 확인용

        // 2. 데이터 꺼내기 (방어 코드)
        // 만약 response 자체가 배열이면 그대로 쓰고, response.data가 배열이면 그걸 씁니다.
        let listData = [];
        if (Array.isArray(response)) {
          listData = response;
        } else if (response && Array.isArray(response.data)) {
          listData = response.data;
        } else if (response && Array.isArray(response.result)) {
           listData = response.result;
        } else {
          console.error("데이터가 배열 형태가 아닙니다!", response);
          listData = []; // 빈 배열로 초기화
        }

        // 3. 데이터 가공
        const formattedData = listData
        .filter((item) => item.status !== "CANCELED")
        .map((item) => {
          let dateDisplay = item.startDate;
          if (item.startDate && item.endDate && item.startDate !== item.endDate) {
            dateDisplay = `${item.startDate} ~ ${item.endDate}`;
          }

          // locationId가 없으면 location_id(스네이크 케이스)도 찾아봄
          const locId = item.locationId || item.location_id; 
          const locName = item.locationName || LOCATION_ID_MAP[locId] || "(탑승지)";

          const timeStr = item.pickupTime ? item.pickupTime.substring(11, 16) : "00:00 (미정)";
          const isWaiting = item.status === "WAITING";

          return {
            id: item.id,
            title: locName, 
            date: dateDisplay || "날짜 미정",
            people: item.participantCount || 0,
            pickup: `${timeStr}`,
            statusBadge: isWaiting ? "매칭 대기중" : "견적 도착",
            statusColor: isWaiting ? "gray" : "blue",
            btnText: isWaiting ? "견적 대기중" : "견적 보러가기",
            btnActive: !isWaiting,
            img: "https://placehold.co/389x200?text=Turtle+Connect"
          };
        })
        // ID 기준 내림차순 정렬 (최신순)
        .sort((a, b) => b.id - a.id);

        setCards(formattedData);

      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setErrorMsg("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyData();
  }, []);

  // 삭제 핸들러
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("정말 이 견적 요청을 삭제하시겠습니까?")) return;
    try {
      await cancelTourRequest(id);
      setCards((prevCards) => prevCards.filter((card) => card.id !== id));
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="mp-card">
      <div className="mp-header row-between">
        <div>
          <h2>내 견적 확인</h2>
          <p className="sub-text">신청한 여행 견적 현황입니다.</p>
        </div>
        <button className="btn-more-link" onClick={() => navigate("/estimates")}>
          더 보기 <span className="arrow">›</span>
        </button>
      </div>
      
      {/* 상태별 화면 처리 */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>⏳ 로딩 중...</div>
      ) : errorMsg ? (
        <div style={{ padding: "40px", textAlign: "center", color: "red" }}>{errorMsg}</div>
      ) : cards.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
          아직 신청한 견적이 없습니다. <br />
          메인 화면에서 여행을 떠나보세요!
        </div>
      ) : (
        <div className="card-grid">
          {cards.slice(0, 3).map((card) => (
            <div key={card.id} className="trip-card">
              <div className="card-img-area">
                <img src={card.img} alt={card.title} />
                <span className="location-tag">거북섬</span>
              </div>

              <div className="card-body">
                <div className="card-title-row">
                  <h3>{card.title}</h3>
                  <button 
                    className="btn-delete" 
                    onClick={(e) => handleDelete(e, card.id)}
                    title="삭제"
                  >
                    🗑️
                  </button>
                </div>

                <div className="card-meta">
                  <p>📅 {card.date}</p>
                  <p>👤 {card.people}명</p>
                  <p>📍 출발: {card.pickup}</p>
                </div>
                
                <div className={`status-badge ${card.statusColor}`}>
                  {card.statusBadge}
                </div>

                <button 
                  className={`card-btn ${card.btnActive ? 'active' : 'disabled'}`}
                  onClick={() => {
                    if (card.btnActive) {
                      navigate("/quote-detail", { state: { tripInfo: card } });
                    }
                  }}
                >
                  {card.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// --- (나머지 컴포넌트는 변경사항 없음) ---



function ProfileSection({ user }) {
  
  // 데이터가 아직 안 왔으면 로딩 중 표시 or 기본값
  const name = user?.name || "로딩 중...";
  const email = user?.email || "-";
  // 프로필 이미지 (없으면 기본 이미지)
  const profileImg = user?.profileImage || "https://placehold.co/84x84";

  return (
    <section className="mp-card">
      <div className="mp-header">
        <h2>프로필 관리</h2>
      </div>
      <div className="profile-body">
        <img src="https://placehold.co/84x84" alt="유저" className="profile-img" />
        <div className="profile-info">
          <div className="info-group">
            <span className="label">이름</span>
            <div className="value-row">
              <span className="value">{name}</span>
              <button className="btn-outline-xs">수정</button>
            </div>
          </div>
          <div className="info-group">
            <span className="label">이메일</span>
            <span className="value">{email}</span>
          </div>
        </div>
        <div className="profile-actions">
           <span className="text-link-danger">회원탈퇴</span>
           <button className="btn-solid-sm">사진 변경</button>
        </div>
      </div>
    </section>
  );
}

function InterestSection() {
  const [tags] = useState(["자연경관", "문화체험", "맛집탐방"]);
  return (
    <section className="mp-card">
      <div className="mp-header">
        <h2>관심사</h2>
        <p className="sub-text">여행 취향에 맞는 콘텐츠를 추천해드립니다</p>
      </div>
      <div className="tag-list">
        {tags.map((tag, i) => (
          <div key={i} className="tag-item">{tag} <span className="close">×</span></div>
        ))}
        <button className="tag-add-btn">+ 추가하기</button>
      </div>
    </section>
  );
}

function PasswordSection() {
  return (
    <section className="mp-card row-between">
      <div>
        <h2>비밀번호 변경</h2>
        <p className="sub-text">계정 보안을 위해 주기적으로 비밀번호를 변경해주세요</p>
      </div>
      <button className="btn-outline-md">비밀번호 변경</button>
    </section>
  );
}

function ConfirmedTripSection() {
  return (
    <section className="mp-card">
      <div className="mp-header">
        <h2>확정된 여행</h2>
        <p className="sub-text">매칭이 확정된 여행 일정입니다</p>
      </div>
      <div className="confirmed-box">
        <div className="trip-summary">
          <img src="https://placehold.co/120x120" alt="여행지" className="trip-thumb" />
          <div className="trip-info">
             <span className="tag-sm">거북섬</span>
             <h3>서울역</h3>
             <div className="meta-text">
               <span>2025년 12월 01일</span> | <span>오전 9:00 출발</span> | <span>2명</span>
             </div>
          </div>
          <div className="trip-price">
            <div className="price-row"><span>총 금액</span><strong>₩20,000</strong></div>
            <div className="price-row"><span>1인당 금액</span><strong>₩10,000</strong></div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="info-grid">
          <div className="info-panel gray">
             <div className="panel-title"><span className="icon-box blue-border">📄</span> 입금 정보</div>
             <div className="info-row"><span>입금 계좌</span> <span>기업은행 123-456-789012</span></div>
             <div className="info-row"><span>예금주</span> <span className="align-right">거북섬 여행사</span></div>
             <div className="info-row"><span>입금 상태</span> <span className="badge-complete">완료</span></div>
             <div className="info-row"><span>입금일</span> <span>2025년 11월 24일</span></div>
          </div>
          <div className="info-panel cyan">
             <div className="panel-title"><span className="icon-box blue-border">📞</span> 여행사 연락처</div>
             <div className="info-row"><span>여행사명</span> <span className="align-right">거북섬 여행사</span></div>
             <div className="info-row"><span>전화번호</span> <span>010-9876-5432</span></div>
             <div className="info-row"><span>이메일</span> <span>info@turtle.com</span></div>
             <div className="info-row"><span>담당자</span> <span>김여행 (010-9876-5432)</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}