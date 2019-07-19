import UIButton from "@app/libs/ui/UIButton";

import React from "react";
import IconSave from "@app/libs/ui/Icons/IconSave";
import { isSize } from "@app/libs/ui/MediaQuery";
import UIText from "@app/libs/ui/UIText";

export default ({ onPress, saving = false, type = "save", style }: any) => {
  return (
    <UIButton
      color="primary"
      size="small"
      onPress={onPress}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        height: 40,
        ...style
      }}
    >
      <IconSave color="#fff" width={18} height={18} />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#fff", paddingLeft: 10 }} size="small">
          {saving
            ? type === "save"
              ? " Saving..."
              : "Updating"
            : type === "save"
            ? " Save"
            : " Update"}
        </UIText>
      )}
    </UIButton>
  );
};
