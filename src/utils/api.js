import { logoutUser, refreshToken } from "@/store/authSlice";

export const apiRequest = async (
  dispatch,
  endpoint,
  options = {},
  retries = 1,
  maxRetries = 2
) => {
  try {
    const res = await fetch(endpoint, {
      ...options,
      credentials: "include",
    });

    if (res.status === 401 && retries <= maxRetries) {
      dispatch(logoutUser());
      // Attempt to refresh the token
      // const refreshResult = await dispatch(refreshToken());

      // if (refreshResult.error) {
      //   dispatch(logoutUser());
      //   throw new Error("Session expired. Please log in again.");
      // }

      // Retry the original request after successful token refresh
      // return await apiRequest(dispatch, endpoint, options, retries + 1, maxRetries);
    }

    if (!res.ok) {
      let errorMessage = res.statusText;
      try {
        const errorResponse = await res.json();
        if (errorResponse.message) {
          errorMessage = errorResponse.message;
        }
      } catch (e) {
        // If there's an error parsing the response, use statusText
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const authApiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(endpoint, {
      ...options,
      credentials: "include",
    });

    if (!res.ok) throw new Error(res.statusText);

    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteThumbnail = async (thumbnail_public_id) => {
  const res = await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ thumbnail_public_id }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Failed to delete thumbnail");

  return data;
};
