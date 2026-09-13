import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {type Observable} from 'rxjs';

import {TUI_DADATA_BASE_URL, TUI_DADATA_OPTIONS} from './dadata.options';
import {
    type TuiDaDataAddressData,
    type TuiDaDataAddressSuggestRequest,
    type TuiDaDataBankData,
    type TuiDaDataBankSuggestRequest,
    type TuiDaDataBaseSuggestRequest,
    type TuiDaDataFioData,
    type TuiDaDataFioSuggestRequest,
    type TuiDaDataPartyData,
    type TuiDaDataPartySuggestRequest,
    type TuiDaDataResponse,
} from './dadata.types';

@Injectable({providedIn: 'root'})
export class TuiDaDataService {
    private readonly http = inject(HttpClient);
    private readonly options = inject(TUI_DADATA_OPTIONS);

    public suggestAddress(
        request: TuiDaDataAddressSuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataAddressData>> {
        return this.suggest<TuiDaDataAddressData>('address', request);
    }

    public suggestFio(
        request: TuiDaDataFioSuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataFioData>> {
        return this.suggest<TuiDaDataFioData>('fio', request);
    }

    public suggestParty(
        request: TuiDaDataPartySuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataPartyData>> {
        return this.suggest<TuiDaDataPartyData>('party', request);
    }

    public suggestBank(
        request: TuiDaDataBankSuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataBankData>> {
        return this.suggest<TuiDaDataBankData>('bank', request);
    }

    public suggest<T, R extends TuiDaDataBaseSuggestRequest = TuiDaDataBaseSuggestRequest>(
        type: string,
        request: R,
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
