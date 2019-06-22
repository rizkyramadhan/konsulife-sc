import { isSize } from "@app/libs/ui/MediaQuery";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIJsonTable from "@app/libs/ui/UIJsonTable";
import UIText from "@app/libs/ui/UIText";
import React from "react";
import { withRouter } from "react-router";
import { Image } from "reactxp";

const FormSO = withRouter(({ history }: any) => {
  return (
    <UIButton
      size="compact"
      fill="clear"
      onPress={() => {
        history.replace("/so/form");
      }}
    >
      <Image
        style={{ width: 28, height: 28 }}
        source={require("@icon/add.png")}
      />
      {isSize(["md", "lg"]) && (
        <UIText style={{ color: "#613eea" }}>Create</UIText>
      )}
    </UIButton>
  );
});

export default () => {
  return (
    <UIContainer>
      <UIHeader center={"Sales Order"} right={<FormSO />} />
      <UIBody>
        {/* <IconBack /> */}
        <UIJsonTable
          data={[
            {
              no: 1,
              test: "qwe",
              coba: "halo"
            },
            {
              no: 2,
              test: "asdasd",
              coba: "halo"
            },
            {
              no: 3,
              test: "asdasd",
              coba: "halo"
            },
            {
              no: 4,
              test: "asdasd",
              coba: "halo"
            }
          ]}
          colWidth={[
            {
              index: 0,
              width: 45
            },
            {
              index: 2,
              width: 150
            }
          ]}
        />
      </UIBody>
    </UIContainer>
  );
};
