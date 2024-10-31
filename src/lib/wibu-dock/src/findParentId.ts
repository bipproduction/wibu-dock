import { DataComponent } from "@/types/DataComponent";

export function findParentId(component: DataComponent, dataId: string): string | null {
    if (!component.children) return null;
  
    for (const child of component.children) {
      if (child.id === dataId) {
        return component.id;
      }
  
      const parentId = findParentId(child, dataId);
      if (parentId) {
        return parentId;
      }
    }
    return null;
  }