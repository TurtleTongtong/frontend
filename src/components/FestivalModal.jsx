// src/components/Modal.jsx
import React from 'react';
import '../styles/festival-modal.css';

const Modal = ({ isOpen, onClose, festival }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        {festival && (
          <div className="modal-body modal-body--container">
            <h2 className="modal-title">{festival.title}</h2>

            {/* 이미지 영역 */}
            <div className="modal-image-wrap">
              <img
                src={festival.imageMain}
                alt={festival.title}
                className="modal-main-image"
              />
            </div>

            {/* 소개 문단 */}
            <p className="modal-description">{festival.description}</p>

            {/* 2x2 정보 카드 그리드 */}
            <div className="modal-info-grid">
              <div className="info-card">
                <div className="info-card-title">축제 기간</div>
                <div className="info-card-body">{festival.date}</div>
              </div>

              <div className="info-card">
                <div className="info-card-title">위치</div>
                <div className="info-card-body">{festival.place}</div>
              </div>

              <div className="info-card">
                <div className="info-card-title">예상 참여 인원</div>
                <div className="info-card-body">약 50,000명</div>
              </div>

              <div className="info-card info-card--discount">
                <div className="info-card-title">할인 정보</div>
                <div className="info-card-body">
                  {festival.discountBadge || '없음'}
                </div>
              </div>
            </div>

            {/* 특별 이벤트 박스 */}
            {festival.highlight && (
              <div className="modal-special-event">
                <div className="special-event-title">🎉 특별 이벤트</div>
                <div className="special-event-body">{festival.highlight}</div>
              </div>
            )}

            {/* 주요 프로그램 */}
            <div className="modal-section">
              <h4 className="modal-section-title">주요 프로그램</h4>
              <div className="modal-program-chips">
                {festival.benefits.map((b) => (
                  <span key={b} className="modal-chip">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="modal-cta-wrap">
              <button className="modal-cta">이 축제 예약하러 가기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;