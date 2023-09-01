import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager {
  status: HttpStatus;
  message: string;

  constructor({
    type,
    message
  }: {
    type: keyof typeof HttpStatus;
    message: string;
  }) {
    this.status = HttpStatus[type]
    this.message = message;
  }

  public static createSignatureError({ status, message }: { status: HttpStatus, message: string }) {
    if (status && message) {
      throw new HttpException(message, status)
    } else {
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
