/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataComponent } from "@/types/DataComponent";
import {
    ActionIcon,
    Button,
    Flex,
    Group,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import { MdClose } from "react-icons/md";

function updateUrls(
  component: DataComponent,
  dataId: string,
  url: string
): DataComponent {
  if (component.id === dataId) {
    component.urls = component.urls
      ? component.urls.includes(url)
        ? component.urls
        : [...component.urls, url]
      : [url];
    return { ...component };
  } else if (component.children) {
    // Perbarui children secara rekursif
    const updatedChildren = component.children.map((child) =>
      updateUrls(child, dataId, url)
    );
    return { ...component, children: updatedChildren };
  }

  return component;
}

function deleteItemUrls(
  component: DataComponent,
  dataId: string,
  url: string
): DataComponent {
  // Cek apakah ID komponen cocok dengan dataId yang ingin dihapus
  if (component.id === dataId && component.urls) {
    // Hapus URL dari array URLs
    component.urls = component.urls.filter(
      (existingUrl) => existingUrl !== url
    );
    return { ...component };
  } else if (component.children) {
    // Jika ada children, periksa mereka secara rekursif
    const updatedChildren = component.children.map((child) =>
      deleteItemUrls(child, dataId, url)
    );
    return { ...component, children: updatedChildren };
  }

  // Jika tidak ada perubahan, kembalikan komponen tanpa modifikasi
  return component;
}

function findUrls(component: DataComponent, dataId: string): string[] {
  // Jika komponen memiliki dataId yang cocok, kembalikan urls jika ada
  if (component.id === dataId) {
    return component.urls ?? [];
  }

  // Jika tidak, periksa setiap children secara rekursif
  if (component.children) {
    for (const child of component.children) {
      const foundUrls = findUrls(child, dataId);
      if (foundUrls.length > 0) {
        return foundUrls;
      }
    }
  }

  // Jika tidak ditemukan, kembalikan array kosong
  return [];
}

export function AddMultipleUrl({
  component,
  data,
  setDataLocal
}: {
  component: DataComponent;
  data: Record<string, string>;
  setDataLocal: (val: any) => void;
}) {
  const [form, setForm] = useState("");
  const [urls, setUrls] = useState<string[]>(findUrls(component, data.id));

  useShallowEffect(() => {
    updateSetUrls()
  }, [form]);

  function updateSetUrls(){
    setUrls(findUrls(component, data.id));
  }

  function onSave() {
    if (form === "") return alert("URL cannot be empty");
    const dataUpdate = updateUrls(component, data.id, form);
    setDataLocal(dataUpdate);
    setForm("");
  }

  function onDeleteItemUrl(url: string) {
    const dataUpdate = deleteItemUrls(component, data.id, url);
    setDataLocal(dataUpdate);
    updateSetUrls();
  }
  return (
    <Stack>
      <Flex wrap={"wrap"} gap={"md"}>
        {urls.map((url) => (
          <Flex key={url}>
            <Text>{url}</Text>
            <ActionIcon
              onClick={() => onDeleteItemUrl(url)}
              radius={100}
              variant="subtle"
            >
              <MdClose />
            </ActionIcon>
          </Flex>
        ))}
      </Flex>
      <TextInput
        value={form}
        onChange={(e) => setForm(e.target.value)}
        label="URL"
        placeholder="https://example.com"
      />
      <Group justify="end">
        <Button onClick={onSave} variant="subtle" size="compact-xs">
          Add
        </Button>
      </Group>
    </Stack>
  );
}
