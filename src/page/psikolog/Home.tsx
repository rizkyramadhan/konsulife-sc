import UIBody from "@app/libs/ui/UIBody";
import UIContainer from "@app/libs/ui/UIContainer";
import React from "react";
import UIList from "@app/libs/ui/UIList";
import { psikolog } from "@app/storage/psikolog";
import { observer } from "mobx-react-lite";

export default observer(() => {
  return (
    <UIContainer>
      <UIBody>
        <UIList primaryKey={"id"} items={psikolog.jadwal} 
        />
      </UIBody>
    </UIContainer>
  );
});
