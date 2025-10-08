import useSWR from "swr";
import {axios} from "@/api/core/axios";

export const useAuth = () => {
    const {data, isLoading, error, mutate} = useSWR('api/auth', async () => {

    })

    const signup = async ({...props}: {
        email: string;
        password: string;
        name: string;
        passwordConfirmation: string;
    }) => {
        await axios.post("/api/auth/register", props);
        await mutate();
    }
}
