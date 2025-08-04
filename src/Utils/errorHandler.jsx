import { toast } from "react-toastify";

export default function handleError(err, fallback = "Something went wrong") {
  const res = err?.response;
  const message =
    res?.data?.message ||
    err?.message ||
    fallback;

  if (res?.status) {
    switch (res.status) {
      case 400:
        toast.error(message || "Bad request");
        break;
      case 401:
        toast.error(message || "Unauthorized");
        break;
      case 403:
        toast.error(message || "Forbidden access");
        break;
      case 404:
        toast.error(message || "Not found");
        break;
      case 500:
        toast.error(message || "Server error, please try again later");
        break;
      default:
        toast.error(message || fallback);
    }
  } else {
    toast.error(message || fallback);
  }
}
