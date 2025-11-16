"use client"

import {SWRConfiguration} from "swr";
import {swrFetcher} from "./swrFetcher";

export const defaultSWRConfig: SWRConfiguration = {
    fetcher: swrFetcher,
    revalidateOnFocus: true,
    shouldRetryOnError: false,
};
