import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Request_Get_Axios } from "../../../../../API";
import moment from "moment";

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

        const { master, answers } = detailRes.data;

        setMasterInfo(master);
        setAnswers(answers);

        let ngCounter = 0;
        Object.values(answers).forEach((ans) => {
          ans.values?.forEach((v) => {
            if (v.after_fail === "Y") ngCounter++;
          });
        });
        setTotalNgCount(ngCounter);

        const masterRes = await Request_Get_Axios(
          `/checklist/master/history/detail/${submissionId}`,
        );

        const serverCategories = masterRes.data.data || [];
        const processedCategories = serverCategories.map((cat) => ({
          ...cat,
          points: cat.points?.map((pt) => {
            let rawFields = pt.fields || pt.fields_json || [];

            if (typeof rawFields === "string") {
              try {
                rawFields = JSON.parse(rawFields);
              } catch (e) {
                rawFields = [];
              }
            }

            const normalizedFields = Array.isArray(rawFields)
              ? rawFields.map((f) => {
                  return {
                    ...f,
                    showBefore: f.prev_value === "Y" || f.prev_value === "y",
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
        console.error("🚨 상세 조회 통신 오류 발생:", err);
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
        <div className="left-brand">Model Check SYSTEM </div>
        <CloseWindowButton onClick={() => window.close()}>
          창 닫기
        </CloseWindowButton>
      </TopControlHeader>

      <MainDashboardBody>
        {/* 상단 4구 종합 대시보드 요약 그리드 */}
        <DashboardSummaryGrid>
          <SummaryCard>
            <label>모델명</label>
            <div className="value">{masterInfo.model_name}</div>
          </SummaryCard>
          <SummaryCard>
            <label>시리얼 넘버 (공정)</label>
            <div className="value text-blue">
              {masterInfo.serial_no} ({masterInfo.line_name})
            </div>
          </SummaryCard>
          <SummaryCard>
            <label>최종 작성자</label>
            <div className="value">
              {masterInfo.departmentName} {masterInfo.fullName}{" "}
              {masterInfo.titleName}
            </div>
          </SummaryCard>
          <SummaryCard $isNg={totalNgCount > 0}>
            <label>종합 판정 결과 (After 기준)</label>
            <div className="value">
              {totalNgCount > 0 ? `불량(NG) ${totalNgCount}건` : "정상 (PASS)"}
            </div>
          </SummaryCard>
        </DashboardSummaryGrid>
        <DashboardSummaryGrid>
          <SummaryCard>
            <label>작업 일자</label>
            <div className="value text-blue">{`${moment(`${moment(masterInfo.work_date).format("YYYY-MM-DD")}T${masterInfo.work_time}`).format("YYYY. M. D. LTS")}`}</div>
          </SummaryCard>
          <SummaryCard>
            <label>작업 담당자</label>
            <div className="value">{masterInfo.worker_name}</div>
          </SummaryCard>

          <SummaryCard>
            <label>작업 코멘트</label>
            <div style={{ fontSize: "0.8em" }} className="value">
              {masterInfo.summary_comments}
            </div>
          </SummaryCard>
        </DashboardSummaryGrid>

        <TimeBar>
          <span>
            <b>마스터 등록 ID:</b> #{masterInfo.submissionId}
          </span>
          <span>
            <b>최종 등록 일시:</b>{" "}
            {new Date(masterInfo.completedAt).toLocaleString()}
          </span>
        </TimeBar>

        {/* 하단 세부 카테고리별 정밀 그리드 맵 명세 */}
        {categories.map((cat) => (
          <SectionCard key={cat.id}>
            <SectionHeaderTitle>카테고리 : {cat.category}</SectionHeaderTitle>

            {cat.points?.map((point) => {
              const answerKey = `${cat.id}_${point.pointId}`;
              const pointAnswer = answers[answerKey];

              const pointHasBefore = point.fields?.some(
                (field) => field.showBefore,
              );

              return (
                <PointGroupBlock key={point.pointId}>
                  <PointHeaderName>
                    📍 점검 포인트: {point.name}
                  </PointHeaderName>

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
                    const itemShowBefore = field.showBefore;

                    const v = field.validation;
                    let specGuide = "자율 입력";
                    if (v?.type === "delta" || v?.type === "rangeDelta")
                      specGuide = `오차 기준 ±${v.allowedDelta || v.allowedDelta || 0}`;
                    if (v?.type === "min")
                      specGuide = `최소 ${v.minValue} 이상`;
                    if (v?.type === "range")
                      specGuide = `${v.minRange} ~ ${v.maxRange}`;
                    if (v?.type === "textCheck") specGuide = `제한문구 등록됨`;

                    return (
                      <GridTableRow
                        key={`${field.col}_${fIdx}`}
                        $showBefore={pointHasBefore}
                      >
                        <div className="field-name">🔹 {field.col}</div>
                        <div className="spec-guide">{specGuide}</div>

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
