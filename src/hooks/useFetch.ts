import { LinkString, sendGetRequest, sendPostRequest } from "@/lib/sendRequest";
import { useQuery } from "@tanstack/react-query";

type Options = {
  serverPath: LinkString;
  body?: Object;
  staleTime?: number;
};

export type AppResponse<T> = {
  status: boolean;
  message: string;
  status_code: number;
  reponse_code: number;
  data:T | undefined
} 

export const useFetch = <T>(options: Options) => {
  const fetchData = async () => {
    const response = await sendGetRequest(options.serverPath);
    return response;
  };

  const {
    data: apiData,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: [options.serverPath],
    queryFn: fetchData,
    staleTime: options.staleTime || 0,
  });

  //   useEffect(() => {
  //     const ac = new AbortController();
  //     fetchData();
  //     return () => ac.abort(); // Cleanup function to set isMounted to false
  //   }, []);

  type ReturnObject = {
    isLoading: boolean;
    data: AppResponse<T> | undefined;
    error: Error | null;
    isError: boolean;
    refetch: () => void;
  };
  const returnObject: ReturnObject = {
    isLoading,
    data: apiData,
    error,
    isError,
    refetch,
  };

  return returnObject;
};
