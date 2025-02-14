import api from "../axiosInstance";

// Create user
export const createNewUser = async (name, email, age) => {
    try {
      const response = await api.post("/users", {
        name,
        email,
        age
      });
 
      return response.data; // Return response data if needed
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; // Re-throw error for handling in calling function
    }
 };
 