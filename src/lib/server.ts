import axiosClient from "./axios"

export const createServer = async ({ name, imageUrl, bio }: { name: string, imageUrl: string, bio: string }) => {
    const response = await axiosClient.post(`${import.meta.env.VITE_API_URL}/v1/server/create`, {
        name: name,
        imageUrl: imageUrl,
        bio: bio
    })

    return response.data;
}