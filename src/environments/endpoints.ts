import { environment } from "./environment";

export const endpoints = {
    apiHello: environment.apiUrl + 'hello',
    apiUpload: environment.apiUrl + 'upload'
}