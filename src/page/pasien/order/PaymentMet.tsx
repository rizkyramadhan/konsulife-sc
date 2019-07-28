import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import UIHeader from "@app/libs/ui/UIHeader";
import UIText from "@app/libs/ui/UIText";
import { pasien } from "@app/storage/pasien";
import { observer } from "mobx-react-lite";
import React from "react";
import { withRouter } from "react-router";

export default withRouter(
  observer(({ history }: any) => {
    const data = pasien.session;
    console.log(data);

    return (
      <UIContainer>
        <UIBody>
          <UIHeader
            ishowSide={false}
            center={
              <UIText
                style={{
                  fontSize: 20
                }}
              >
                Pilih Metode Pembayaran
              </UIText>
            }
          />
        </UIBody>
      </UIContainer>
    );
  })
);
