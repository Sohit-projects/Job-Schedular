import { API_BASE } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE;
  }

  getAuthHeaders(token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, options);
    
    if (!response.ok && response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    
    return response;
  }

  // Auth APIs
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
  }

  // Job APIs
  async getJobs(token) {
    return this.request('/get-jobs', {
      headers: this.getAuthHeaders(token)
    });
  }

  async addJob(jobData, token) {
    return this.request('/add-job', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(jobData)
    });
  }

  async deleteJob(jobId, token) {
    return this.request(`/delete-job/${encodeURIComponent(jobId)}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token)
    });
  }

  async toggleJobDone(jobId, token) {
    return this.request('/toggle-done', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ id: jobId })
    });
  }

  // Schedule APIs
  async scheduleJobs(token) {
    return this.request('/schedule', {
      method: 'POST',
      headers: this.getAuthHeaders(token)
    });
  }

  async updateEarnings(amount, token) {
    return this.request('/update-earnings', {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify({ amount })
    });
  }
}

export default new ApiService();