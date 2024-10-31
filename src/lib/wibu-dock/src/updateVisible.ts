import { DataComponent } from "@/types/DataComponent";

export function updateVisible(
    component: DataComponent,
    dataId: string,
    visible: boolean
  ): DataComponent {
    if (component.id === dataId) {
      // Set component visibility to false jika sesuai dengan `dataId`
      return { ...component, visible };
    }
  
    if (component.children) {
      // Rekursif untuk memperbarui visibility dari semua child jika mereka ada
      const updatedChildren = component.children.map((child) =>
        updateVisible(child, dataId, visible)
      );
      return { ...component, children: updatedChildren };
    }
  
    return component;
  }