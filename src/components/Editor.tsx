import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useState } from "react";
import { Alert, Box, Stack, Text } from "@chakra-ui/react";

interface HTMLEditorProps {
  name: string;
  value?: string;
  onChange?: (el: HTMLElement) => void;
  mode: "html" | "javascript";
  theme: "monokai" | "github";
  readonly?: boolean;
  height?: string;
}
export const Editor: React.FC<HTMLEditorProps> = ({
  name,
  value,
  onChange,
  mode,
  theme,
  readonly,
  height,
}) => {
  const [error, setError] = useState<string | null>(null);
  const handleChange = (value: string) => {
    if (mode === "javascript") return;
    const parser = new DOMParser();
    try {
      const doc = parser.parseFromString(value, "text/html");
      const el = doc.body.firstElementChild;
      if (el instanceof HTMLElement) {
        onChange?.(el);
      } else {
        throw new Error("Invalid HTML");
      }
    } catch (error) {
      setError("HTMLの形式が正しくありません");
    }
  };
  return (
    <Stack>
      {error && <Alert status="error">{error}</Alert>}
      <Box>
        <Text size="xs" color="gray.500">
          {mode}
        </Text>
        <AceEditor
          height={height}
          width="auto"
          mode={mode}
          theme={theme}
          value={value}
          onChange={handleChange}
          name={name}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
          debounceChangePeriod={500}
          readOnly={readonly}
        />
      </Box>
    </Stack>
  );
};
