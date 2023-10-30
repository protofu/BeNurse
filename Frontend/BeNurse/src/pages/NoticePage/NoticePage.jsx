import React from "react";
import { Link } from "react-router-dom";
import Container from "../../components/atoms/Container/Container";

import * as S from "./NoticePage.styles";

import { BsFillPersonFill } from "react-icons/bs";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function NoticePage() {
  const handleNoticeClick = (key) => {
    const selectedNotice = document.querySelectorAll(".notice")[key - 1];
    if (selectedNotice.classList.contains("active")) {
      selectedNotice.classList.remove("active");
    } else {
      selectedNotice.classList.add("active");
    }
  };

  return (
    <Container>
      <S.MainContainer>
        <S.NoticeLable onClick={() => handleNoticeClick(1)}>
          <div className="notice">
            <div className="notice_header">
              <p className="notice_title">
                [공지] 코로나19 예방을 위한 접종 안내
              </p>
              <MdKeyboardArrowRight className="arrow_icon" />
            </div>

            <div className="notice_bottom">
              <div className="notice_content">
                다가오는 응급처치 교육에 대한 신청이 시작되었습니다. 교육 일정과
                신청 방법에 대한 자세한 내용은 회사 홈페이지에서 확인해주세요.
                😄😄
              </div>
              <div className="notice_info">
                <p className="notice_date">2023.10.18</p>
                <div>
                  <p className="notice_writer">1병동 2병실 김간호사</p>
                  <BsFillPersonFill />
                </div>
              </div>
            </div>
          </div>
        </S.NoticeLable>
        <S.NoticeLable onClick={() => handleNoticeClick(2)}>
          <div className="notice">
            <div className="notice_header">
              <p className="notice_title">
                [공지] 코로나19 예방을 위한 접종 안내
              </p>
              <MdKeyboardArrowRight className="arrow_icon" />
            </div>

            <div className="notice_bottom">
              <div className="notice_content">
                아무튼 엄청 긴 문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청
                긴 문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.아무튼 엄청 긴
                문장입니다.아무튼 엄청 긴 문장입니다.
              </div>
              <div className="notice_info">
                <p className="notice_date">2023.10.18</p>
                <div>
                  <p className="notice_writer">1병동 2병실 김간호사</p>
                  <BsFillPersonFill />
                </div>
              </div>
            </div>
          </div>
        </S.NoticeLable>
        <S.NoticeLable onClick={() => handleNoticeClick(3)}>
          <div className="notice">
            <div className="notice_header">
              <p className="notice_title">
                [공지] 코로나19 예방을 위한 접종 안내
              </p>
              <MdKeyboardArrowRight className="arrow_icon" />
            </div>

            <div className="notice_bottom">
              <div className="notice_content">멍멍</div>
              <div className="notice_info">
                <p className="notice_date">2023.10.18</p>
                <div>
                  <p className="notice_writer">1병동 2병실 김간호사</p>
                  <BsFillPersonFill />
                </div>
              </div>
            </div>
          </div>
        </S.NoticeLable>
      </S.MainContainer>
    </Container>
  );
}
