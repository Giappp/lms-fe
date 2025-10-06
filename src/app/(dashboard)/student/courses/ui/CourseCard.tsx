"use client"
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {Rating, RatingButton} from "@/components/ui/shadcn-io/rating";
import {Button} from "@/components/ui/button";

type CourseProps = {
    id: number
    thumbnail: string
    title: string
    description: string
    category: string[]
    instructor: string
    duration: string
    difficulty: string
    price: number
    rating: number
    status: string
    reviews: number
}

const CourseCard: React.FC<CourseProps> = ({
                                               id,
                                               thumbnail,
                                               title,
                                               description,
                                               category,
                                               instructor,
                                               duration,
                                               difficulty,
                                               price,
                                               rating,
                                               status,
                                               reviews,
                                           }: CourseProps) => {
    return (
        <div className="flex flex-col justify-center items-center shadow-md py-6 px-4">
            {/* Course Image */}
            <Link href={`/course/${id}`}>
                <Image
                    src={thumbnail}
                    alt={title}
                    width={300}
                    height={135}
                    className="rounded-md object-cover w-auto h-auto"
                />
            </Link>

            {/* Course Content */}
            <div className="flex flex-col gap-1 mt-3">
                {/* Title */}
                <h3 className="text-base font-semibold line-clamp-2">
                    <Link href={`/courses/${id}`} className="hover:underline">
                        {title}
                    </Link>
                </h3>
                <p className="text-sm text-ellipsis text-left">{description}</p>
                <p className="text-xs text-muted-foreground">{instructor}</p>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <Rating defaultValue={rating} readOnly>
            <span className="text-sm text-yellow-500 font-semibold">
              {rating.toFixed(1)}
            </span>
                        {Array.from({length: 5}).map((_, index) => (
                            <RatingButton
                                className="text-yellow-500"
                                key={index}
                            />
                        ))}
                        <span className="text-xs text-muted-foreground">({reviews})</span>
                    </Rating>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <p className="text-base text-red-500 font-semibold">₫{price.toLocaleString()}</p>
                    <Button>Add to Cart</Button>
                </div>
            </div>
        </div>
    );
}
export default CourseCard
