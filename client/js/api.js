class Api {
  constructor(baseURL = "http://localhost:5000") {
    this.baseURL = baseURL;
  }

  async getAllTheories() {
    try {
      const response = await fetch(`${this.baseURL}/theories`);
      if (!response.ok) throw new Error("Failed to fetch theories");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching theories:", error);
    }
  }

  async getTheoryById(id) {
    try {
      const response = await fetch(`${this.baseURL}/theories/${id}`);
      if (!response.ok) throw new Error(`Theory with ID ${id} not found`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching theory ${id}:`, error);
    }
  }

  async updateTheoryViews(id) {
    try {
      const response = await fetch(`${this.baseURL}/theories/${id}/views`, {
        method: "PUT", // Using PUT to update the views count
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error(`Failed to update views for theory ${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error updating views for theory ${id}:`, error);
    }
  }

  async getPopularTheories() {
    try {
      const response = await fetch(
        `${this.baseURL}/theories?limit=5&sort=views:desc`
      );
      if (!response.ok) throw new Error("Failed to fetch theories");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching theories:", error);
    }
  }
}

export default new Api();
