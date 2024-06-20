class ApiResponse {
  statusCode: Number;
  message: String;
  data: Object;
  success: boolean;

  constructor(statusCode:number, data:any, message:string, success:boolean = true) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
}

export default ApiResponse;
