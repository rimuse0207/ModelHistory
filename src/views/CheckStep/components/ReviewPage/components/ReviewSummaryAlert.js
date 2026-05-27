import React from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { StatusAlert } from "../../styles/ReviewPage.style";

export function ReviewSummaryAlert({ missingCount, totalErrorCount }) {
  if (missingCount > 0) {
    return (
      <StatusAlert $isWarning={true}>
        <FiAlertTriangle size={20} style={{ minWidth: "20px" }} />
        <span>
          작성하지 않았거나 입력값이 누락된 항목이 총{" "}
          <strong>{missingCount}개</strong> 있습니다. 수정 버튼을 눌러 보완해
          주세요.
        </span>
      </StatusAlert>
    );
  }

  if (totalErrorCount > 0) {
    return (
      <StatusAlert
        $isWarning={true}
        style={{
          backgroundColor: "#fef2f2",
          borderColor: "#fee2e2",
          color: "#991b1b",
        }}
      >
        <FiAlertTriangle size={20} style={{ minWidth: "20px" }} />
        <span>
          측정치가 비정상적이거나 스펙을 초과한 항목이 총{" "}
          <strong>{totalErrorCount}개</strong> 감지되었습니다. 데이터를 다시
          한번 확인해 주십시오.
        </span>
      </StatusAlert>
    );
  }

  return (
    <StatusAlert $isWarning={false}>
      <FiCheckCircle size={20} style={{ minWidth: "20px" }} />
      <span>
        모든 필수 항목이 누락 없이 정상 규격 내부로 정상 입력되었습니다.
      </span>
    </StatusAlert>
  );
}
