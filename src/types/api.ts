export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface TransferResponse {
  balance?: number;
}
