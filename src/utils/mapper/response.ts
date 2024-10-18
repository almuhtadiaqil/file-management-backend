import { STATUS_CODES } from "http";
import { BaseResponseDTO } from "../../dto/baseResponseDto";

export function mapSuccessResponse<T>(status:number, data: T|T[]|null = null): BaseResponseDTO<T|null> {
    return{
        statusCode: status,
        message: STATUS_CODES[status],
        data
    }
}

export function mapErrorResponse<T>(status: number, error: unknown): BaseResponseDTO<T|null>{
    let message
    if (error instanceof Error) {
        message = error.message
    } else if (typeof error === "string") {
        message = error
    }
    else {
        message = `Error: ${error}`
    }
    return {
        statusCode: status,
        message: message,
        data: null
    }
}