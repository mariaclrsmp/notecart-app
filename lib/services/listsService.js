const API_URL = '/api/lists';

export const listsService = {
  async getAll(token) {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch lists');
    return response.json();
  },

  async getById(id, token) {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch list');
    return response.json();
  },

  async create(listData, token) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listData),
    });
    if (!response.ok) throw new Error('Failed to create list');
    return response.json();
  },

  async update(id, listData, token) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(listData),
    });
    if (!response.ok) throw new Error('Failed to update list');
    return response.json();
  },

  async delete(id, token) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete list');
    return response.json();
  },
};
