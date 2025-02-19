import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ModalContainer,
  Modal,
  SuggestionContainer,
  BtnContainer,
  FinishBtn,
} from "../../styles/components/suggestionModal.module";

const API_URL = process.env.REACT_APP_API_URL;

const host = window.location.hostname === "localhost" ? API_URL : "api";

export const apiClient = axios.create({
  baseURL: host,
});

export default function PackageModal({ isOpen, onClose, data }) {
  const [sugDetail, setSugDetail] = useState(null);

  useEffect(() => {
    if (!isOpen || !data?.suggestionList?.suggestionId) return;

    const getSuggestion = async () => {
      try {
        const response = await apiClient.get(
          `/stores/1/suggestions/${data.suggestionList.suggestionId}`
        );
        setSugDetail(response.data);
      } catch (error) {
        console.error("테이블 주문 데이터 가져오기 실패:", error);
        setSugDetail(null);
      }
    };
    getSuggestion();
  }, [isOpen, data]);

  if (!isOpen || !sugDetail) return null;

  return (
    <ModalContainer>
      <Modal>
        <SuggestionContainer>{sugDetail?.content}</SuggestionContainer>
        <BtnContainer>
          <FinishBtn onClick={onClose}>닫기</FinishBtn>
        </BtnContainer>
      </Modal>
    </ModalContainer>
  );
}
