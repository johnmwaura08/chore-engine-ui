/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { GridHelperFunctions, ToastTypeEnum } from "../chores/grid.helpers";

export const useCopyToClipboard = () => {
  const copyToClipboard = (str: string) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    if(!document) return false;
    const rangeCount = document?.getSelection()?.rangeCount 
    const selected = rangeCount && rangeCount > 0
        ? document?.getSelection()?.getRangeAt(0)
        : false;
    el.select();
    const success = document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
      document?.getSelection()?.removeAllRanges();
      document?.getSelection()?.addRange(selected);
    }
    return success;
  };

  const copy = React.useCallback(
    (text: any) => {
     
          const message = "Copied to clipboard.";

      copyToClipboard(text);
      GridHelperFunctions.toaster(ToastTypeEnum.Information, message);
    },
    []
  );

  return copy;
};