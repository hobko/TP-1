import { environment } from "./environment";

export const endpoints = {
    apiHello:                   environment.apiUrl + 'hello',
    apiUpload:                  environment.apiUrl + 'upload',
    apiGetGpx:                  environment.apiUrl + 'getgpx', // tu sa este dava /nazov_suboru
    apiGetgpxMatched:           environment.apiUrl + 'getgpx/matched', // tu sa este dava /nazov_suboru
    apiGetFiles:                environment.apiUrl + 'getfiles',
    apiGetMapMatchingStatus:    environment.apiUrl + 'graphhopper/status',
    apiDownloadZipFile:         environment.apiUrl + 'download', // tu sa este dava /nazov_suboru
    apiDeleteFile:              environment.apiUrl + 'delete/storage' // tu sa este dava /nazov_suboru
}