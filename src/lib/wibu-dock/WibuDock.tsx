/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { DataComponent } from "@/types/DataComponent";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Flex,
  Image,
  Loader,
  Menu,
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
import { BiDotsVertical } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { TbArrowsDiagonalMinimize, TbReload } from "react-icons/tb";
import { AddMultipleUrl } from "./component/AddMultipleUrl";
import { addItemHorizontal } from "./src/addItemHorizontal";
import { addItemVertical } from "./src/addItemVertical";
import { appendItem } from "./src/appendItem";
import { dataComponent } from "./src/dataComponent";
import { deleteItem } from "./src/deleteItem";
import { getListUnvisibleItem } from "./src/getListUnvisibleItem";
import { getNameUrl } from "./src/getNameUrl";
import { reloadUrl } from "./src/reloadUrl";
import { toggleDirection } from "./src/toggleDirection";
import { updateSizes } from "./src/updateSize";
import { updateUrl } from "./src/updateUrl";
import { updateVisible } from "./src/updateVisible";

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

  const [dataMainPanel, setDataMainPanel] = useState<Record<
    string,
    string
  > | null>(null);

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

        <Flex gap={"xs"} pos={"relative"}>
          <Center>
            <Card
              shadow="md"
              withBorder
              display={dataMainPanel ? "flex" : "none"}
              top={20}
              bg={"#333"}
              pos={"absolute"}
              maw={720}
              miw={460}
              style={{
                zIndex: 999
              }}
            >
              <Stack>
                <Flex justify={"space-between"}>
                  <Text>{dataMainPanel?.name}</Text>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => {
                      setDataMainPanel(null);
                    }}
                  >
                    <AiOutlineClose />
                  </ActionIcon>
                </Flex>
                {dataMainPanel?.name === "add-multiple-url" && (
                  <AddMultipleUrl
                    component={dataLocal}
                    data={dataMainPanel}
                    setDataLocal={setDataLocal}
                  />
                )}
              </Stack>
            </Card>
          </Center>
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
        onAddMultiple={(id) => {
          setDataMainPanel({
            name: "add-multiple-url",
            id: id
          });
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
  onReloadUrl,
  onAddMultiple
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
  onAddMultiple: (id: string) => void;
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
              onAddMultiple={onAddMultiple}
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
            {data.urls &&
              data.urls.map((url) => (
                <Button
                  onClick={() => updateUrl(data.id, url)}
                  key={url}
                  variant="subtle"
                  size="compact-xs"
                >
                  {getNameUrl(url)}
                </Button>
              ))}
            <Flex flex={1}>
              <TextInput
                styles={{
                  wrapper: {
                    width: "100%"
                  }
                }}
                w={"100%"}
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
            <Menu>
              <Menu.Target>
                <ActionIcon variant="transparent" color="white">
                  <BiDotsVertical />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Stack>
                  <ActionIcon
                    variant="transparent"
                    color="white"
                    onClick={() => onAddMultiple(data.id)}
                  >
                    <Tooltip
                      label={"add multiple host"}
                      openDelay={500}
                      color="dark"
                      withArrow
                    >
                      <CgAdd />
                    </Tooltip>
                  </ActionIcon>
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
                    display={"none"}
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
                    <Tooltip
                      label={"split"}
                      openDelay={500}
                      color="dark"
                      withArrow
                    >
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
                    <Tooltip
                      label="Edit"
                      openDelay={500}
                      color="dark"
                      withArrow
                    >
                      <AiOutlineEdit />
                    </Tooltip>
                  </ActionIcon>
                </Stack>
              </Menu.Dropdown>
            </Menu>
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
