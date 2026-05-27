import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ReviewValueChip } from "./ReviewValueChip";
import {
  AccordionCard,
  AccordionHeader,
  HeaderLeft,
  AccordionContent,
  ItemRow,
  ValuesDisplayGrid,
} from "../../styles/ReviewPage.style";

export function ReviewCategoryCard({
  cat,
  openSections,
  toggleSection,
  getSavedPointData,
  parseValue,
  evaluateFieldStatus,
  getValidationGuide,
}) {
  const currentCatId = cat.id || cat.cat_id || "";
  const isOpen = !!openSections[currentCatId];
  const displayCategoryName = cat.category || cat.category_name || "";

  return (
    <AccordionCard>
      <AccordionHeader
        $isOpen={isOpen}
        onClick={() => toggleSection(currentCatId)}
      >
        <HeaderLeft>{displayCategoryName}</HeaderLeft>
        {isOpen ? (
          <FiChevronUp size={20} color="#64748b" />
        ) : (
          <FiChevronDown size={20} color="#64748b" />
        )}
      </AccordionHeader>

      {isOpen && (
        <AccordionContent>
          {(cat.points || []).map((point, ptIdx) => {
            const savedPoint = getSavedPointData(cat, point) || {};
            const currentValuesArray = savedPoint.values || [];
            const currentPointName = point.name || point.point_name || "";
            const fieldsArray = point.fields || point.fields_json || [];

            return (
              <ItemRow key={`${currentCatId}_${point.pointId || ptIdx}`}>
                <div style={{ minWidth: "160px", paddingTop: "4px" }}>
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#1e293b",
                    }}
                  >
                    {currentPointName}
                  </span>
                </div>

                <ValuesDisplayGrid>
                  {fieldsArray.map((field, fIdx) => (
                    <ReviewValueChip
                      key={`${field.fieldId || fIdx}_${fIdx}`}
                      field={field}
                      item={currentValuesArray[fIdx]}
                      allValues={currentValuesArray} // 💡 [추가] 5개 전체 값을 하위 칩셋에 공급
                      parseValue={parseValue}
                      evaluateFieldStatus={evaluateFieldStatus}
                      getValidationGuide={getValidationGuide}
                    />
                  ))}
                </ValuesDisplayGrid>
              </ItemRow>
            );
          })}
        </AccordionContent>
      )}
    </AccordionCard>
  );
}
