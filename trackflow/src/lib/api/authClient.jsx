
export async function loginUser(login, password) {
    console.log("[AUTH-CLIENT] loginUser called with:", login);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
      });
      
      console.log("[AUTH-CLIENT] Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de connexion');
      }
      
      const data = await response.json();
      console.log("[AUTH-CLIENT] Login successful:", data);
      
      return data;
      
    } catch (error) {
      console.error("[AUTH-CLIENT] Login failed:", error);
      throw error;
    }
  }