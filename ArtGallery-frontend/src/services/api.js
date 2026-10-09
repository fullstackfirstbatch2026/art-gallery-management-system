const API_BASE_URL = "http://localhost:8081";

export async function getArtworks() {
  const response = await fetch(`${API_BASE_URL}/artworks`);

  if (!response.ok) {
    throw new Error("Failed to fetch artworks");
  }

  return response.json();
}

export async function getArtists() {
  const response = await fetch(`${API_BASE_URL}/artists`);

  if (!response.ok) {
    throw new Error("Failed to fetch artists");
  }

  return response.json();
}
export async function addArtist(artist) {
  const response = await fetch(`${API_BASE_URL}/artists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artist),
  });

  if (!response.ok) {
    throw new Error("Failed to add artist");
  }

  return response.json();
}

export async function updateArtist(id, artist) {
  const response = await fetch(`${API_BASE_URL}/artists/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artist),
  });

  if (!response.ok) {
    throw new Error("Failed to update artist");
  }

  return response.json();
}

export async function deleteArtist(id) {
  const response = await fetch(`${API_BASE_URL}/artists/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete artist");
  }

  return response.text();
}



export async function getCustomers() {
  const response = await fetch(`${API_BASE_URL}/customers`);

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
}
export async function addCustomer(customer) {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Failed to add customer");
  }

  return response.json();
}

export async function updateCustomer(id, customer) {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error("Failed to update customer");
  }

  return response.json();
}

export async function deleteCustomer(id) {
  const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete customer");
  }

  return response.text();
}

export async function getSales() {
  const response = await fetch(`${API_BASE_URL}/sales/details`);

  if (!response.ok) {
    throw new Error("Failed to fetch sales");
  }

  return response.json();
}


export async function recordSale(
  artworkId,
  customerId,
  salePrice
) {
  const response = await fetch(
    `${API_BASE_URL}/sales?artworkId=${artworkId}&customerId=${customerId}&salePrice=${salePrice}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Sale failed:", errorText);
    throw new Error(errorText || "Failed to record sale");
  }

  return response.text();
}
export async function getCommission(salePrice) {
  const response = await fetch(
    `${API_BASE_URL}/sales/commission/${salePrice}`
  );

  if (!response.ok) {
    throw new Error("Failed to calculate commission");
  }

  return response.json();
}

export async function addArtwork(artwork) {
  const response = await fetch(`${API_BASE_URL}/artworks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artwork),
  });

  if (!response.ok) {
    throw new Error("Failed to add artwork");
  }

  return response.json();
}

export async function updateArtwork(id, artwork) {

  console.log("UPDATE ID:", id);
  console.log("UPDATE DATA:", artwork);

  const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artwork),
  });

  console.log("STATUS:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("SERVER ERROR:", errorText);
    throw new Error("Failed to update artwork");
  }

  return response.json();
}

export async function deleteArtwork(id) {
  const response = await fetch(`${API_BASE_URL}/artworks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete artwork");
  }

  return response.text();
}