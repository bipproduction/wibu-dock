import { DataComponent } from "@/types/DataComponent";

export function updateSizes(
    component: DataComponent,
    dataId: string,
    sizes: number[]
  ): DataComponent {
    if (component.id === dataId && component.children) {
      // Buat salinan baru dari children dengan ukuran yang diperbarui
      const updatedChildren = component.children.map((child, index) => ({
        ...child,
        size: sizes[index] || child.size
      }));
  
      return { ...component, children: updatedChildren };
    } else if (component.children) {
      // Perbarui children secara rekursif
      const updatedChildren = component.children.map((child) =>
        updateSizes(child, dataId, sizes)
      );
      return { ...component, children: updatedChildren };
    }
  
    return component;
  }