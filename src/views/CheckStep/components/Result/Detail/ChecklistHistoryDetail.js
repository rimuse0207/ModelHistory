import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Request_Get_Axios } from "../../../../../API";

const ChecklistHistoryDetail = ({ match }) => {
  const submissionId =
    match?.params?.submissionId || window.location.pathname.split("/").pop();

  const [loading, setLoading] = useState(true);
  const [masterInfo, setMasterInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [answers, setAnswers] = useState({});
  const [totalNgCount, setTotalNgCount] = useState(0);
  useEffect(() => {
    if (!submissionId) return;

    async function fetchDetailData() {
      setLoading(true);
      try {
        const detailRes = await Request_Get_Axios(
          `/selectlist/history/detail/${submissionId}`,
        );
        const { master, answers: loadedAnswers } = detailRes.data;
        setMasterInfo(master);
        setAnswers(loadedAnswers);

        let ngCounter = 0;
        Object.values(loadedAnswers).forEach((ans) => {
          ans.values?.forEach((v) => {
            if (v.after_fail === "Y") ngCounter++;
          });
        });
        setTotalNgCount(ngCounter);

        const masterRes = await Request_Get_Axios(
          `/checklist/master/${master.modelNo}/${master.lineNo}`,
        );

        const serverCategories = masterRes.data || [];
        const processedCategories = serverCategories.map((cat) => ({
          ...cat,
          points: cat.points?.map((pt) => {
            // 💡 [규격 통합] fields와 fields_json 유연하게 확보
            let rawFields = pt.fields || pt.fields_json || [];

            if (typeof rawFields === "string") {
              try {
                rawFields = JSON.parse(rawFields);
              } catch (e) {
                rawFields = [];
              }
            }

            // 💡 [정상 복구] 1번째부터 5번째 필드까지 순회하며 정확하게 매핑
            const normalizedFields = Array.isArray(rawFields)
              ? rawFields.map((f) => {
                  // 1. 만약 원본 데이터에 이미 true/false 성격의 showBefore가 있다면 우선 존중
                  if (f.showBefore === true || f.showBefore === false) {
                    return f;
                  }

                  // 2. 🎯 [정답 수정] prev_value가 'N'이나 'n'인 경우에만 '안 보여줌(false)' 처리합니다.
                  // 그 외의 모든 정상적인 스펙 데이터(숫자나 문자 등)는 Before를 보여줍니다(true).
                  const shouldHide =
                    f.prev_value === "N" || f.prev_value === "n";

                  return {
                    ...f,
                    showBefore: !shouldHide,
                  };
                })
              : [];

            return {
              ...pt,
              fields: normalizedFields,
            };
          }),
        }));

        setCategories(processedCategories);
      } catch (err) {
        console.error("상세 조회 오류", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetailData();
  }, [submissionId]);

  if (loading)
    return <LoadingBox>⚠️ 점검 데이터 명세를 분석 중입니다...</LoadingBox>;
  if (!masterInfo)
    return <LoadingBox>❌ 데이터를 찾을 수 없습니다.</LoadingBox>;

  return (
    <WindowWindowContainer>
      <TopControlHeader>
        <div className="left-brand">Model Check SYSTEM | 점검 이력 레포트</div>
        <CloseWindowButton onClick={() => window.close()}>
          창 닫기
        </CloseWindowButton>
      </TopControlHeader>

      <MainDashboardBody>
        <DashboardSummaryGrid>
          <SummaryCard>
            <label>관리 모델명</label>
            <div className="value">{masterInfo.modelNo}</div>
          </SummaryCard>
          <SummaryCard>
            <label>시리얼 넘버</label>
            <div className="value text-blue">Line {masterInfo.lineNo}</div>
          </SummaryCard>
          <SummaryCard>
            <label>최종 검사자</label>
            <div className="value">{masterInfo.writerName}</div>
          </SummaryCard>
          <SummaryCard $isNg={totalNgCount > 0}>
            <label>종합 판정 결과 (After 기준)</label>
            <div className="value">
              {totalNgCount > 0 ? `불량(NG) ${totalNgCount}건` : "정상 (PASS)"}
            </div>
          </SummaryCard>
        </DashboardSummaryGrid>

        <TimeBar>
          <span>
            <b>마스터 등록 ID:</b> #{masterInfo.submissionId}
          </span>
          <span>
            <b>최종 확정 일시:</b>{" "}
            {new Date(masterInfo.completedAt).toLocaleString()}
          </span>
        </TimeBar>

        {categories.map((cat) => (
          <SectionCard key={cat.id}>
            <SectionHeaderTitle>
              카테고리 명세: {cat.category}
            </SectionHeaderTitle>

            {cat.points?.map((point) => {
              const answerKey = `${cat.id}_${point.pointId}`;
              const pointAnswer = answers[answerKey];

              // 💡 [핵심 수정 1] 포인트 내 필드 중 '하나라도' Before 데이터가 유효한지 검사하여 일체화시킵니다.
              const pointHasBefore = point.fields?.some((field, fIdx) => {
                const cell = pointAnswer?.values?.[fIdx];
                return cell && typeof cell.showBefore !== "undefined"
                  ? cell.showBefore
                  : field.showBefore;
              });

              return (
                <PointGroupBlock key={point.pointId}>
                  <PointHeaderName>
                    📍 점검 포인트: {point.name}
                  </PointHeaderName>

                  {/* 💡 [핵심 수정 2] 헤더 스타일도 포인트의 Before 유무 상태를 반영하도록 수정 */}
                  <GridTableHeader $showBefore={pointHasBefore}>
                    <div>검사 세부 필드</div>
                    <div>판정 기준 스펙</div>
                    {pointHasBefore && (
                      <div style={{ textAlign: "center" }}>
                        개선 전 (Before)
                      </div>
                    )}
                    <div style={{ textAlign: "center" }}>
                      개선 후 (After) 최종 데이터
                    </div>
                  </GridTableHeader>

                  {point.fields?.map((field, fIdx) => {
                    const cell = pointAnswer?.values?.[fIdx];
                    const isAfterNg = cell?.after_fail === "Y";

                    // 💡 [수정] 마스터 데이터에 세팅된 필드 고유의 showBefore 설정을 최우선으로 신뢰합니다.
                    const itemShowBefore = field.showBefore;

                    const v = field.validation;
                    let specGuide = "자율 입력";
                    if (v?.type === "delta" || v?.type === "rangeDelta")
                      specGuide = `오차 기준 ±${v.allowedDelta}`;
                    if (v?.type === "min")
                      specGuide = `최소 ${v.minValue} 이상`;
                    if (v?.type === "range")
                      specGuide = `${v.minRange} ~ ${v.maxRange}`;
                    if (v?.type === "textCheck") specGuide = `제한문구 등록됨`;

                    return (
                      <GridTableRow
                        key={`${field.col}_${fIdx}`}
                        $showBefore={pointHasBefore} // 부모 헤더 정렬용 (위 답변 유지)
                      >
                        <div className="field-name">🔹 {field.col}</div>
                        <div className="spec-guide">{specGuide}</div>

                        {/* 💡 개별 필드의 showBefore 기준에 따라 Before 셀을 정확하게 스위칭 */}
                        {pointHasBefore &&
                          (itemShowBefore ? (
                            <DataValueBox $status="normal">
                              <span className="num-val">
                                {cell?.before || "-"}
                              </span>
                              <StatusIndicatorBar $status="normal" />
                            </DataValueBox>
                          ) : (
                            <div
                              style={{
                                textAlign: "center",
                                color: "#cbd5e1",
                                fontSize: "13px",
                              }}
                            >
                              -
                            </div>
                          ))}

                        <DataValueBox $status={isAfterNg ? "ng" : "normal"}>
                          <span className="num-val">{cell?.after || "-"}</span>
                          <StatusIndicatorBar
                            $status={isAfterNg ? "ng" : "normal"}
                          />
                          {isAfterNg && <NgBadge>NG</NgBadge>}
                        </DataValueBox>
                      </GridTableRow>
                    );
                  })}
                </PointGroupBlock>
              );
            })}
          </SectionCard>
        ))}
      </MainDashboardBody>
    </WindowWindowContainer>
  );
};

export default ChecklistHistoryDetail;

/* -------------------------------------------------------------------------- */
/* styled-components 수정본                                                    */
/* -------------------------------------------------------------------------- */

const WindowWindowContainer = styled.div`
  background-color: #0f172a;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const TopControlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b;
  padding: 12px 20px;
  border-bottom: 2px solid #334155;
  .left-brand {
    color: #f8fafc;
    font-weight: 700;
    font-size: 14px;
  }
`;

const CloseWindowButton = styled.button`
  background: #f1f5f9;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  &:hover {
    background: #cbd5e1;
  }
`;

const MainDashboardBody = styled.div`
  padding: 24px;
  background-color: #f8fafc;
`;

const LoadingBox = styled.div`
  text-align: center;
  padding: 150px 0;
  font-size: 16px;
  color: #64748b;
`;

const DashboardSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
`;

const SummaryCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 5px solid ${(props) => (props.$isNg ? "#ef4444" : "#10b981")};
  border-radius: 8px;
  padding: 16px;
  label {
    font-size: 11px;
    color: #64748b;
    font-weight: 600;
    display: block;
    margin-bottom: 6px;
  }
  .value {
    font-size: 18px;
    font-weight: 700;
    color: ${(props) => (props.$isNg ? "#dc2626" : "#1e293b")};
  }
  .text-blue {
    color: #2563eb;
  }
`;

const TimeBar = styled.div`
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 6px;
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #475569;
  margin-bottom: 24px;
`;

const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionHeaderTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 17px;
  color: #0f172a;
  font-weight: 800;
  border-bottom: 2px solid #cbd5e1;
  padding-bottom: 8px;
`;

const PointGroupBlock = styled.div`
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const PointHeaderName = styled.div`
  background-color: #f1f5f9;
  padding: 10px 16px;
  font-weight: 700;
  font-size: 14px;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
`;

/* 💡 [수정] 헤더도 대동단결 분할 기법 적용 */
const GridTableHeader = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$showBefore ? "2fr 1.5fr 1.2fr 1.2fr" : "2fr 1.5fr 2.4fr"};
  background-color: #f8fafc;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
`;

const GridTableRow = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$showBefore ? "2fr 1.5fr 1.2fr 1.2fr" : "2fr 1.5fr 2.4fr"};
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  &:last-child {
    border-bottom: none;
  }
  .field-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 13px;
  }
  .spec-guide {
    color: #64748b;
    font-size: 12px;
  }
`;

const DataValueBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.$status === "ng" ? "#fef2f2" : "#f0fdf4"};
  border: 1px solid
    ${(props) => (props.$status === "ng" ? "#fca5a5" : "#bbf7d0")};
  padding: 6px 12px;
  margin: 0 4px;
  border-radius: 6px;
  min-height: 40px;
  position: relative;

  .num-val {
    font-size: 14px;
    font-weight: 700;
    color: ${(props) => (props.$status === "ng" ? "#991b1b" : "#166534")};
  }
`;

const StatusIndicatorBar = styled.div`
  width: 80%;
  height: 4px;
  background-color: ${(props) =>
    props.$status === "ng" ? "#ef4444" : "#10b981"};
  margin-top: 4px;
  border-radius: 2px;
`;

const NgBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 9px;
  font-weight: 900;
  padding: 1px 4px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
`;
