import { withRouter } from "react-router-dom";
import React from "react";
import UIButton from "@app/libs/ui/UIButton";
import IconAdd from "@app/libs/ui/Icons/IconAdd";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIText from "@app/libs/ui/UIText";

export default withRouter(({ history, path, style }: any) => {
  return (
    <UIButton
      size="small"
      color="primary"
      onPress={() => {
        history.push(path);
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        height: 40,
        ...style
      }}
    >
      <IconAdd color="#fff" width={18} height={18} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff", paddingLeft: 10 }} size="small">
          Create
        </UIText>
      )}
    </UIButton>
  );
});
