import { Editor } from "@/components/Editor";
import {
  Box,
  Collapse,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  chakra,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

interface ToogleFavoriteEventTargetOption {
  selector?: string | null;
  shadowRootSelector?: string | null;
  reRegisterAfterEvent?: boolean;
  observeMount?: string;
  once?: boolean;
  delay?: number;
  nativeEvent: "click";
  registerAfterEvent?: {
    selector: string;
    nativeEvent: string;
  };
  stateAttr?: "class" | "aria" | "data";
  stateKey?: string;
  datasetProductKey?: string;
  datasetVariantKey?: string;
}

export interface FormAndPreviewProps {
  classNames: string[];
  onlyInFavClassNames: string[];
  ariaSelectors: string[];
  ariaKeys: string[];
  ariaMap: Map<string, string[]>;
  onlyInFavAriaKeys: string[];
  dataSelectors: string[];
  datasetKeys: string[];
  datasetMap: Map<string, string[]>;
  onlyInFavDatasetKeys: string[];
  hasTrackid?: boolean;
}

export const FormAndPreview: React.FC<FormAndPreviewProps> = ({
  classNames,
  onlyInFavClassNames,
  ariaSelectors,
  ariaKeys,
  onlyInFavAriaKeys,
  dataSelectors,
  datasetKeys,
  onlyInFavDatasetKeys,
  hasTrackid,
}) => {
  const [settings, setSettings] = useState<ToogleFavoriteEventTargetOption>({
    selector: hasTrackid ? "" : classNames[0] ?? "",
    nativeEvent: "click",
  });
  const [shouldRegisterAfterEvent, setShouldRegisterAfterEvent] =
    useState(false);
  const stateKeyOptions = useMemo(() => {
    if (settings.stateAttr === "class") {
      return onlyInFavClassNames;
    }
    if (settings.stateAttr === "data") {
      return onlyInFavDatasetKeys;
    }
    if (settings.stateAttr === "aria") {
      return onlyInFavAriaKeys;
    }
    return [];
  }, [
    settings.stateAttr,
    onlyInFavAriaKeys,
    onlyInFavDatasetKeys,
    onlyInFavClassNames,
  ]);

  const javascriptCode = useMemo(() => {
    const optionalFields = [
      settings.reRegisterAfterEvent && "        reRegisterAfterEvent: true,\n",
      settings.once && "        once: true,\n",
      settings.observeMount &&
        `        observeMount: "${settings.observeMount}",\n`,
      settings.delay && `        delay: ${settings.delay},\n`,
      shouldRegisterAfterEvent &&
        `        registerAfterEvent: { 
          selector: "${settings.registerAfterEvent?.selector ?? ""}", 
          nativeEvent: "${settings.registerAfterEvent?.nativeEvent ?? ""}",
        },\n`,
      settings.shadowRootSelector &&
        `        shadowRootSelector: "${settings.shadowRootSelector}",\n`,
    ]
      .filter((v) => !!v)
      .join("")
      .trim();
    return `
const CUSTOM_EVENTS = {
  // ...
  sh_toggle_favorite: {
    nativeEvent: ${settings.nativeEvent},
    defaultSelector: "[data-trackid=toggle_favorite]",
    targets: [
      {
        selector: "${settings.selector ?? ""}",
        state: {
          attr: "${settings.stateAttr ?? ""}",
          key: "${settings.stateKey ?? ""}",
        },
        datasetProductKey: "${settings.datasetProductKey ?? ""}",
        datasetVariantKey: "${settings.datasetVariantKey ?? ""}",
        ${optionalFields}
      },
    ],
    getCallback: makeToggleFavoriteHandler,
  },
  // ...
},
    `;
  }, [settings, shouldRegisterAfterEvent]);

  return (
    <SimpleGrid columns={2} gap={8}>
      <Grid templateColumns={"max-content minmax(0,1fr)"}>
        <Box borderBottomWidth={1} px={1} py={2}>
          Selector
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Select
            size="sm"
            value={settings.selector ?? ""}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                selector: e.target.value,
              }));
            }}
            isDisabled={hasTrackid}
            sx={{
              '&:has(option[value=""]:checked)': { color: "gray.500" },
              "& option[value='']": { color: "gray.500" },
              "& :not(option[value=''])": { color: "gray.800" },
            }}
          >
            {[
              ...classNames.map((c) => `.${c}`),
              ...dataSelectors,
              ...ariaSelectors,
            ].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </Select>
          {hasTrackid && <p>trackidが存在するため、selectorの指定は不要です</p>}
        </Box>

        <Box borderBottomWidth={1} px={1} py={2}>
          shadowRootSelector
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Input
            size="sm"
            value={settings.shadowRootSelector ?? ""}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                shadowRootSelector: e.target.value || undefined,
              }));
            }}
            placeholder={".my-shadow-root"}
          />
        </Box>

        <Box borderBottomWidth={1} px={1} py={2}>
          state
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Stack>
            <HStack>
              <p>attr:</p>
              <Select
                size="sm"
                value={settings.stateAttr ?? ""}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    stateAttr:
                      (e.target.value as "class" | "aria" | "data") ||
                      undefined,
                    stateKey: undefined,
                  }));
                }}
                sx={{
                  '&:has(option[value=""]:checked)': { color: "gray.500" },
                  "& option[value='']": { color: "gray.500" },
                  "& :not(option[value=''])": { color: "gray.800" },
                }}
              >
                <chakra.option value="" color="gray.500">
                  Select...(optional)
                </chakra.option>
                {["class", "aria", "data"].map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </HStack>
            <HStack>
              <p>key:</p>
              <Select
                size="sm"
                value={settings.stateKey ?? ""}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    stateKey: e.target.value || undefined,
                  }));
                }}
                placeholder="Select...(optional)"
                sx={{
                  '&:has(option[value=""]:checked)': { color: "gray.500" },
                  "& option[value='']": { color: "gray.500" },
                  "& :not(option[value=''])": { color: "gray.800" },
                }}
              >
                {stateKeyOptions.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </Select>
            </HStack>
          </Stack>
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          datasetProductKey
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Select
            size="sm"
            value={settings.datasetProductKey ?? ""}
            placeholder="Select...(optional)"
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                datasetProductKey: e.target.value || undefined,
              }));
            }}
            sx={{
              '&:has(option[value=""]:checked)': { color: "gray.500" },
              "& option[value='']": { color: "gray.500" },
              "& :not(option[value=''])": { color: "gray.800" },
            }}
          >
            {datasetKeys.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </Select>
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          datasetVariantKey
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Select
            size="sm"
            value={settings.datasetVariantKey ?? ""}
            placeholder="Select...(optional)"
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                datasetVariantKey: e.target.value || undefined,
              }));
            }}
            sx={{
              '&:has(option[value=""]:checked)': { color: "gray.500" },
              "& option[value='']": { color: "gray.500" },
              "& :not(option[value=''])": { color: "gray.800" },
            }}
          >
            {datasetKeys.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </Select>
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          reRegisterAfterEvent
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <input
            type="checkbox"
            checked={!!settings.reRegisterAfterEvent}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                reRegisterAfterEvent: e.target.checked || undefined,
              }));
            }}
          />
          <Text mt={1} color="gray.500" fontSize="xs">
            初回のクリックイベントは取れたけど、2回目以降が取れない場合は使用してみてください
          </Text>
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          once
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <input
            type="checkbox"
            checked={!!settings.once}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                once: e.target.checked || undefined,
              }));
            }}
          />
          <Text mt={1} color="gray.500" fontSize="xs">
            CTAのフォーム送信など、同じページ上で一度きりイベントを取得したい場合に使用します
          </Text>
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          observeMount
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Input
            size="sm"
            value={settings.observeMount ?? ""}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                observeMount: e.target.value || undefined,
              }));
            }}
            placeholder=".target-container"
          />
          <Text mt={1} color="gray.500" fontSize="xs">
            {`ターゲット要素がいつ出現するか分からない（モーダルなど）場合、ページロード時に存在していて、ターゲット要素を包含する要素を指定します（もし都合の良い要素が見つからない場合は\`body\` を指定します)`}
          </Text>
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          delay
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Input
            size="sm"
            type="number"
            value={settings.delay ?? ""}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                delay: e.target.value ? Number(e.target.value) : undefined,
              }));
            }}
            placeholder="1000"
          />
          <Text mt={1} color="gray.500" fontSize="xs">
            {`ターゲット要素がページロードから少し遅れて現れる場合、delayにミリ秒を指定してみてください`}
          </Text>
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          registerAfterEvent
        </Box>
        <Box borderBottomWidth={1} px={1} py={2}>
          <Stack>
            <FormControl display="flex" alignItems="center">
              <FormLabel
                htmlFor="shouldRegisterAfterMount"
                mb="0"
                fontSize={"sm"}
              >
                Enable registerAfterMount?
              </FormLabel>
              <Switch
                id="shouldRegisterAfterMount"
                isChecked={shouldRegisterAfterEvent}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setShouldRegisterAfterEvent(checked);
                  if (!checked) {
                    setSettings((prev) => {
                      const { registerAfterEvent, ...rest } = prev;
                      return rest;
                    });
                  } else {
                    setSettings((prev) => ({
                      ...prev,
                      registerAfterEvent: {
                        selector: "",
                        nativeEvent: "click",
                      },
                    }));
                  }
                }}
              />
            </FormControl>
            <Text mt={1} color="gray.500" fontSize="xs">
              {`何かをクリックした時に出現する要素をターゲットとしたい場合に、クリック対象の要素を registerAfterEvent に指定します`}
            </Text>
            <Collapse in={shouldRegisterAfterEvent} animateOpacity>
              <Stack>
                <HStack>
                  <p>Selector</p>
                  <Input
                    size="sm"
                    value={settings.registerAfterEvent?.selector ?? ""}
                    onChange={(e) => {
                      setSettings((prev) => ({
                        ...prev,
                        registerAfterEvent: {
                          selector: e.target.value,
                          nativeEvent:
                            prev.registerAfterEvent?.nativeEvent ?? "",
                        },
                      }));
                    }}
                    placeholder=".my-trigger"
                  />
                </HStack>
                <HStack>
                  <p>nativeEvent</p>
                  <Input
                    size="sm"
                    value={settings.registerAfterEvent?.nativeEvent ?? ""}
                    onChange={(e) => {
                      setSettings((prev) => ({
                        ...prev,
                        registerAfterEvent: {
                          selector: prev.registerAfterEvent?.selector ?? "",
                          nativeEvent: e.target.value,
                        },
                      }));
                    }}
                  />
                </HStack>
              </Stack>
            </Collapse>
          </Stack>
        </Box>
      </Grid>
      <Editor
        mode="javascript"
        theme="monokai"
        name="settings"
        readonly
        value={javascriptCode}
      />
    </SimpleGrid>
  );
};
