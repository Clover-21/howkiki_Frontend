import React, { useState, useEffect } from "react";
import axios from "axios";
import back from "../../assets/icon/back.svg";
import {
  ModalContainer,
  Modal,
  ModalContent,
  ModalText,
  TimeBoxWrap,
  TimeBox,
  TimeInput,
  FinishBtn,
  BackButton,
} from "../../styles/components/acceptModal.module";

const API_URL = process.env.REACT_APP_API_URL;

const host = window.location.hostname === "localhost" ? API_URL : "api";

export const apiClient = axios.create({
  baseURL: host,
});

export default function AcceptModal({
  isOpen,
  onClose,
  currentStep,
  onNext,
  onBack,
  selectedOrder,
  setOrderData,
}) {
  const [time, setTime] = useState("");

  const handleInputChange = (e) => {
    setTime(e.target.value);
  };

  const handleFinishClick = () => {
    if (time) {
      handleAccept(time);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && time) {
      handleAccept(time);
    }
  };

  const handleAccept = async (expectedPrepMin) => {
    try {
      await apiClient.patch(
        `/stores/1/orders/${selectedOrder.orderId}/order-acceptance`,
        { expectedPrepMin }
      );

      setOrderData((prevData) => {
        const updatedOrders = prevData.data.filter(
          (order) => order.orderId !== selectedOrder.orderId
        );
        return { ...prevData, data: updatedOrders };
      });

      onClose();
    } catch (error) {
      console.error("상태 업데이트 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setTime("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalContainer onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          {currentStep === 1 && (
            <>
              <ModalText>준비 예상 시간을 선택해주세요.</ModalText>
              <TimeBoxWrap>
                <TimeBox onClick={() => handleAccept("5")}>5분</TimeBox>
                <TimeBox onClick={() => handleAccept("10")}>10분</TimeBox>
              </TimeBoxWrap>
              <TimeBoxWrap>
                <TimeBox onClick={() => handleAccept("15")}>15분</TimeBox>
                <TimeBox onClick={onNext}>기타</TimeBox>
              </TimeBoxWrap>
            </>
          )}
          {currentStep === 2 && (
            <>
              <BackButton src={back} onClick={onBack} />
              <ModalText>준비 예상 시간을 입력해주세요.</ModalText>
              <TimeInput
                value={time}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
              />
              <FinishBtn onClick={handleFinishClick} disabled={!time}>
                완료
              </FinishBtn>
            </>
          )}
        </ModalContent>
      </Modal>
    </ModalContainer>
  );
}
