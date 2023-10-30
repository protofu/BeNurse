import React from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";

import { Common } from "../../../utils/global.styles";
import Box from "../../atoms/Box/Box";

import { usePatientStore } from "../../../store/store";

import { FaTrashAlt, FaEdit } from "react-icons/fa";

export default function BottomSelectPanel({ modifyLabel, deleteLabel }) {
  const { isEditActivated, ActivateEdit, DeactivateEdit } = usePatientStore(
    (state) => state,
  );
  return (
    <BottomSheet
      open={isEditActivated}
      onDismiss={DeactivateEdit}
    >
      <div
        style={{
          height: "184px",
        }}
      >
        <Box
          type={"transparent"}
          size={["412px", "80px"]}
          border={true}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "340px",
              height: "60px",
            }}
          >
            <FaEdit
              color="#555555"
              size={22}
              style={{ marginRight: "8px" }}
            />
            <span
              style={{
                color: Common.color.black02,
                fontSize: Common.fontSize.fontM,
                fontWeight: Common.fontWeight.bold,
              }}
            >
              {modifyLabel}
            </span>
          </div>
        </Box>
        <Box
          type={"transparent"}
          size={["412px", "80px"]}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "340px",
              height: "60px",
            }}
          >
            <FaTrashAlt
              color="#555555"
              size={22}
              style={{ marginRight: "8px" }}
            />
            <span
              style={{
                color: Common.color.black02,
                fontSize: Common.fontSize.fontM,
                fontWeight: Common.fontWeight.bold,
              }}
            >
              {deleteLabel}
            </span>
          </div>
        </Box>
      </div>
    </BottomSheet>
  );
}
