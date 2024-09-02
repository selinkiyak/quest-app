// JSON formatında POST isteği (auth ile)
export const PostWithAuth = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("tokenKey")}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in PostWithAuth:', error);
    throw error;
  }
}

// JSON formatında POST isteği (auth olmadan)
export const PostWithoutAuth = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in PostWithoutAuth:', error);
    throw error;
  }
}
export const PutWithAuth = async (url, formData) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("tokenKey")}`,
        // Content-Type başlığı FormData kullanırken otomatik ayarlanır
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Yanıt metin olarak alınmalı
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('Error in PutWithAuth:', error);
    throw error;
  }
};


// JSON formatında GET isteği (auth ile)
export const GetWithAuth = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("tokenKey")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in GetWithAuth:', error);
    throw error;
  }
}

// JSON formatında DELETE isteği (auth ile)
export const DeleteWithAuth = async (url) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("tokenKey")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in DeleteWithAuth:', error);
    throw error;
  }
}

// Refresh token için POST isteği
export const RefreshToken = async () => {
  try {
    const response = await fetch("/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("currentUser"),
        refreshToken: localStorage.getItem("refreshKey"),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in RefreshToken:', error);
    throw error;
  }
}
