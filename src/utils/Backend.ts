import axios from "axios";

interface AuthRequestType {
  accessToken?: string;
  url: string;
  data?: any;
}

interface PostRequestType extends AuthRequestType {
  data: any;
}

interface ResponseType {
  success: (data: any) => void;
  failure: (error: any) => void;
}

class Backend {
  async Get(data: AuthRequestType, responseData: ResponseType) {
    try {
      const config: any = {
        method: "get",
        maxBodyLength: Infinity,
        url: data.url,
        headers: {
          ...(data.accessToken ? { Authorization: `Bearer ${data.accessToken}` } : {}),
        },
        params: data.data || {}, // GET requests use params instead of body
      };
      const response = await axios.request(config);
      // NestJS returns directly under response.data, safeguard by checking response.data.data
      const result = response.data.data !== undefined ? response.data.data : response.data;
      responseData.success(result);
    } catch (e: any) {
      responseData.failure(e);
      return {
        status: false,
      };
    }
  }

  async Post(data: PostRequestType, responseData: ResponseType) {
    try {
      const config: any = {
        method: "post",
        maxBodyLength: Infinity,
        url: data.url,
        headers: {
          "Content-Type": "application/json",
          ...(data.accessToken ? { Authorization: `Bearer ${data.accessToken}` } : {}),
        },
        data: JSON.stringify(data.data),
      };

      const response = await axios.request(config);
      const result = response.data.data !== undefined ? response.data.data : response.data;
      responseData.success(result);
    } catch (e: any) {
      responseData.failure(e);
    }
  }

  async Patch(data: PostRequestType, responseData: ResponseType) {
    try {
      const config: any = {
        method: "patch",
        maxBodyLength: Infinity,
        url: data.url,
        headers: {
          "Content-Type": "application/json",
          ...(data.accessToken ? { Authorization: `Bearer ${data.accessToken}` } : {}),
        },
        data: JSON.stringify(data.data),
      };

      const response = await axios.request(config);
      const result = response.data.data !== undefined ? response.data.data : response.data;
      responseData.success(result);
    } catch (e: any) {
      responseData.failure(e);
    }
  }

  async Put(data: PostRequestType, responseData: ResponseType) {
    try {
      const config: any = {
        method: "put",
        maxBodyLength: Infinity,
        url: data.url,
        headers: {
          "Content-Type": "application/json",
          ...(data.accessToken ? { Authorization: `Bearer ${data.accessToken}` } : {}),
        },
        data: JSON.stringify(data.data),
      };

      const response = await axios.request(config);
      const result = response.data.data !== undefined ? response.data.data : response.data;
      responseData.success(result);
    } catch (e: any) {
      responseData.failure(e);
    }
  }

  async Delete(data: PostRequestType, responseData: ResponseType) {
    try {
      const config: any = {
        method: "delete",
        maxBodyLength: Infinity,
        url: data.url,
        headers: {
          "Content-Type": "application/json",
          ...(data.accessToken ? { Authorization: `Bearer ${data.accessToken}` } : {}),
        },
        data: JSON.stringify(data.data),
      };

      const response = await axios.request(config);
      const result = response.data.data !== undefined ? response.data.data : response.data;
      responseData.success(result);
    } catch (e: any) {
      responseData.failure(e);
    }
  }

  async Form(data: PostRequestType, responseData: ResponseType) {
    try {
      const config: any = {
        method: "post",
        maxBodyLength: Infinity,
        url: data.url,
        headers: {
          "Content-Type": "multipart/form-data",
          ...(data.accessToken ? { Authorization: `Bearer ${data.accessToken}` } : {}),
        },
        data: data.data,
      };

      const response = await axios.request(config);
      const result = response.data.data !== undefined ? response.data.data : response.data;
      responseData.success(result);
    } catch (e: any) {
      console.error(e);
      responseData.failure(e);
    }
  }
}

export const BackendService = new Backend();
