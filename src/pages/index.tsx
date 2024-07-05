import { Editor } from "@/components/Editor";
import { FormAndPreview } from "@/components/FormAndPreview";
import { Container, Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";

export default function Home() {
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [elements, setElements] = useState<{
    fav: HTMLElement | null;
    unfav: HTMLElement | null;
  }>({
    fav: null,
    unfav: null,
  });

  /**
   * classNames: 両方に存在するclass
   * onlyInFavClassNames: favにのみ存在するclass
   */
  const [classNames, onlyInFavClassNames] = useMemo(() => {
    const favList = elements.fav ? Array.from(elements.fav.classList) : [];
    const unfavList = elements.unfav
      ? Array.from(elements.unfav.classList)
      : [];
    const intersection = favList.filter((className) =>
      unfavList.includes(className)
    );
    const onlyInFav = favList.filter(
      (className) => !intersection.includes(className)
    );
    return [intersection, onlyInFav];
  }, [elements]);

  /**
   * datasetKeys: 両方に存在するdatasetのkey
   * onlyInFavDatasetKeys: favにのみ存在するdatasetのkey
   * datasetMap: keyを元にfavとunfavのユニークな値配列を取得するMap
   */
  const [datasetKeys, onlyInFavDatasetKeys, datasetMap] = useMemo(() => {
    const fav = elements.fav ? elements.fav.dataset : {};
    const unfav = elements.unfav ? elements.unfav.dataset : {};
    const kvMap = new Map<string, string[]>();
    const keys = Array.from(
      new Set([...Object.keys(fav), ...Object.keys(unfav)])
    );
    const onlyInFav: string[] = [];
    for (const key of keys) {
      if (!unfav[key] && !!fav[key]) onlyInFav.push(key);
      kvMap.set(key, Array.from(new Set([unfav[key] ?? "", fav[key] ?? ""])));
    }
    return [keys, onlyInFav, kvMap];
  }, [elements]);

  /**
   * dataSelectors:両方の要素を指定できるセレクター文字列の候補
   */
  const dataSelectors = useMemo(() => {
    const fav = elements.fav
      ? elements.fav
          .getAttributeNames()
          .filter((name) => name.startsWith("data-"))
      : [];
    const unfav = elements.unfav
      ? elements.unfav
          .getAttributeNames()
          .filter((name) => name.startsWith("data-"))
      : [];

    const intersections: string[] = [];
    for (const v1 of fav) {
      for (const v2 of unfav) {
        if (v1 === v2) {
          intersections.push(v1);
        }
      }
    }
    const combinations = intersections.map((dataAttr) =>
      Array.from(
        new Set([
          `[${dataAttr}="${elements.fav?.getAttribute(dataAttr) ?? ""}"]`,
          `[${dataAttr}="${elements.unfav?.getAttribute(dataAttr) ?? ""}"]`,
        ])
      ).join(",")
    );
    return combinations;
  }, [elements]);

  /**
   * ariaSelectors: 両方の要素を指定できるセレクター文字列の候補
   */
  const ariaSelectors = useMemo(() => {
    const fav = elements.fav
      ? Array.from(elements.fav.getAttributeNames()).filter((name) =>
          name.startsWith("aria-")
        )
      : [];
    const unfav = elements.unfav
      ? Array.from(elements.unfav.getAttributeNames()).filter((name) =>
          name.startsWith("aria-")
        )
      : [];
    const intersections: string[] = [];
    for (const v1 of fav) {
      for (const v2 of unfav) {
        if (v1 === v2) {
          intersections.push(v1);
        }
      }
    }
    const combinations = intersections.map((dataAttr) =>
      Array.from(
        new Set([
          `[${dataAttr}="${elements.fav?.getAttribute(dataAttr) ?? ""}"]`,
          `[${dataAttr}="${elements.unfav?.getAttribute(dataAttr) ?? ""}"]`,
        ])
      ).join(",")
    );
    return combinations;
  }, [elements]);

  /**
   * ariaKeys: 両方に存在するaria属性のkey
   * onlyInFavAriaKeys: favにのみ存在するaria属性のkey
   * ariaMap: keyを元にfavとunfavのユニークな値配列を取得するMap
   */
  const [ariaKeys, onlyInFavAriaKeys, ariaMap] = useMemo(() => {
    const fav = elements.fav
      ? Array.from(elements.fav.getAttributeNames()).filter((name) =>
          name.startsWith("aria-")
        )
      : [];
    const unfav = elements.unfav
      ? Array.from(elements.unfav.getAttributeNames()).filter((name) =>
          name.startsWith("aria-")
        )
      : [];
    const kvMap = new Map<string, string[]>();
    const keys = Array.from(new Set([...fav, ...unfav]));
    const onlyInFav: string[] = [];
    for (const key of keys) {
      const favVal = elements.fav?.getAttribute(key);
      const unfavVal = elements.unfav?.getAttribute(key);
      if (!!favVal && !unfavVal) onlyInFav.push(key);
      kvMap.set(
        key.replace("aria-", ""),
        Array.from(new Set([unfavVal ?? "", favVal ?? ""]))
      );
    }
    return [keys.map((k) => k.replace("aria-", "")), onlyInFav, kvMap];
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
      <h1>誰でもイベント取れるくん v2.0</h1>
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
              onlyInFavClassNames={onlyInFavClassNames}
              ariaSelectors={ariaSelectors}
              ariaKeys={ariaKeys}
              ariaMap={ariaMap}
              onlyInFavAriaKeys={onlyInFavAriaKeys}
              dataSelectors={dataSelectors}
              datasetKeys={datasetKeys}
              datasetMap={datasetMap}
              onlyInFavDatasetKeys={onlyInFavDatasetKeys}
              hasTrackid={hasTrackid}
            />
          )}
        </GridItem>
      </Grid>
    </Container>
  );
}
