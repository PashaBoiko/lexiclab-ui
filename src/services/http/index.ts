import errorHandler from "../../utils/error-handler.ts";

interface IFetchParams {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

class HTTP {
  private static instance: HTTP;
  private base: string = import.meta.env.VITE_SERVER_API_URL;

  constructor() {
    if(HTTP.instance) {
      return HTTP.instance;
    }
    HTTP.instance = this;
  }


  private fullPath(url: string) {
    return this.base + url;
  }

  async get(url: string, params: IFetchParams) {
    try {
      const response = await fetch(this.fullPath(url), {
        ...params,
      });

      if (response.ok) return await response.json();

      if (response.status === 500) {
        const err = await response.json()
        throw new Error(err.message)
      }
    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  async post(url: string, params: IFetchParams) {
    const headers = {
      'Content-Type': 'application/json'
    }
    const method = params.method || "POST";

    if (params.headers) {
      Object.assign(headers, {
        ...params.headers,
      })
    }

    const body = params.body || "";
    try {
      const response = await fetch(this.fullPath(url), {
        method,
        headers,
        body,
      });

      if (response.ok) return await response.json();

      // Bad request
      if (response.status === 400) {
        throw await response.json();
      }

      // Validation error
      if (response.status === 403) {
        throw await response.json();
      }

      // Server error
      if (response.status === 500) {
        const err = await response.json()
        throw new Error(err.message)
      }

    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  async put(url: string, params: IFetchParams) {
    try {
      return await this.post(url, {
        ...params,
        method: "PUT",
      })
    } catch (err: unknown) {
      errorHandler(err);
    }
  }

  async delete(url: string, params: IFetchParams) {
    try {
      return await this.post(url, {
        ...params,
        method: "DELETE",
      })
    } catch (err: unknown) {
      errorHandler(err);
    }
  }
}

export default new HTTP();