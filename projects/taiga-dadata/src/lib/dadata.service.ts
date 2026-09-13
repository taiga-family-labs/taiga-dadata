import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {type Observable} from 'rxjs';

import {TUI_DADATA_BASE_URL, TUI_DADATA_OPTIONS} from './dadata.options';
import {
    type TuiDaDataAddressData,
    type TuiDaDataResponse,
    type TuiDaDataSuggestRequest,
} from './dadata.types';

@Injectable({providedIn: 'root'})
export class TuiDaDataService {
    private readonly http = inject(HttpClient);
    private readonly options = inject(TUI_DADATA_OPTIONS);

    public suggestAddress(
        request: TuiDaDataSuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataAddressData>> {
        return this.suggest<TuiDaDataAddressData>('address', request);
    }

    public suggest<T>(
        type: string,
        request: TuiDaDataSuggestRequest,
    ): Observable<TuiDaDataResponse<T>> {
        const token =
            typeof this.options.token === 'function'
                ? this.options.token()
                : this.options.token;

        return this.http.post<TuiDaDataResponse<T>>(
            `${this.options.baseUrl ?? TUI_DADATA_BASE_URL}/suggest/${type}`,
            request,
            {
                headers: new HttpHeaders({
                    Accept: 'application/json',
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                }),
            },
        );
    }
}
