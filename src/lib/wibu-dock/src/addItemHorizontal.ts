import { DataComponent } from "@/types/DataComponent";
import { findParentId } from "./findParentId";
import { v4 } from "uuid";

export function addItemHorizontal(
    component: DataComponent,
    dataId: string
  ): DataComponent {
    const parentId = findParentId(component, dataId);
  
    // Pastikan bahwa kita menemukan parent dari dataId
    if (component.id === parentId && component.children) {
      // Temukan item yang sesuai dengan dataId
      const existingItem = component.children.find(
        (child) => child.id === dataId
      );
  
      // Jika item tidak ditemukan, return tanpa perubahan
      if (!existingItem) return component;
  
      // Hapus item berdasarkan dataId dari children yang ada
      const updatedChildren = component.children.filter(
        (child) => child.id !== dataId
      );
  
      // Buat item baru yang berisi existingItem dan item baru
      const newItem: DataComponent = {
        id: v4(),
        vertical: false,
        size: 100,
        minSize: 100,
        children: [
          existingItem, // Pindahkan item yang ditemukan ke sini
          {
            id: v4(),
            size: 100,
            url: "https://wibu-example.ravenstone.cloud/"
          }
        ]
      };
  
      // Masukkan newItem ke dalam updatedChildren
      return { ...component, children: [...updatedChildren, newItem] };
    } else if (component.children) {
      // Jika bukan parent yang dicari, lakukan rekursi pada setiap child
      const updatedChildren = component.children.map((child) =>
        addItemHorizontal(child, dataId)
      );
      return { ...component, children: updatedChildren };
    }
  
    return component;
  }