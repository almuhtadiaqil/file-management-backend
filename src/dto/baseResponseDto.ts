export interface BaseResponseDTO<T>{
    statusCode: number
    message: string | undefined
    data: T | T[] | null
}