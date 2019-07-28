import IconCalendarDay from "@app/libs/ui/Icons/IconCalendarDay";
import IconClock from "@app/libs/ui/Icons/IconClock";
import UIBody from "@app/libs/ui/UIBody";
import UIButton from "@app/libs/ui/UIButton";
import UICard, { UICardBody, UICardHeader } from "@app/libs/ui/UICard";
import UICol from "@app/libs/ui/UICol";
import UIContainer from "@app/libs/ui/UIContainer";
import UIDateField from "@app/libs/ui/UIDateField";
import UIModalWraper from "@app/libs/ui/UIModalWraper";
import UIRating from "@app/libs/ui/UIRating";
import UIRow from "@app/libs/ui/UIRow";
import UISelectField from "@app/libs/ui/UISelectField";
import UIText from "@app/libs/ui/UIText";
import { pasien } from "@app/storage/pasien";
import { observer } from "mobx-react-lite";
import React from "react";
import { withRouter } from "react-router";
import { Button, Image, Modal, ScrollView, View } from "reactxp";

const defaultUser = require("@app/assets/images/dokter.png");

export default withRouter(
  observer(({ history }: any) => {
    const data = pasien.session;
    const psikolog = pasien.psikolog;
    const schedule = pasien.schedule;
    const activePsi = {
      borderBottomWidth: 4
    };
    const modal = (item: any) => {
      let modal = (
        <UIModalWraper
          style={{
            minHeight: 360,
            maxHeight: 370
          }}
          close={() => {
            Modal.dismiss("detail" + item.id);
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "stretch",
              flexGrow: 1,
              height: 300
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center"
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
                  fontSize: 22
                }}
              >
                {item.nama}
              </UIText>
              <UIText
                style={{
                  color: "#a6b3c1",
                  fontSize: 14
                }}
              >
                {item.studi}
              </UIText>
              <UIText
                style={{
                  color: "#a6b3c1",
                  fontSize: 14
                }}
              >
                {item.kota}
              </UIText>
              <UIText
                style={{
                  color: "#a6b3c1",
                  fontSize: 14
                }}
              >
                {item.exp}
              </UIText>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: 20
                }}
              >
                <UIRating
                  mode="view"
                  size={18}
                  value={item.rating}
                  style={{
                    padding: 2
                  }}
                />
                <View
                  style={{
                    marginTop: 5,
                    paddingLeft: 5,
                    paddingRight: 5,
                    alignItems: "flex-end",
                    borderColor: "#ccc",
                    borderWidth: 0,
                    borderTopWidth: 1
                  }}
                >
                  <UIText
                    style={{
                      paddingTop: 4,
                      fontSize: 12,
                      color: "#ccc"
                    }}
                  >
                    {item.klien} klien bulan ini
                  </UIText>
                </View>
              </View>
            </View>
            <View
              style={{
                margin: 10,
                marginBottom: 0,
                flexDirection: "row",
                flexShrink: 0
              }}
            >
              <UIButton
                color="#FDCF09"
                style={{
                  borderRadius: 50,
                  flexGrow: 1
                }}
                onPress={() => {
                  Modal.dismiss("detail" + item.id);
                  data.psikolog = item.id;
                }}
              >
                <UIText
                  style={{
                    color: "#fff",
                    fontSize: 18
                  }}
                >
                  Pilih
                </UIText>
              </UIButton>
            </View>
          </View>
        </UIModalWraper>
      );
      Modal.show(modal, "detail" + item.id);
    };

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
                    futureDate={true}
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
                  <UISelectField
                    value={data.time}
                    setValue={v => (data.time = v)}
                    items={schedule.map(x => {
                      return { label: x.time, value: x.id };
                    })}
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
                    borderRadius: 12,
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
          <View style={{ marginTop: 10, flexDirection: "row", flexGrow: 1 }}>
            <UIButton
              color="#FDCF09"
              style={{
                borderRadius: 50,
                flexGrow: 1
              }}
              onPress={() => {
                if (data.date && data.time && data.psikolog != 0) {
                  history.replace("pasien/package");
                } else alert("Mohon selesaikan form terlebih dahulu.");
              }}
            >
              <UIText
                style={{
                  color: "#fff",
                  fontSize: 18
                }}
              >
                Lanjutkan
              </UIText>
            </UIButton>
          </View>
        </UIBody>
      </UIContainer>
    );
  })
);
