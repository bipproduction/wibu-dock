import { DataComponent } from "@/types/DataComponent";
import { v4 } from "uuid";

export function reloadUrl(component: DataComponent, dataId: string): DataComponent {
    if (component.id === dataId) {
      // Set component visibility to false jika sesuai dengan `dataId`
      return { ...component, url: component.url + "?reload=" + v4() };
    }
  
    if (component.children) {
      // Rekursif untuk memperbarui visibility dari semua child jika mereka ada
      const updatedChildren = component.children.map((child) =>
        reloadUrl(child, dataId)
      );
      return { ...component, children: updatedChildren };
    }
  
    return component;
  }