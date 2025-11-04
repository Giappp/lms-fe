import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {ChapterWithLessons} from "@/types/types";
import {UniqueIdentifier} from "@dnd-kit/core";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function setProperty<T extends keyof ChapterWithLessons>(
    items: ChapterWithLessons[],
    id: UniqueIdentifier,
    property: T,
    setter: (item: ChapterWithLessons[T]) => ChapterWithLessons[T]) {
    for (const item of items) {
        if (item.id === id) {
            item[property] = setter(item[property]);
        }
    }
    return [...items];
}


