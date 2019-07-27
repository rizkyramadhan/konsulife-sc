import IconCalendarDay from "@app/libs/ui/Icons/IconCalendarDay";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardHeader, UICardBody } from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import React from "react";

export default () => {
  return (
    <UIContainer>
      <UIBody>
        <UICard
          mode="clean"
          style={{
            borderRadius: 8,
            backgroundColor: "#fff"
          }}
        >
          <UICardHeader
            style={{
              backgroundColor: "#e4ebf6"
            }}
          >
            <UIText style={{ fontSize: 18 }}>Schedule Timing</UIText>
          </UICardHeader>
          <UICardBody>
            <UIRow>
              <UICol
                size={2}
                style={{
                  alignItems: "center"
                }}
              >
                <IconCalendarDay color="#2A4BA4" width={24} height={24} />
              </UICol>
              <UICol size={9} style={{ padding: 20 }}>
                <UIText style={{ color: "#fff", fontSize: 24 }}>
                  Pilih Hari
                </UIText>
              </UICol>
            </UIRow>
          </UICardBody>
        </UICard>
        <UICard
          style={{
            borderRadius: 12,
            backgroundColor: "#2A4BA4",
            borderWidth: 1,
            borderColor: "#2A4BA4"
          }}
        >
          <UIRow>
            <UICol
              size={3}
              style={{
                backgroundColor: "#fff",
                padding: 20,
                alignItems: "center"
              }}
            >
              <IconCalendarDay color="#2A4BA4" width={32} height={32} />
            </UICol>
            <UICol size={9} style={{ padding: 20 }}>
              <UIText style={{ color: "#fff", fontSize: 24 }}>
                Pilih Hari
              </UIText>
            </UICol>
          </UIRow>
        </UICard>
      </UIBody>
    </UIContainer>
  );
};
