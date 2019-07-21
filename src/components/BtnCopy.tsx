import IconCopy from "@app/libs/ui/Icons/IconCopy";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIButton from "@app/libs/ui/UIButton";
import UIText from "@app/libs/ui/UIText";
import React from "react";
import { withRouter } from "react-router-dom";

export default withRouter(({ onPress, style = {}, label = "Copy" }: any) => {
  return (
    <UIButton
      size="small"
      color="success"
      onPress={onPress}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        height: 45,
        ...style
      }}
    >
      <IconCopy color="#fff" width={18} height={18} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          {" "}
          {label}
        </UIText>
      )}
    </UIButton>
  );
});
