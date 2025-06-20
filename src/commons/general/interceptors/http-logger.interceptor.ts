import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { LoggerManager } from '@commons/general/loggers';

@Injectable()
export class HttpServiceLoggerInterceptor implements OnModuleInit {
  constructor(
    @Inject(HttpService)
    private httpService: HttpService,
    private readonly logger: LoggerManager
  ) {}

  onModuleInit(): any {
    const { axiosRef: axios } = this.httpService;

    axios.interceptors.request.use((config) => {
      this.logger.http('External HTTP Request', {
        baseUrl: config.baseURL,
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });

      return config;
    }, Promise.reject);

    axios.interceptors.response.use(
      (response) => {
        this.logger.http('External HTTP Response', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.config.data
        });

        return response;
      },
      (error) => {
        console.log(error);
        this.logger.error('External HTTP Response Error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          headers: error.response?.headers,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase()
        });

        return Promise.reject(error);
      }
    );
  }
}