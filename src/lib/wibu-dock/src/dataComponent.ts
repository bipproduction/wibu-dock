import { DataComponent } from "@/types/DataComponent";
import { v4 } from "uuid";

export const dataComponent: DataComponent = {
    id: v4(),
    vertical: false,
    minSize: 100,
    children: [
      {
        id: v4(),
        size: 300,
        url: "https://raven-stone2.wibudev.com/",
        urls: ["https://raven-stone2.wibudev.com/"],
        visible: true
      },
      {
        id: v4(),
        size: 100,
        url: "https://ninox-fox.wibudev.com/",
        visible: true
      }
    ]
  };