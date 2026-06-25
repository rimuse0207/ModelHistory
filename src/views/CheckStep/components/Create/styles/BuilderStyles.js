import styled from "styled-components";

export const BuilderContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 300px 1fr;
  background-color: #f1f5f9;
  min-height: calc(100vh - 100px);
  height: calc(100vh - 100px);
  overflow: hidden;
`;

export const ColumnSection = styled.div`
  background-color: ${(props) => props.$bg || "#f8fafc"};
  border-right: 1px solid #cbd5e1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  box-sizing: border-box;
`;

export const ColumnHeader = styled.h3`
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid #cbd5e1;
  padding-bottom: 10px;
`;

export const LargeCanvasSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: calc(100vh - 100px);
  box-sizing: border-box;
  overflow: hidden;
`;

export const CanvasTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

export const CanvasTitle = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MetaIndicator = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  span {
    font-weight: bold;
    color: #2563eb;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 0px;
  font-size: 13px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  background: #fff;
  padding-left: 10px;
  &:focus {
    border-color: #2563eb;
  }
  &.title-input {
    background: transparent;
    border: 1px dashed transparent;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    padding: 4px 8px;
    width: calc(100% - 24px);
  }
  &.title-input:hover,
  &.title-input:focus {
    border-color: #475569;
    background: #334155;
    cursor: text;
  }
  &.point-title-input {
    background: transparent;
    border: 1px dashed transparent;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    padding: 4px 6px;
    width: calc(100% - 24px);
  }
  &.point-title-input:hover,
  &.point-title-input:focus {
    border-color: #cbd5e1;
    background: #ffffff;
    cursor: text;
  }
`;

export const SelectBox = styled.select`
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #fff;
  outline: none;
  &:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
  }
`;

export const InlineInputRow = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
`;

export const IconButton = styled.button`
  background: #1e293b;
  color: white;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #0f172a;
  }
`;

export const VerticalInputCard = styled.div`
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 16px;
  border-radius: 8px;
`;

export const Button = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const SaveButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

export const WorkspaceScrollArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-right: 6px;
  box-sizing: border-box;
  height: 100%;
`;

export const CategoryCard = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
`;

export const CategoryHeader = styled.div`
  background: #1e293b;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardBodyContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PointSectionBlock = styled.div`
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
`;

export const PointBlockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
  margin-bottom: 14px;
`;

export const PointTitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 50%;
`;

export const PointActionGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const FieldConfigureGridRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 1.5fr 1.5fr 36px;
  gap: 10px;
  align-items: flex-end;
`;

export const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

export const GridActionItem = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 2px;
`;

export const GridLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
`;

export const GridInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  background: #fff;
  height: 36px;
  box-sizing: border-box;
  &:focus {
    border-color: #2563eb;
  }
  &:disabled {
    background: #f1f5f9;
    color: #94a3b8;
  }
`;

export const GridSelect = styled.select`
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #fff;
  outline: none;
  height: 36px;
  box-sizing: border-box;
`;

export const FieldDeleteCircleButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;

export const DeleteCardButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid #ef4444;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: #ef4444;
    color: white;
  }
`;

export const DeleteIconButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;

export const SmallActionOutlineButton = styled.button`
  background: #ffffff;
  border: 1px solid #0284c7;
  color: #0284c7;
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  &:hover {
    background: #0284c7;
    color: #fff;
  }
`;

export const BigGhostButton = styled.button`
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  color: #475569;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
`;

export const CanvasAddOutlineButton = styled.button`
  background: #ffffff;
  border: 2px dashed #94a3b8;
  border-radius: 12px;
  padding: 18px;
  font-size: 14px;
  font-weight: 800;
  color: #475569;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
  margin-bottom: 40px;
  &:hover {
    background: #f1f5f9;
    border-color: #475569;
    color: #0f172a;
  }
`;

export const EmptyWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  .alert-text {
    color: #94a3b8;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
  }
`;

export const DynamicOptionBar = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 10px 12px;
  border-radius: 6px;
  margin-top: 6px;
  margin-right: 36px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const OptionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #166534;
`;

export const OptionInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  font-size: 12px;
  border: 1px solid #86efac;
  border-radius: 4px;
  outline: none;
  background: #fff;
  &:focus {
    border-color: #16a34a;
  }
`;

export const FlexRangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  span {
    font-size: 12px;
    color: #94a3b8;
    font-weight: bold;
  }
`;

export const DynamicCheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background-color: #f3e8ff;
  border: 1px solid #d8b4fe;
  padding: 4px 8px;
  border-radius: 6px;
  height: 36px;
  box-sizing: border-box;
  align-items: center;
  overflow-y: auto;
  width: 100%;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c084fc;
    border-radius: 2px;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${(props) => (props.$checked ? "#7c3aed" : "#ffffff")};
  color: ${(props) => (props.$checked ? "#ffffff" : "#5b21b6")};
  border: 1px solid ${(props) => (props.$checked ? "#7c3aed" : "#ddd6fe")};
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease-in-out;
  input {
    display: none;
  }
  &:hover {
    background: ${(props) => (props.$checked ? "#6d28d9" : "#ede9fe")};
  }
`;

export const EditableTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 50%;
  position: relative;
  .edit-hint-icon {
    color: #475569;
    opacity: 0.4;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  &:hover .edit-hint-icon {
    opacity: 1;
    color: #38bdf8;
  }
`;

export const EditablePointTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  position: relative;
  .edit-point-icon {
    color: #94a3b8;
    opacity: 0.3;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  &:hover .edit-point-icon {
    opacity: 1;
    color: #2563eb;
  }
`;

export const HeaderControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SortButtonGroup = styled.div`
  display: flex;
  background-color: #334155;
  border-radius: 6px;
  padding: 2px;
  border: 1px solid #475569;
`;

export const SortActionButton = styled.button`
  background: transparent;
  border: none;
  color: #cbd5e1;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    background-color: #475569;
    color: #ffffff;
  }
  &:disabled {
    color: #64748b;
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export const PointSortButtonGroup = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 1px;
  border: 1px solid #cbd5e1;
`;

export const PointSortButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  width: 22px;
  height: 22px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
  &:hover:not(:disabled) {
    background-color: #f1f5f9;
    color: #0f172a;
  }
  &:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

export const TopActionRightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CopyLoadButton = styled.button`
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    background-color: #e2e8f0;
    color: #0f172a;
  }
  &:disabled {
    background-color: #f8fafc;
    color: #cbd5e1;
    cursor: not-allowed;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 440px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
  @keyframes fadeIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export const ModalHeader = styled.div`
  background: #1e293b;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  h4 {
    font-size: 14px;
    font-weight: 800;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .close-btn {
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    &:hover {
      color: white;
    }
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
  .notice-desc {
    font-size: 12px;
    color: #64748b;
    line-height: 1.5;
    margin: 0 0 16px 0;
    background-color: #f8fafc;
    padding: 10px;
    border-radius: 6px;
    border-left: 3px solid #7c3aed;
  }
`;

export const ModalCancelButton = styled.button`
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #e2e8f0;
  }
`;

export const ModalConfirmButton = styled.button`
  background: #7c3aed;
  color: #fff;
  border: none;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:disabled {
    background: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #6d28d9;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e2e8f0;
  margin: 16px 0;
`;

export const LeftControlPanel = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
`;
