const API_URL = '/api/lists';

export const listsService = {
  async getAll() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch lists');
    return response.json();
  },

  async getById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch list');
    return response.json();
  },

  async create(listData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listData),
    });
    if (!response.ok) throw new Error('Failed to create list');
    return response.json();
  },

  async update(id, listData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listData),
    });
    if (!response.ok) throw new Error('Failed to update list');
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete list');
    return response.json();
  },
};
