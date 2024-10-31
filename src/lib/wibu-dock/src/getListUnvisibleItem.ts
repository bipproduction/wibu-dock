import { DataComponent } from "@/types/DataComponent";

export function getListUnvisibleItem(
    component: DataComponent
  ): { id: string; url: string }[] {
    // Initialize an array to collect unvisible items
    const unvisibleItems: { id: string; url: string }[] = [];
  
    // Helper function to process each component recursively
    function findUnvisibleItems(comp: DataComponent) {
      // If the component has children, iterate over them
      if (comp.children) {
        for (const child of comp.children) {
          // Check if the child is visible or not
          if (!child.visible) {
            unvisibleItems.push({ id: child.id, url: child.url || "no url" });
          }
          // If the child itself has children, call recursively
          if ("children" in child) {
            findUnvisibleItems(child as DataComponent);
          }
        }
      }
    }
  
    // Start the recursive search with the provided component
    findUnvisibleItems(component);
  
    return unvisibleItems;
  }