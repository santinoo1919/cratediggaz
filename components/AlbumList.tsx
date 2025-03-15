import { MotiView } from "moti";
import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { Album } from "../components/RecordComp";
import RecordComp from "./RecordComp";
import { usePathname } from "expo-router";
import { forwardRef } from "react";

interface AlbumListProps {
  albums: Album[];
  selectedId: string | null;
  onSelect: (album: Album, index: number) => void;
  isHorizontal?: boolean;
}

const AlbumList = forwardRef<FlashList<Album>, AlbumListProps>(
  ({ albums, selectedId, onSelect, isHorizontal }, ref) => {
    const pathname = usePathname();

    const renderItem = useCallback(
      ({ item, index }: { item: Album; index: number }) => (
        <RecordComp
          album={item}
          isSelected={item.id === selectedId}
          onPress={() => onSelect(item, index)}
          index={index}
          totalLength={albums.length}
        />
      ),
      [selectedId, onSelect, albums.length]
    );

    return (
      <MotiView
        key={pathname}
        from={{
          opacity: 0,
          translateX: -20,
        }}
        animate={{
          opacity: 1,
          translateX: 0,
        }}
        transition={{
          type: "timing",
          duration: 1000,
        }}
        className="flex-1"
      >
        <FlashList
          ref={ref}
          className="flex-1"
          data={albums}
          renderItem={renderItem}
          estimatedItemSize={214}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={isHorizontal}
          extraData={selectedId}
          contentContainerStyle={{
            padding: 20,
            ...(isHorizontal && {
              alignItems: "center",
            }),
          }}
        />
      </MotiView>
    );
  }
);

export default AlbumList;
