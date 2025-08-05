const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface Technique {
  id: number;
  technique_id: string;
  name: string;
  category: string;
  description: string;
  best_response: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTechniqueData {
  technique_id: string;
  name: string;
  category: string;
  description: string;
  best_response: string;
}

export interface UpdateTechniqueData {
  name: string;
  category: string;
  description: string;
  best_response: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all techniques
  async getTechniques(): Promise<Technique[]> {
    return this.request<Technique[]>('/techniques');
  }

  // Get techniques by category
  async getTechniquesByCategory(category: string): Promise<Technique[]> {
    return this.request<Technique[]>(`/techniques/category/${encodeURIComponent(category)}`);
  }

  // Get all categories
  async getCategories(): Promise<string[]> {
    return this.request<string[]>('/categories');
  }

  // Get technique by ID
  async getTechnique(id: string): Promise<Technique> {
    return this.request<Technique>(`/techniques/${encodeURIComponent(id)}`);
  }

  // Create new technique
  async createTechnique(data: CreateTechniqueData): Promise<Technique> {
    return this.request<Technique>('/techniques', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update technique
  async updateTechnique(id: string, data: UpdateTechniqueData): Promise<Technique> {
    return this.request<Technique>(`/techniques/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Delete technique
  async deleteTechnique(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/techniques/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService(); 