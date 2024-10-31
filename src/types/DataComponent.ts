export type DataComponent = {
    id: string;
    vertical?: boolean;
    minSize?: number;
    size?: number;
    children?: DataComponent[];
    url?: string;
    urls?: string[];
    visible?: boolean;
  };