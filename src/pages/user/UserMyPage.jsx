import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRequests } from "../../api/tourApi";
import "../../styles/UserMyPage.css";
import logoTurtle from "../../assets/logo-turtle.png"; 

export default function UserMyPage() {
  return (
    <div className="mypage-wrapper">
      <MyPageHeader />
      
      <main className="mypage-container">
        {/* 1. 프로필 관리 */}
        <ProfileSection />

        {/* 2. 관심사 */}
        <InterestSection />

        {/* 3. 비밀번호 변경 */}
        <PasswordSection />

        {/* 4. 내 견적 확인 (카드 리스트) - ★API 연동 및 데이터 매핑 수정됨★ */}
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

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        // 1. API 호출 (GET /api/tour-requests/me)
        const serverData = await getMyRequests(); 
        
        // 2. 데이터 가공 (Swagger 명세 -> 화면용 데이터)
        const formattedData = serverData.map((item) => {
          
          // (1) 픽업 시간 예쁘게 만들기 (2025-11-29T21:43... -> 11월 29일 21시 43분)
          let pickupDisplay = "시간 미정";
          if (item.pickupTime) {
            const dateObj = new Date(item.pickupTime);
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            const hour = dateObj.getHours();
            const minute = dateObj.getMinutes();
            // 분이 0~9분일 때 앞에 0 붙이기 (예: 05분)
            const minuteStr = minute < 10 ? `0${minute}` : minute;
            
            pickupDisplay = `${month}월 ${day}일 ${hour}시 ${minuteStr}분`;
          }

          // (2) 상태값(status)에 따른 화면 처리
          // WAITING이면 대기중(회색), 그 외에는 견적 도착(파란색)으로 가정
          const isWaiting = item.status === "WAITING";

          return {
            // 화면 변수 : API 명세 변수
            id: item.id,
            title: item.locationName, // locationName -> title
            date: `${item.startDate} ~ ${item.endDate}`, //시작일~종료일 합치기
            people: item.participantCount, // participantCount -> people
            pickup: pickupDisplay, // 위에서 가공한 시간 사용
            
            // 상태에 따른 뱃지 & 버튼 설정
            statusBadge: isWaiting ? "매칭 대기중" : "견적 도착",
            statusColor: isWaiting ? "gray" : "blue",
            btnText: isWaiting ? "견적 대기중" : "견적 보러가기",
            btnActive: !isWaiting, // 대기중이 아닐 때만 버튼 활성화
            
            // 이미지는 서버 데이터에 없으므로 임시 이미지 사용
            img: "https://placehold.co/389x200" 
          };
        });

        setCards(formattedData);

      } catch (error) {
        console.log("데이터 로딩 실패, 임시 데이터를 보여줍니다.");
        // 에러 시 보여줄 가짜 데이터 (테스트용)
        setCards([
          {
            id: 999,
            title: "서울역 (403 더미)",
            date: "2025-12-01 ~ 2025-12-05",
            people: 4,
            pickup: "12월 1일 09시 00분",
            statusBadge: "견적 도착",
            statusColor: "blue",
            btnText: "견적 보러가기",
            btnActive: true,
            img: "https://placehold.co/389x200"
          }
        ]);
      }
    };

    fetchMyData();
  }, []);

  return (
    <section className="mp-card">
      <div className="mp-header row-between">
        <div>
          <h2>내 견적 확인</h2>
          <p className="sub-text">맞춤형 여행 견적을 확인하세요</p>
        </div>
        
        {/* 더 보기 버튼: 전체 리스트 페이지로 이동 */}
        <button 
          className="btn-more-link" 
          onClick={() => navigate("/estimates")}
        >
          더 보기 <span className="arrow">›</span>
        </button>
      </div>
      
      {cards.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
          신청한 내역이 없거나 데이터를 불러오는 중입니다.
        </div>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <div key={card.id} className="trip-card">
              <div className="card-img-area">
                <img src={card.img} alt={card.title} />
                <span className="location-tag">거북섬</span>
              </div>
              <div className="card-body">
                <h3>{card.title}</h3>
                <div className="card-meta">
                  <p>📅 {card.date}</p>
                  <p>👤 {card.people}명</p>
                  <p>📍 픽업: {card.pickup}</p>
                </div>
                
                <div className={`status-badge ${card.statusColor}`}>
                  {card.statusBadge}
                </div>

                {/* 카드 버튼: 활성화 상태일 때만 상세 페이지로 이동하며 데이터 전달 */}
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

function MyPageHeader() {
  const navigate = useNavigate();
  return (
    <header className="tc-header">
      <div className="tc-header__left" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <img src={logoTurtle} alt="로고" className="tc-header__logo-icon" />
        <div className="tc-header__logo-text">
          <div className="tc-header__logo-title">거북섬 커넥트</div>
          <div className="tc-header__logo-sub">Turtle Connect</div>
        </div>
      </div>
      <nav className="tc-header__nav">
        <button onClick={() => navigate("/")}>홈</button>
        <button>축제 & 관광지</button>
      </nav>
      <div className="tc-header__right">
        <div className="user-status">
          <span className="active-text">마이페이지</span>
          <img src="https://placehold.co/40x40" alt="프로필" className="header-avatar"/>
        </div>
        <button className="btn-logout" onClick={() => navigate("/")}>로그아웃</button>
      </div>
    </header>
  );
}

function ProfileSection() {
  return (
    <section className="mp-card">
      <div className="mp-header">
        <h2>프로필 관리</h2>
      </div>
      <div className="profile-body">
        <img src="https://placehold.co/84x84" alt="유저" className="profile-img" />
        <div className="profile-info">
          <div className="info-group">
            <span className="label">닉네임</span>
            <div className="value-row">
              <span className="value">최성현</span>
              <button className="btn-outline-xs">수정</button>
            </div>
          </div>
          <div className="info-group">
            <span className="label">이메일</span>
            <span className="value">1233day@naver.com</span>
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