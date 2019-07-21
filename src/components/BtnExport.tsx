import { withRouter } from "react-router-dom";
import React from "react";
import UIButton from "@app/libs/ui/UIButton";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIText from "@app/libs/ui/UIText";
import IconReceipt from "@app/libs/ui/Icons/IconReceipt";

export default withRouter(({ onPress, exporting = false, style }: any) => {
  return (
    <UIButton
      size="small"
      color="success"
      onPress={onPress}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        height: 40,
        ...style
      }}
    >
      <IconReceipt color="#fff" width={18} height={18} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff" }} size="small">
          {exporting ? "Exporting..." : "Export"}
        </UIText>
      )}
    </UIButton>
  );
});
