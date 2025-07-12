/**
 * @file components/lib/profileService.js (or similar)
 * @description Contains functions for fetching user-specific data from the API.
 */

import fetcher from "./api-helpers";


/**
 * Fetches the profile data for the currently authenticated musician.
 *
 * This function makes an authenticated GET request to the `/api/profile/musician/me`
 * endpoint. It requires an authentication token and will throw an error if one is not provided.
 * The `cache: 'no-store'` option ensures that the most up-to-date profile data is always fetched.
 *
 * @async
 * @param {string} authToken - The JWT authentication token for the user.
 * @returns {Promise<object>} A promise that resolves to the musician's profile object returned by the API.
 * @throws {Error} Throws an error if the `authToken` is not provided, preventing an unnecessary API call.
 */
export async function getMyProfile(authToken) {
  if (!authToken) {
    throw new Error(
      "Authentication token not found. User must be logged in to perform this action."
    );
  }

  const endpoint = `/api/profile/musician/me`;

  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  };

  return fetcher(endpoint, fetchOptions);
}
