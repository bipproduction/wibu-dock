import { DataComponent } from "@/types/DataComponent";

export function updateUrl(
    component: DataComponent,
    dataId: string,
    url: string
  ): DataComponent {
    if (component.id === dataId) {
      return { ...component, url: url };
    }
  
    // Jika komponen memiliki children, lakukan rekursi untuk memperbarui URL di children
    if (component.children) {
      const updatedChildren = component.children.map((child) =>
        updateUrl(child, dataId, url)
      );
      return { ...component, children: updatedChildren };
    }
  
    // Jika tidak ada yang cocok, kembalikan komponen tanpa perubahan
    return component;
  }