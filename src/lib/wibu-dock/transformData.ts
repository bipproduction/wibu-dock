
interface DataComponent {
  id: string;
  vertical: boolean;
  minSize: number;
  children: Array<{
    id: string;
    size: number;
    url: string;
    visible: boolean;
  }>;
}

interface TransformedComponent {
  value: string;
  label: string;
  children?: TransformedComponent[];
}

// Fungsi untuk mendapatkan path dari URL
function extractPathFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(".com", "");
  } catch {
    return url;
  }
}

// Fungsi utama untuk mengonversi dataComponent
export function transformDataComponent(data: DataComponent): TransformedComponent {
  const root: TransformedComponent = {
    value: "src",
    label: "src",
    children: data.children.map((child) => ({
      value: `src/${extractPathFromUrl(child.url)}`,
      label: extractPathFromUrl(child.url),
    })),
  };
  return root;
}


