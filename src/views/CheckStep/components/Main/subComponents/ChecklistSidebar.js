import React from "react";
import { NavSidebar, NavItem } from "../../../Layout.styles";
import { checkCategoryIncomplete } from "../../../../../utils/checklistValidator";

function ChecklistSidebar({
  categories,
  currentCatIndex,
  setCurrentCatIndex,
  answers,
}) {
  console.log(categories);
  return (
    <NavSidebar>
      {categories.map((cat, idx) => {
        const { isIncomplete, missingCount } = checkCategoryIncomplete(
          cat,
          answers,
        );

        return (
          <NavItem
            key={cat.id}
            $active={idx === currentCatIndex}
            onClick={() => setCurrentCatIndex(idx)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{cat.category}</span>
            {isIncomplete &&
              missingCount > 0 && ( // 💡 missingCount가 0보다 클 때만 명확히 노출
                <span
                  style={{
                    background: "#fff7ed",
                    color: "#c2410c",
                    fontSize: "11px",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    border: "1px solid #ffedd5",
                  }}
                >
                  ⚠️ {missingCount}
                </span>
              )}
          </NavItem>
        );
      })}
    </NavSidebar>
  );
}

export default ChecklistSidebar;
