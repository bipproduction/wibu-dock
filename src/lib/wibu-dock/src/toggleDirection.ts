import { DataComponent } from "@/types/DataComponent";
import { findParentId } from "./findParentId";

export function toggleDirection(
    component: DataComponent,
    dataId: string
  ): DataComponent {
    const idParent = findParentId(component, dataId);
    if (component.id === idParent) {
      return { ...component, vertical: !component.vertical };
    } else if (component.children) {
      const updatedChildren = component.children.map((child) =>
        toggleDirection(child, dataId)
      );
      return { ...component, children: updatedChildren };
    }
    return component;
  }