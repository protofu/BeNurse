import React, { useRef } from "react";

import { StyledTextareaContainer, StyledTextarea } from "./Textarea.styles";
export default function Textarea({
  placeholder,
  width,
  height,
  onFocus,
  onChange,
  props,
  value,
  defaultValue,
  cols,
  rows,
  ref,
}) {
  const textarea = useRef();
  const handleResizeHeight = () => {
    textarea.current.style.height = "auto";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  };
  return (
    <StyledTextareaContainer
      width={width}
      height={height}
      props={props}
    >
      <StyledTextarea
        value={value}
        defaultValue={defaultValue}
        ref={textarea}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={(e) => {
          onChange(e);
          handleResizeHeight();
        }}
        cols="30"
        rows="1"
      />
    </StyledTextareaContainer>
  );
}
