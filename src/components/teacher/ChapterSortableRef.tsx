import {AnimateLayoutChanges, useSortable} from "@dnd-kit/sortable";
import {ChapterItem, Props as ChapterItemProps} from "@/components/teacher/ChapterItem";
import {CSSProperties} from "react";
import {CSS} from "@dnd-kit/utilities";

interface Props extends ChapterItemProps {
    id: string;
}

// Optimization to prevent "jumping" when items change height
const animateLayoutChanges: AnimateLayoutChanges = ({isSorting, wasDragging}) =>
    !(isSorting || wasDragging);

export const ChapterSortableRef = ({id, ...props}: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef, // Use this single ref instead of splitting draggable/droppable
        transform,
        transition,
        isDragging,
        isSorting
    } = useSortable({
        id,
        animateLayoutChanges,
    });

    const style: CSSProperties = {
        // Translate is usually smoother than Transform for lists,
        // and prevents blurring on some screens
        transform: CSS.Translate.toString(transform),
        transition,
        // Ensure high Z-index while dragging so it floats over other elements
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative',
    };

    return (
        <ChapterItem
            ref={setNodeRef} // Apply ref to the outer-most container
            style={style}
            ghost={isDragging}
            disableInteraction={isSorting} // Disable clicking inputs while dragging
            handleProps={{...attributes, ...listeners}} // Pass drag listeners to the handle
            {...props}
        />
    )
}