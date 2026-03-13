import { Website } from "@/store/useBuilderStore";

const API_BASE_URL = "http://localhost:5000/api/v1";

class WebsiteService {
    private async fetchWithAuth(url: string, options: RequestInit = {}) {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${response.status}`);
        }

        return response.json();
    }

    async createWebsite(name: string, templateId?: string) {
        return this.fetchWithAuth("/websites", {
            method: "POST",
            body: JSON.stringify({ name, templateId: templateId === 'blank' ? undefined : templateId }),
        });
    }

    async listWebsites() {
        return this.fetchWithAuth("/websites");
    }

    async getWebsite(id: string) {
        return this.fetchWithAuth(`/websites/${id}`);
    }

    async updatePageContent(websiteId: string, pageId: string, content: any) {
        return this.fetchWithAuth(`/websites/${websiteId}/pages/${pageId}`, {
            method: "PATCH",
            body: JSON.stringify(content),
        });
    }

    async listTemplates() {
        return this.fetchWithAuth("/websites/templates");
    }

    async publishWebsite(id: string) {
        return this.fetchWithAuth(`/websites/${id}/publish`, {
            method: "POST",
        });
    }
}

export const websiteService = new WebsiteService();
