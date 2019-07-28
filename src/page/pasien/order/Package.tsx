import IconClock from "@app/libs/ui/Icons/IconClock";
import IconComment from "@app/libs/ui/Icons/IconComment";
import IconPhone from "@app/libs/ui/Icons/IconPhone";
import UIBody from "@app/libs/ui/UIBody";
import UICard, { UICardBody } from "@app/libs/ui/UICard";
import UIContainer from "@app/libs/ui/UIContainer";
import UIGradient from "@app/libs/ui/UIGradient";
import UIHeader from "@app/libs/ui/UIHeader";
import UIText from "@app/libs/ui/UIText";
import { pasien } from "@app/storage/pasien";
import { observer } from "mobx-react-lite";
import React from "react";
import { withRouter } from "react-router";
import { Button, ScrollView, View } from "reactxp";

export default withRouter(
  observer(({ history }: any) => {
    const packageList = pasien.package;
    const data = pasien.session;
    const color = [
      ["#12DEA7", "#1A7138"],
      ["#FDCF09", "#F19E00"],
      ["#128CDE", "#2A4BA4"],
      ["#647DEE", "#7F53AC"]
    ];
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
                Pilih Paket
              </UIText>
            }
          />
          <ScrollView>
            {packageList.map((item, key) => {
              return (
                <Button
                  key={key}
                  style={{
                    padding: 0,
                    margin: 0
                  }}
                  onPress={() => {
                    data.package = item.id;
                    history.replace("pasien/payment");
                  }}
                >
                  <UICard
                    mode="clean"
                    style={{
                      borderRadius: 12
                      // backgroundColor: "#2A4BA4"
                    }}
                  >
                    <UIGradient
                      key={key}
                      style={{ flex: 1 }}
                      angle={30}
                      colors={color[key]}
                    >
                      <UICardBody>
                        <View
                          style={{
                            flexDirection: "row"
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              flexGrow: 0,
                              alignItems: "flex-start",
                              justifyContent: "center",
                              borderWidth: 0,
                              borderColor: "#fff",
                              borderBottomWidth: 1
                            }}
                          >
                            <UIText
                              style={{
                                color: "#fff",
                                fontSize: 20
                              }}
                            >
                              Paket {item.title}
                            </UIText>
                          </View>
                          <View
                            style={{
                              alignItems: "flex-end",
                              justifyContent: "center"
                            }}
                          >
                            <UIText
                              style={{
                                color: "#2A4BA4",
                                fontSize: 20,
                                paddingBottom: 5,
                                paddingTop: 10,
                                paddingLeft: 10,
                                paddingRight: 10,
                                borderTopLeftRadius: 15,
                                borderBottomRightRadius: 15,
                                backgroundColor: "#fff"
                              }}
                            >
                              IDR {item.price}
                            </UIText>
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            marginTop: 10,
                            marginBottom: 10
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              margin: 10
                            }}
                          >
                            <IconClock color="#fff" width={20} height={20} />
                            <UIText
                              style={{
                                color: "#fff",
                                fontSize: 16,
                                paddingLeft: 10
                              }}
                            >
                              {item.duration} Menit
                            </UIText>
                          </View>
                          {item.channel == "call" ? (
                            <View
                              style={{
                                flexDirection: "row",
                                margin: 10
                              }}
                            >
                              <IconPhone color="#fff" width={20} height={20} />
                              <UIText
                                style={{
                                  color: "#fff",
                                  fontSize: 16,
                                  paddingLeft: 10
                                }}
                              >
                                Panggilan Suara
                              </UIText>
                            </View>
                          ) : (
                            <View
                              style={{
                                flexDirection: "row",
                                margin: 10
                              }}
                            >
                              <IconComment
                                color="#fff"
                                width={20}
                                height={20}
                              />
                              <UIText
                                style={{
                                  color: "#fff",
                                  fontSize: 16,
                                  paddingLeft: 10
                                }}
                              >
                                Chat Pribadi
                              </UIText>
                            </View>
                          )}
                          <View
                            style={{
                              marginTop: 10,
                              borderWidth: 0,
                              borderColor: "#fff",
                              borderTopWidth: 1,
                              paddingTop: 10
                            }}
                          >
                            <UIText
                              style={{
                                color: "#fff",
                                fontSize: 13
                              }}
                            >
                              {item.description}
                            </UIText>
                          </View>
                        </View>
                      </UICardBody>
                    </UIGradient>
                  </UICard>
                </Button>
              );
            })}
          </ScrollView>
        </UIBody>
      </UIContainer>
    );
  })
);
