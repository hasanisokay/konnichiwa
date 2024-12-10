import { toast } from "react-toastify";

const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    const id = toast.loading("Uploading Image...", {
        position: "top-center",
    })
    try {
        const apiKey =  process.env.NEXT_PUBLIC_IMGBB_API_KEY
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data?.status === 200) {
            toast.update(id, { render: "Uploaded", type: "success", isLoading: false, autoClose: 1000, });
            return data?.data?.url;
        } else {
            toast.update(id, { render: "Upload failed.", type: "error", isLoading: false, autoClose: 1000,});
        }
    } catch (error) {
        toast.update(id, { render: "An error occurred during image upload", type: "error", isLoading: false });
    }
};

export default uploadImage;