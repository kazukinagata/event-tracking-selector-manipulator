import { Editor } from "@/components/Editor";
import { FormAndPreview } from "@/components/FormAndPreview";
import { Container, Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

export default function Home() {
  const [elements, setElements] = useState<{
    fav: HTMLElement | null;
    unfav: HTMLElement | null;
  }>({
    fav: null,
    unfav: null,
  });
  const [classNames, onlyInFavClassNames] = useMemo(() => {
    const favList = elements.fav ? Array.from(elements.fav.classList) : [];
    const unfavList = elements.unfav
      ? Array.from(elements.unfav.classList)
      : [];
    console.log(elements);
    const intersection = favList.filter((className) =>
      unfavList.includes(className)
    );
    const onlyInFav = favList.filter(
      (className) => !intersection.includes(className)
    );
    return [intersection, onlyInFav];
  }, [elements]);

  const datasetKeys = useMemo(() => {
    const fav = elements.fav ? elements.fav.dataset : {};
    const unfav = elements.unfav ? elements.unfav.dataset : {};
    const keys = Array.from(
      new Set([...Object.keys(fav), ...Object.keys(unfav)])
    );
    return keys;
  }, [elements]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const dataSelectors = useMemo(() => {
    const fav = elements.fav
      ? elements.fav
          .getAttributeNames()
          .filter((name) => name.startsWith("data-"))
          .flatMap((name) => {
            const val = elements.fav?.getAttribute(name);
            return val ? `[data-${name}="${val}"]` : [];
          })
      : [];
    const unfav = elements.unfav
      ? elements.unfav
          .getAttributeNames()
          .filter((name) => name.startsWith("data-"))
          .flatMap((name) => {
            const val = elements.unfav?.getAttribute(name);
            return val ? `[data-${name}="${val}"]` : [];
          })
      : [];

    return Array.from(new Set([...fav, ...unfav]));
  }, [elements]);

  const ariaNames = useMemo(() => {
    const fav = elements.fav
      ? Array.from(elements.fav.getAttributeNames())
          .filter((name) => name.startsWith("aria-"))
          .map((v) => v.replace("aria-", ""))
      : [];
    const unfav = elements.unfav
      ? Array.from(elements.unfav.getAttributeNames())
          .filter((name) => name.startsWith("aria-"))
          .map((v) => v.replace("aria-", ""))
      : [];
    return Array.from(new Set([...fav, ...unfav]));
  }, [elements]);

  const handleChangeUnfav = (el: HTMLElement) => {
    setElements((prev) => ({ ...prev, unfav: el }));
    setUpdatedAt(new Date().toISOString());
  };
  const handleChangefav = (el: HTMLElement) => {
    setElements((prev) => ({ ...prev, fav: el }));
    setUpdatedAt(new Date().toISOString());
  };

  const hasTrackid = useMemo(() => {
    return datasetKeys.includes("trackid");
  }, [datasetKeys]);

  return (
    <Container as="main" maxW="container.xl">
      <h1>誰でもイベント取れるくん v1.0</h1>
      <Grid templateColumns="repeat(12, 1fr)" gap={8} py={16}>
        <GridItem colSpan={3}>
          <Stack>
            <Stack>
              <Text fontSize="sm">{`お気に入りボタン(OFF)のHTMLを貼り付け`}</Text>
              <Editor
                name="htmlEditor"
                mode="html"
                theme="monokai"
                onChange={handleChangeUnfav}
                height={"100px"}
              />
            </Stack>
            <Stack>
              <Text
                fontSize={"sm"}
              >{`お気に入りボタン(ON)のHTMLを貼り付け`}</Text>
              <Editor
                name="htmlEditor"
                mode="html"
                theme="monokai"
                onChange={handleChangefav}
                height={"100px"}
              />
            </Stack>
          </Stack>
        </GridItem>

        <GridItem colSpan={9}>
          {elements.fav && elements.unfav && (
            <FormAndPreview
              key={updatedAt}
              classNames={classNames}
              dataSelectors={dataSelectors}
              ariaNames={ariaNames}
              onlyInFavClassNames={onlyInFavClassNames}
              hasTrackid={hasTrackid}
              datasetKeys={datasetKeys}
            />
          )}
        </GridItem>
      </Grid>
    </Container>
  );
}
