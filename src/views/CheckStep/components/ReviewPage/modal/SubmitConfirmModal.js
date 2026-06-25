import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
  FiCheckSquare,
  FiUser,
  FiCalendar,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import {
  ActionButton,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  ModalContent,
  FormGroup,
  FormRow,
  ModalFooter,
} from "../../styles/ReviewPage.style";
import { useUserList } from "../../../../../hooks/useUserList";

export function SubmitConfirmModal({ isOpen, onClose, onSubmit }) {
  const { userLists } = useUserList();

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  // 30분 단위 타임 리스트 생성 (00:00 ~ 23:30)
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hh = String(Math.floor(i / 2)).padStart(2, "0");
    const mm = i % 2 === 0 ? "00" : "30";
    return `${hh}:${mm}`;
  });

  const getCurrentTimeStr = () => {
    const now = new Date();
    const mm = now.getMinutes() < 30 ? "00" : "30";
    return `${String(now.getHours()).padStart(2, "0")}:${mm}`;
  };

  const [workDate, setWorkDate] = useState(getTodayDate());
  const [workTime, setWorkTime] = useState(getCurrentTimeStr()); // 문자열로 다이렉트 관리
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [summaryComments, setSummaryComments] = useState("");

  const timeSelectRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setWorkDate(getTodayDate());
      const curTime = getCurrentTimeStr();
      setWorkTime(curTime);

      setTimeout(() => {
        if (timeSelectRef.current) {
          const selectEl = timeSelectRef.current;
          const selectedOption = selectEl.options[selectEl.selectedIndex];
          if (
            selectedOption &&
            typeof selectedOption.scrollIntoView === "function"
          ) {
            selectedOption.scrollIntoView({
              block: "center",
              behavior: "auto",
            });
          }
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmSubmit = () => {
    if (!workDate) return alert("작업 일자를 선택해 주세요.");
    if (!workTime) return alert("작업 시간을 선택해 주세요.");
    if (!selectedWorker) return alert("작업자를 선택해 주세요.");

    const workerOption =
      userLists.find((u) => u.value === selectedWorker?.value) ||
      selectedWorker;

    onSubmit({
      workDate,
      workTime,
      worker: workerOption.value,
      workerName: workerOption.label,
      summaryComments,
    });
  };

  const workerSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "8px",
      borderColor: state.isFocused ? "#3b82f6" : "#cbd5e1",
      padding: "2px",
      fontSize: "14px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
          ? "#eff6ff"
          : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#0f172a",
      fontSize: "14px",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 10000 }),
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBody onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>
            <FiCheckSquare style={{ color: "#3b82f6" }} /> 점검 이력 최종 등록
          </h3>
          <p>세부적인 내용 및 작업 일자 데이터를 입력해 주세요.</p>
        </ModalHeader>

        <ModalContent>
          <FormRow>
            <FormGroup>
              <label>
                <FiCalendar /> 작업 일자
              </label>
              <input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <label>
                <FiClock /> 작업 시간 (30분 단위)
              </label>

              <select
                ref={timeSelectRef}
                value={workTime}
                onChange={(e) => setWorkTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  color: "#0f172a",
                  backgroundColor: "#ffffff",
                  outline: "none",
                  cursor: "pointer",
                  WebkitAppearance: "none", // 기본 화살표 제거 후 세련되게 마감
                  MozAppearance: "none",
                  appearance: "none",
                  background:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>\") no-repeat right 12px center/16px",
                }}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <label>
              <FiUser /> 담당 작업자
            </label>
            <Select
              options={userLists}
              value={selectedWorker}
              onChange={(opt) => setSelectedWorker(opt)}
              placeholder="점검 조치자를 선택하세요..."
              styles={workerSelectStyles}
              isSearchable={true}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
          </FormGroup>

          <FormGroup>
            <label>
              <FiFileText /> 결과 확인 및 특이사항 내용
            </label>
            <textarea
              value={summaryComments}
              onChange={(e) => setSummaryComments(e.target.value)}
              placeholder="특이사항이나 최종 종합 판정 결과를 작성하세요..."
            />
          </FormGroup>
        </ModalContent>

        <ModalFooter>
          <ActionButton
            onClick={onClose}
            style={{ backgroundColor: "#e2e8f0", color: "#475569" }}
          >
            취소
          </ActionButton>
          <ActionButton $primary onClick={handleConfirmSubmit}>
            제출 및 저장완료
          </ActionButton>
        </ModalFooter>
      </ModalBody>
    </ModalOverlay>
  );
}
