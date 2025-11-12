import {AnimateLayoutChanges, useSortable} from "@dnd-kit/sortable";
import {ChapterItem, Props as ChapterItemProps} from "@/components/teacher/ChapterItem";
import {CSSProperties} from "react";
import {CSS} from "@dnd-kit/utilities";

interface Props extends ChapterItemProps {
    id: string;
}

const animateLayoutChanges: AnimateLayoutChanges = ({isSorting, wasDragging}) =>
    !(isSorting || wasDragging);

export const ChapterList = ({id, ...props}: Props) => {
    const {
        attributes,
        isDragging,
        isSorting,
        listeners,
        setDraggableNodeRef,
        setDroppableNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        animateLayoutChanges,
    });
    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <ChapterItem
            ref={setDraggableNodeRef}
            wrapperRef={setDroppableNodeRef}
            style={style}
            ghost={isDragging}
            disableInteraction={isSorting}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
            {...props}
        />
    )
}
