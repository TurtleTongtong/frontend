// src/pages/FestivalPage.jsx
import Header from "../components/Header";

const HERO_PASS_BUTTON_LABEL = "패스 구매하기";

const FESTIVALS = [
  {
    id: 1,
    title: "시흥 거북섬 썸머나잇 페스티벌",
    date: "2024년 8월 23일(금) - 2024년 8월 24일(토)",
    place: "거북섬 일대 해변공원",
    tagline: "거북섬의 시원한 바닷바람과 함께 즐기는 한여름 밤의 축제!",
    description:
      "거북섬의 시원한 바닷바람과 함께 즐기는 한여름 밤의 축제!\n라이브 공연, 물빛 라이트쇼, 푸드트럭까지 다양한 즐길 거리가 마련된 대표 여름 야간 페스티벌입니다.",
    highlight: "인근 바다 전망과 함께 즐기는 여름 라이트쇼!",
    benefits: ["라이브 버스킹", "물빛 라이트쇼", "푸드트럭 페어"],
    discountBadge: "패스권 소지자 20% 할인",
    imageMain:
      "https://www.figma.com/api/mcp/asset/e61dd276-68bf-4938-9415-cedcfb41db76",
    imageOverlay:
      "https://www.figma.com/api/mcp/asset/6573653e-73e7-49db-9e9e-f0140404caf6",
  },
  {
    id: 2,
    title: "시흥 거북섬 썸머나잇 페스티벌",
    date: "2024년 8월 23일(금) - 2024년 8월 24일(토)",
    place: "거북섬 일대 해변공원",
    tagline: "거북섬의 시원한 바닷바람과 함께 즐기는 한여름 밤의 축제!",
    description:
      "거북섬의 시원한 바닷바람과 함께 즐기는 한여름 밤의 축제!\n라이브 공연, 물빛 라이트쇼, 푸드트럭까지 다양한 즐길 거리가 마련된 대표 여름 야간 페스티벌입니다.",
    highlight: "인근 바다 전망과 함께 즐기는 여름 라이트쇼!",
    benefits: ["라이브 버스킹", "물빛 라이트쇼", "푸드트럭 페어"],
    discountBadge: null, // 두 번째 카드는 배지 없음 (Figma 기준)
    imageMain:
      "https://www.figma.com/api/mcp/asset/e61dd276-68bf-4938-9415-cedcfb41db76",
    imageOverlay:
      "https://www.figma.com/api/mcp/asset/6573653e-73e7-49db-9e9e-f0140404caf6",
  },
];

export default function FestivalPage() {
  return (
    <div className="tc-root">
      <Header />
      <main className="tc-main tc-main--fullwidth">
        <FestivalHero />
        <FestivalContent />
      </main>
    </div>
  );
}

function FestivalHero() {
  return (
    <section className="tc-festival-hero">
      <div className="tc-festival-hero__inner">
        <div className="tc-festival-hero__text">
          <h1 className="tc-festival-hero__title">거북섬 패스</h1>
          <p className="tc-festival-hero__subtitle">
            축제부터 명소까지, 거북섬을 자유롭게!
          </p>
          <p className="tc-festival-hero__description">
            여행 비용은 줄이고 즐거움은 두 배로!
          </p>
        </div>
        <button className="tc-festival-hero__button">
          {HERO_PASS_BUTTON_LABEL}
        </button>
      </div>
    </section>
  );
}

function FestivalContent() {
  return (
    <section className="tc-festival">
      <div className="tc-festival__tabs">
        <button className="tc-festival__tab tc-festival__tab--active">
          축제
        </button>
        <button className="tc-festival__tab">관광지</button>
      </div>

      <header className="tc-festival__header">
        <h2 className="tc-festival__heading">거북섬 축제</h2>
        <p className="tc-festival__subheading">
          거북섬에서 열리는 다양한 축제를 경험해보세요
        </p>
      </header>

      <div className="tc-festival__list">
        {FESTIVALS.map((festival) => (
          <FestivalCard key={festival.id} festival={festival} />
        ))}
      </div>
    </section>
  );
}

function FestivalCard({ festival }) {
  return (
    <article className="tc-festival-card">
      <div className="tc-festival-card__image-wrap">
        <img
          src={festival.imageMain}
          alt={festival.title}
          className="tc-festival-card__image tc-festival-card__image--base"
        />
        <img
          src={festival.imageOverlay}
          alt=""
          className="tc-festival-card__image tc-festival-card__image--overlay"
        />
        {festival.discountBadge && (
          <div className="tc-festival-card__badge">
            {festival.discountBadge}
          </div>
        )}
      </div>

      <div className="tc-festival-card__body">
        <h3 className="tc-festival-card__title">{festival.title}</h3>
        <p className="tc-festival-card__tagline">{festival.tagline}</p>

        <div className="tc-festival-card__meta">
          <div className="tc-festival-card__meta-row">
            <span className="tc-festival-card__meta-label">행사 일정</span>
            <span className="tc-festival-card__meta-value">
              {festival.date}
            </span>
          </div>
          <div className="tc-festival-card__meta-row">
            <span className="tc-festival-card__meta-label">장소</span>
            <span className="tc-festival-card__meta-value">
              {festival.place}
            </span>
          </div>
        </div>

        <div className="tc-festival-card__highlight">
          {festival.highlight}
        </div>

        <div className="tc-festival-card__program">
          <h4 className="tc-festival-card__program-title">주요 프로그램</h4>
          <div className="tc-festival-card__program-chips">
            {festival.benefits.map((b) => (
              <span key={b} className="tc-festival-card__chip">
                {b}
              </span>
            ))}
          </div>
        </div>

        <button className="tc-festival-card__button">
          이 축제 정보 보러가기
        </button>
      </div>
    </article>
  );
}
