import { DataComponent } from "@/types/DataComponent";
import { findParentId } from "./findParentId";
import { v4 } from "uuid";

export function appendItem(component: DataComponent, dataId: string): DataComponent {
    const idParent = findParentId(component, dataId);
    if (component.id === idParent) {
      const newItem: DataComponent = {
        id: v4(),
        size: 100,
        url: "https://example.com"
      };
      return { ...component, children: [...(component.children || []), newItem] };
    } else if (component.children) {
      const updatedChildren = component.children.map((child) =>
        appendItem(child, dataId)
      );
      return { ...component, children: updatedChildren };
    }
    return component;
  }