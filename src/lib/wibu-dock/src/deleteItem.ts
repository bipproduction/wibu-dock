import { DataComponent } from "@/types/DataComponent";

export function deleteItem(component: DataComponent, dataId: string): DataComponent {
    if (!component.children) return component;
  
    // Filter out the child that matches dataId and map recursively for nested children
    const updatedChildren = component.children
      .filter((child) => child.id !== dataId)
      .map((child) => deleteItem(child, dataId));
  
    return { ...component, children: updatedChildren };
  }