/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip
} from "@mantine/core";
import {
  useDebouncedState,
  useLocalStorage,
  useShallowEffect
} from "@mantine/hooks";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
  AiOutlineBorderHorizontal,
  AiOutlineBorderVerticle,
  AiOutlineClear,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineRotateLeft,
  AiOutlineSplitCells
} from "react-icons/ai";
import { TbArrowsDiagonalMinimize, TbReload } from "react-icons/tb";
import { parse } from "tldts";
import { v4 } from "uuid";

type DataComponent = {
  id: string;
  vertical?: boolean;
  minSize?: number;
  size?: number;
  children?: DataComponent[];
  url?: string;
  visible?: boolean;
};

const dataComponent: DataComponent = {
  id: v4(),
  vertical: false,
  minSize: 100,
  children: [
    {
      id: v4(),
      size: 300,
      url: "https://raven-stone2.wibudev.com/",
      visible: true
    },
    {
      id: v4(),
      size: 100,
      url: "https://ninox-fox.wibudev.com/",
      visible: true
    }
  ]
};

function updateUrl(
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

function updateSizes(
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

function deleteItem(component: DataComponent, dataId: string): DataComponent {
  if (!component.children) return component;

  // Filter out the child that matches dataId and map recursively for nested children
  const updatedChildren = component.children
    .filter((child) => child.id !== dataId)
    .map((child) => deleteItem(child, dataId));

  return { ...component, children: updatedChildren };
}

function addItemVertical(
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
      vertical: true,
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
      addItemVertical(child, dataId)
    );
    return { ...component, children: updatedChildren };
  }

  return component;
}

function addItemHorizontal(
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

function findParentId(component: DataComponent, dataId: string): string | null {
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

function appendItem(component: DataComponent, dataId: string): DataComponent {
  const idParent = findParentId(component, dataId);
  if (component.id === idParent) {
    const newItem: DataComponent = {
      id: v4(),
      size: 100,
      url: "https://example.com"
    };
    return { ...component, children: [...(component.children || []), newItem] };
  } else if (component.children) {
    const updatedChildren = component.children.map((child) =>
      appendItem(child, dataId)
    );
    return { ...component, children: updatedChildren };
  }
  return component;
}

function toggleDirection(
  component: DataComponent,
  dataId: string
): DataComponent {
  const idParent = findParentId(component, dataId);
  if (component.id === idParent) {
    return { ...component, vertical: !component.vertical };
  } else if (component.children) {
    const updatedChildren = component.children.map((child) =>
      toggleDirection(child, dataId)
    );
    return { ...component, children: updatedChildren };
  }
  return component;
}

function updateVisible(
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

function reloadUrl(component: DataComponent, dataId: string): DataComponent {
  if (component.id === dataId) {
    // Set component visibility to false jika sesuai dengan `dataId`
    return { ...component, url: component.url + "?reload=" + v4() };
  }

  if (component.children) {
    // Rekursif untuk memperbarui visibility dari semua child jika mereka ada
    const updatedChildren = component.children.map((child) =>
      reloadUrl(child, dataId)
    );
    return { ...component, children: updatedChildren };
  }

  return component;
}

function getListUnvisibleItem(
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

function getNameUrl(url: string) {
  const parsed = parse(url);
  return parsed.subdomain ? parsed.subdomain : parsed.domain || "no name";
}

export function WibuDock() {
  const [dataLocal, setDataLocal] = useLocalStorage<any>({
    key: "data_component",
    defaultValue: null
  });
  const [showPanel, setShowPanel] = useLocalStorage<boolean>({
    key: "show_panel",
    defaultValue: true
  });

  const [keyId, setKeyId] = useState(_.random(1000, 9999));
  const [isDesktop, setIsDesktop] = useState(true);
  const [listDataUnvisible, setListDataUnvisible] = useState<
    { id: string; url: string }[]
  >([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Misalkan, ukuran di bawah 1024px dianggap mobile
        setIsDesktop(false);
      } else {
        setIsDesktop(true);
      }
    };

    // Cek ukuran layar saat pertama kali dimuat
    handleResize();

    // Tambahkan event listener untuk memantau perubahan ukuran layar
    window.addEventListener("resize", handleResize);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useShallowEffect(() => {
    if (dataLocal) {
      const listUnvisibleItem = getListUnvisibleItem(dataLocal);
      setListDataUnvisible(listUnvisibleItem);
    }

    const load = setTimeout(() => {
      if (!dataLocal) {
        setDataLocal(_.cloneDeep(dataComponent));
      }
    }, 2000);

    return () => clearTimeout(load);
  }, [dataLocal]);

  function onResetData() {
    setDataLocal(_.cloneDeep(dataComponent));
    setKeyId(_.random(1000, 9999));
  }

  function onShowPanel() {
    setShowPanel(!showPanel);
  }

  if (!dataLocal) {
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (!isDesktop) {
    return (
      <Center p={"lg"}>
        <Box w={"60%"}>
          <Stack align="center" justify="center">
            <Image
              radius={"lg"}
              w={"100%"}
              src={"/assets/desktop-only.png"}
              alt="desktop-only"
            />
            <Title>DESKTOP ONLY! ...</Title>
            <Loader />
          </Stack>
        </Box>
      </Center>
    );
  }
  return (
    <Stack h={"100vh"} w={"100vw"} pos={"fixed"} gap={0}>
      <Flex justify={"space-between"} bg={"dark"} p={4}>
        <Text>Wibu Dock</Text>
        <Flex gap={"xs"}>
          {listDataUnvisible.map((item) => (
            <Button
              onClick={() => {
                const updateData = updateVisible(dataLocal, item.id, true);
                setDataLocal(updateData);
              }}
              c={"white"}
              size="compact-xs"
              key={item.id}
              variant="subtle"
            >
              {getNameUrl(item.url)}
            </Button>
          ))}
        </Flex>
        <Flex>
          <ActionIcon onClick={onShowPanel} variant="transparent" color="white">
            <Tooltip
              label={"show / hide"}
              openDelay={500}
              color="dark"
              withArrow
            >
              <AiOutlineEye />
            </Tooltip>
          </ActionIcon>
          <ActionIcon onClick={onResetData} variant="transparent" color="white">
            <Tooltip label={"reset"} openDelay={500} color="dark" withArrow>
              <AiOutlineClear />
            </Tooltip>
          </ActionIcon>
        </Flex>
      </Flex>
      <Divider h={1} />
      <Component
        toggleDirection={(id) => {
          const updateData = toggleDirection(dataLocal, id);
          setDataLocal(updateData);
          setKeyId(_.random(1000, 9999));
        }}
        key={keyId}
        showPanel={showPanel}
        ondelete={(id) => {
          const updateData = deleteItem(dataLocal, id);
          setDataLocal(updateData);
        }}
        onDragEnd={(size, id) => {
          const updateData = updateSizes(dataLocal, id, size);
          setDataLocal(updateData);
        }}
        data={dataLocal}
        rawData={dataLocal}
        setDataLocal={setDataLocal}
        onAppendItem={(id) => {
          const updateData = appendItem(dataLocal, id);
          // console.log(JSON.stringify(updateData, null,2))
          setDataLocal(updateData);
        }}
        addItemVertical={(id) => {
          const updateData = addItemVertical(dataLocal, id);
          setDataLocal(updateData);
        }}
        addItemHorizontal={(id) => {
          const updateData = addItemHorizontal(dataLocal, id);
          setDataLocal(updateData);
        }}
        updateUrl={(id, url) => {
          const updateData = updateUrl(dataLocal, id, url);
          setDataLocal(updateData);
        }}
        onMinimize={(id) => {
          console.log("onMinimize", id);
          const updateData = updateVisible(dataLocal, id, false);
          setDataLocal(updateData);
          // setKeyId(_.random(1000, 9999));
        }}
        onReloadUrl={(id) => {
          const updateData = reloadUrl(dataLocal, id);
          // console.log(JSON.stringify(updateData, null, 2));
          setDataLocal(updateData);
        }}
      />
    </Stack>
  );
}

function Component({
  showPanel,
  data,
  rawData,
  setDataLocal,
  onDragEnd,
  ondelete,
  onAppendItem,
  toggleDirection,
  addItemVertical,
  addItemHorizontal,
  updateUrl,
  onMinimize,
  onReloadUrl
}: {
  showPanel: boolean;
  data: DataComponent;
  rawData: DataComponent;
  onDragEnd: (sizes: number[], id: string) => void;
  setDataLocal: (
    val: DataComponent | ((prevState: DataComponent) => DataComponent)
  ) => void;
  ondelete: (id: string) => void;
  onAppendItem: (id: string) => void;
  toggleDirection: (id: string) => void;
  addItemVertical: (id: string) => void;
  addItemHorizontal: (id: string) => void;
  updateUrl: (id: string, url: string) => void;
  onMinimize: (id: string) => void;
  onReloadUrl: (id: string) => void;
}) {
  const [toggleUpdateUrl, setToggleUpdateUrl] = useState(false);
  const [formUrl, setFormUrl] = useDebouncedState(data.url, 300);

  useShallowEffect(() => {
    if (formUrl && formUrl !== data.url) {
      updateUrl(data.id, formUrl);
    }
  }, [formUrl]);
  return (
    <Allotment
      minSize={50}
      defaultSizes={data.children?.map((item) => item.size || 100)}
      vertical={data.vertical}
      onDragEnd={(sizes: number[]) => onDragEnd(sizes, data.id)}
    >
      {data.children && data.children.length > 0 ? (
        data.children.map((item: DataComponent) => (
          <Allotment.Pane key={item.id} snap={false} visible={item.visible}>
            <Component
              onMinimize={onMinimize}
              toggleDirection={(id) => toggleDirection(id)}
              showPanel={showPanel}
              rawData={rawData}
              ondelete={(id) => ondelete(id)}
              onDragEnd={(sizes) => onDragEnd(sizes, item.id)}
              data={item}
              setDataLocal={setDataLocal}
              onAppendItem={(id) => onAppendItem(id)}
              addItemVertical={(id) => addItemVertical(id)}
              addItemHorizontal={(id) => addItemHorizontal(id)}
              updateUrl={(id, url) => updateUrl(id, url)}
              onReloadUrl={onReloadUrl}
            />
          </Allotment.Pane>
        ))
      ) : (
        <Stack h={"100%"} w={"100%"} gap={0}>
          <Flex
            w={"100%"}
            bg={"dark"}
            display={showPanel ? "flex" : "none"}
            justify={"space-between"}
            p={"4"}
          >
            <Flex flex={1}>
              <TextInput
                size="xs"
                display={toggleUpdateUrl ? "flex" : "none"}
                defaultValue={data.url}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue && newValue !== data.url) {
                    setFormUrl(newValue); // update formUrl setelah delay
                  }
                }}
              />
            </Flex>
            <Flex>
              <ActionIcon
                onClick={() => onReloadUrl(data.id)}
                variant="transparent"
                color="white"
              >
                <Tooltip
                  label={"reload"}
                  openDelay={500}
                  color="dark"
                  withArrow
                >
                  <TbReload />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                onClick={() => onMinimize(data.id)}
                variant="transparent"
                color="white"
              >
                <Tooltip
                  label={"minimize"}
                  openDelay={500}
                  color="dark"
                  withArrow
                >
                  <TbArrowsDiagonalMinimize />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                onClick={() => toggleDirection(data.id)}
                variant="transparent"
                color="white"
              >
                <Tooltip
                  label={"toggle direction"}
                  openDelay={500}
                  color="dark"
                  withArrow
                >
                  <AiOutlineRotateLeft />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                onClick={() => onAppendItem(data.id)}
                variant="transparent"
                color="white"
              >
                <Tooltip label={"split"} openDelay={500} color="dark" withArrow>
                  <AiOutlineSplitCells />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="white"
                onClick={() => addItemVertical(data.id)}
              >
                <Tooltip
                  label={"add data vertical"}
                  openDelay={500}
                  color="dark"
                  withArrow
                >
                  <AiOutlineBorderVerticle />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="white"
                onClick={() => addItemHorizontal(data.id)}
              >
                <Tooltip
                  label={"add data horizontal"}
                  openDelay={500}
                  color="dark"
                  withArrow
                >
                  <AiOutlineBorderHorizontal />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="white"
                onClick={() => setToggleUpdateUrl(!toggleUpdateUrl)}
              >
                <Tooltip label="Edit" openDelay={500} color="dark" withArrow>
                  <AiOutlineEdit />
                </Tooltip>
              </ActionIcon>
              <ActionIcon
                onClick={() => ondelete(data.id)}
                variant="transparent"
                color="white"
              >
                <Tooltip label="Delete" openDelay={500} color="dark" withArrow>
                  <AiOutlineClose />
                </Tooltip>
              </ActionIcon>
            </Flex>
          </Flex>
          <iframe
            style={{
              border: "none"
            }}
            src={data.url}
            width={"100%"}
            height={"100%"}
            allow="camera; microphone"
          />
          {/* <ScrollArea.Autosize>
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </ScrollArea.Autosize> */}
        </Stack>
      )}
    </Allotment>
  );
}
