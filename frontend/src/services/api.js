const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = {
  // Subjects
  async getSubjects() {
    const response = await fetch(`${API_BASE_URL}/questions/subjects`);
    if (!response.ok) throw new Error('Failed to fetch subjects');
    return response.json();
  },

  // Questions
  async getQuestions(subjectId = null) {
    const url = subjectId 
      ? `${API_BASE_URL}/questions/questions?subject_id=${subjectId}`
      : `${API_BASE_URL}/questions/questions`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  },

  async getQuestion(id) {
    const response = await fetch(`${API_BASE_URL}/questions/questions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch question');
    return response.json();
  },

  async createQuestion(question) {
    const response = await fetch(`${API_BASE_URL}/questions/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question)
    });
    if (!response.ok) throw new Error('Failed to create question');
    return response.json();
  },

  async updateQuestion(id, question) {
    const response = await fetch(`${API_BASE_URL}/questions/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question)
    });
    if (!response.ok) throw new Error('Failed to update question');
    return response.json();
  },

  async deleteQuestion(id) {
    const response = await fetch(`${API_BASE_URL}/questions/questions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete question');
    return response.json();
  }
};
