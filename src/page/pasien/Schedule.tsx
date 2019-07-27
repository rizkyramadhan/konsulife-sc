import IconCalendarDay from "@app/libs/ui/Icons/IconCalendarDay";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardBody, UICardHeader } from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIDateField from "@app/libs/ui/UIDateField";
import UIRow from "@app/libs/ui/UIRow";
import UIText from "@app/libs/ui/UIText";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { pasien } from "@app/storage/pasien";
import IconClock from "@app/libs/ui/Icons/IconClock";
import UITimeField from "@app/libs/ui/UITimeField";
import { ScrollView, Image, View, Button, Modal } from "reactxp";
import UIRating from "@app/libs/ui/UIRating";
import UIModalWraper from "@app/libs/ui/UIModalWraper";
import UIButton from "@app/libs/ui/UIButton";

const defaultUser = require("@app/assets/images/dokter.png");

export default observer(() => {
  const data = pasien.session;
  const psikolog = pasien.psikolog;
  const activePsi = {
    borderBottomWidth: 4
  };
  console.log(data);
  const modal = (item: any) => {
    let modal = (
      <UIModalWraper
        title={item.nama}
        style={{
          minHeight: 360,
          maxHeight: 360
        }}
        close={() => {
          Modal.dismiss("detail" + item.id);
        }}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 300
          }}
        >
          <Image
            source={defaultUser}
            style={{
              height: 100,
              width: 100
            }}
          />
          <UIText
            style={{
              color: "#128CDE",
              fontSize: 18
            }}
          >
            {item.nama}
          </UIText>
          <UIText
            style={{
              color: "#4d5b6a",
              fontSize: 14
            }}
          >
            {item.kota}
          </UIText>
          <UIButton
            size="large"
            style={{
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              flexGrow: 0
            }}
            onPress={() => {
              Modal.dismiss("detail" + item.id);
              data.psikolog = item.id;
            }}
          >
            Pilih
          </UIButton>
        </View>
      </UIModalWraper>
    );
    Modal.show(modal, "detail" + item.id);
  };

  useEffect(() => {}, [data]);

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
              backgroundColor: "#cce8ff"
            }}
          >
            <UIText style={{ fontSize: 18 }}>Tentukan Jadwal</UIText>
          </UICardHeader>
          <UICardBody>
            <UIText
              style={{
                fontSize: 14,
                paddingLeft: 10,
                paddingRight: 10,
                color: "#4d5b6a"
              }}
            >
              Pilih tanggal yang kamu mau
            </UIText>
            <UIRow>
              <UICol
                size={2}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10
                }}
              >
                <IconCalendarDay color="#128CDE" width={24} height={24} />
              </UICol>
              <UICol size={9} style={{ padding: 10 }}>
                <UIDateField
                  value={data.date}
                  setValue={v => (data.date = v)}
                />
              </UICol>
            </UIRow>
          </UICardBody>
          <UICardBody>
            <UIText
              style={{
                fontSize: 14,
                paddingLeft: 10,
                paddingRight: 10,
                color: "#4d5b6a"
              }}
            >
              Tentukan Jamnya
            </UIText>
            <UIRow>
              <UICol
                size={2}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10
                }}
              >
                <IconClock color="#128CDE" width={24} height={24} />
              </UICol>
              <UICol size={9} style={{ padding: 10 }}>
                <UITimeField
                  value={data.time}
                  setValue={v => (data.time = v)}
                />
              </UICol>
            </UIRow>
          </UICardBody>
        </UICard>
        <UIText
          style={{
            fontSize: 18,
            marginTop: 15,
            marginLeft: 10,
            marginBottom: 10
          }}
        >
          Pilih Psikolog
        </UIText>
        <ScrollView>
          {psikolog.map((item, idx) => {
            return (
              <UICard
                key={idx}
                mode="clean"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderTopLeftRadius: 50,
                  borderBottomLeftRadius: 50,
                  marginBottom: 20,
                  borderWidth: 0,
                  borderColor: "#138cde",
                  ...(item.id == data.psikolog ? activePsi : {})
                }}
              >
                <Button
                  style={{ margin: 0 }}
                  onPress={() => {
                    modal(item);
                  }}
                >
                  <UIRow>
                    <UICol size={3}>
                      <Image
                        source={defaultUser}
                        style={{
                          height: 80,
                          width: 80
                        }}
                      />
                    </UICol>
                    <UICol
                      size={9}
                      style={{
                        justifyContent: "center"
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 5,
                          paddingLeft: 10
                        }}
                      >
                        <UIRating
                          mode="view"
                          size={12}
                          value={item.rating}
                          style={{ padding: 2 }}
                        />
                        <View
                          style={{
                            alignItems: "flex-end"
                          }}
                        >
                          <UIText
                            style={{
                              paddingTop: 4,
                              fontSize: 12,
                              color: "#ccc"
                            }}
                          >
                            {" "}
                            | {item.klien} klien bulan ini
                          </UIText>
                        </View>
                      </View>
                      <View
                        style={{
                          paddingLeft: 10
                        }}
                      >
                        <UIText
                          style={{
                            color: "#128CDE",
                            fontSize: 18
                          }}
                        >
                          {item.nama}
                        </UIText>
                        <UIText
                          style={{
                            color: "#4d5b6a",
                            fontSize: 14
                          }}
                        >
                          {item.kota}
                        </UIText>
                      </View>
                    </UICol>
                  </UIRow>
                </Button>
              </UICard>
            );
          })}
        </ScrollView>
      </UIBody>
    </UIContainer>
  );
});
