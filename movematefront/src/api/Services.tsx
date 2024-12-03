import { quotePayloadType } from "@/utils/types";
import AxiosInstance from "./Api";

export default class useService {
  // fetch users details
  async fetchUSerDetails(user_id: any) {
    const url = `api/users/me`;
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching users :: ", error));
  }

  // fetch users
  async fetchRegisteredUsers() {
    const url = "api/admin/users/";
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching users :: ", error));
  }
  // fetch admin quotes
  async fetchAdminQuotes() {
    const url = "api/admin/quotes/";
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching quotes :: ", error));
  }

  // fetch quotes
  async fetchQuotes() {
    const url = "api/quotes/";
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching quotes :: ", error));
  }
  // fetch moves sizes
  async fetchMoveSizes() {
    const url = "api/services/move_sizes";
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching move sizes :: ", error));
  }
  // fetch moves
  async fetchMoveServices() {
    const url = "api/services/";
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching services :: ", error));
  }

  // fetch schedules
  async fetchSchedules() {
    const url = "api/schedules/";
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching schedules :: ", error));
  }

  // fetch favorites
  async fetchFavorites() {
    const url = "api/favorites/";
    return await AxiosInstance.get(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error fetching favorites :: ", error));
  }

  // post quote
  async createQuote(payload: any) {
    const url = "/api/quotes/";
    return await AxiosInstance.post(url, payload)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error creating quote :: ", error));
  }

  // create service
  async createService(payload: any) {
    const url = "/api/services/";
    return await AxiosInstance.post(url, payload)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error creating service :: ", error));
  }

  // create size
  async createMoveSize(payload: any) {
    const url = "/api/services/move_size";
    return await AxiosInstance.post(url, payload)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error creating move size :: ", error));
  }

  // create schedule
  async createSchedule(payload: any) {
    const url = "/api/schedules/";
    return await AxiosInstance.post(url, payload)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error creating schedule :: ", error));
  }

  // update estimate
  async setEstimate(payload: any) {
    const estimate_url = `api/quotes/${payload.id}/estimate`;
    return await AxiosInstance.patch(estimate_url, payload)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error setting estimate :: ", error));
  }

  // mark as favorite
  async setFavorite(id: any) {
    const url = `/api/quotes/${id}/favorite`;
    return await AxiosInstance.patch(url)
      .then((respose) => respose.data)
      .catch((error) => console.error("Error setting favorite :: ", error));
  }
}
