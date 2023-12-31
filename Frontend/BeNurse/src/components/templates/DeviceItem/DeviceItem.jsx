import React from "react";
import { Common } from "../../../utils/global.styles";

// emotions
import Box from "../../atoms/Box/Box";

// Icons
import { MdKeyboardArrowRight } from "react-icons/md";

//Images
import temp from "@assets/Images/temp.png";

export default function DeviceItem({ listItem, item, beacon, onClick }) {
  return (
    <Box
      type={listItem ? "white" : "transparent"}
      margin={listItem ? "0px 0px 14px 0px" : "0px 0px 0px 0px"}
      padding={"20px"}
      size={listItem ? ["348px", "82px"] : ["372px", "82px"]}
      font={"16px"}
      flex={["flex-start", "center"]}
      onClick={onClick}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "334px",
          height: "82px",
        }}
      >
        <img
          style={{
            height: "82px",
            border: `1px solid ${Common.color.purple01}`,
            borderRadius: "10px",
          }}
          src={temp}
          alt=""
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "14px",
            gap: "8px",
          }}
        >
          {true ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: Common.fontSize.fontXS,
                fontWeight: Common.fontWeight.bold,
                width: "50px",
                height: "22px",
                borderRadius: "30px",
                backgroundColor: "rgba(255, 229, 229, 1)",
                color: "#D96363",
              }}
            >
              사용중
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: Common.fontSize.fontXS,
                fontWeight: Common.fontWeight.bold,
                width: "58px",
                height: "22px",
                borderRadius: "30px",
                backgroundColor: "#DDFEE4",
                color: "#289741",
              }}
            >
              사용 가능
            </div>
          )}
          <p
            style={{
              fontSize: Common.fontSize.fontM,
              fontWeight: Common.fontWeight.extrabold,
            }}
          >
            {item?.name}
          </p>
          <p style={{ fontSize: Common.fontSize.fontXS }}>
            <span
              style={{
                fontWeight: Common.fontWeight.bold,
              }}
            >
              자산 코드{" "}
            </span>
            {item?.id}
          </p>
          <p style={{ fontSize: Common.fontSize.fontXS }}>
            {beacon ? (
              <>
                <span
                  style={{
                    fontWeight: Common.fontWeight.bold,
                  }}
                >
                  현재위치{" "}
                </span>
                {beacon.floor}층 {beacon.location}
              </>
            ) : null}
          </p>
        </div>
      </div>
      {listItem ? (
        <button
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30px",
            height: "30px",
            border: "none",
            borderRadius: "30px",
            backgroundColor: Common.color.purple01,
          }}
        >
          <MdKeyboardArrowRight
            size={24}
            color={Common.color.purple04}
          />
        </button>
      ) : null}
    </Box>
  );
}
