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
    type TuiDaDataEmailData,
    type TuiDaDataEmailSuggestRequest,
    type TuiDaDataEndpointMap,
    type TuiDaDataEndpointType,
    type TuiDaDataFindAddressRequest,
    type TuiDaDataFindBankRequest,
    type TuiDaDataFindByIdEndpointMap,
    type TuiDaDataFindByIdEndpointType,
    type TuiDaDataFindPartyRequest,
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
        return this.suggest('address', request);
    }

    public suggestFio(
        request: TuiDaDataFioSuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataFioData>> {
        return this.suggest('fio', request);
    }

    public suggestParty(
        request: TuiDaDataPartySuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataPartyData>> {
        return this.suggest('party', request);
    }

    public suggestBank(
        request: TuiDaDataBankSuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataBankData>> {
        return this.suggest('bank', request);
    }

    public suggestEmail(
        request: TuiDaDataEmailSuggestRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataEmailData>> {
        return this.suggest('email', request);
    }

    public findAddressById(
        request: TuiDaDataFindAddressRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataAddressData>> {
        return this.findById('address', request);
    }

    public findPartyById(
        request: TuiDaDataFindPartyRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataPartyData>> {
        return this.findById('party', request);
    }

    public findBankById(
        request: TuiDaDataFindBankRequest,
    ): Observable<TuiDaDataResponse<TuiDaDataBankData>> {
        return this.findById('bank', request);
    }

    public findById<K extends TuiDaDataFindByIdEndpointType>(
        type: K,
        request: TuiDaDataFindByIdEndpointMap[K]['request'],
    ): Observable<TuiDaDataResponse<TuiDaDataFindByIdEndpointMap[K]['data']>>;
    public findById<T, R extends TuiDaDataBaseSuggestRequest = TuiDaDataBaseSuggestRequest>(
        type: string,
        request: R,
    ): Observable<TuiDaDataResponse<T>>;
    public findById<T>(
        type: string,
        request: TuiDaDataBaseSuggestRequest,
    ): Observable<TuiDaDataResponse<T>> {
        return this.request<T>('findById', type, request);
    }

    public suggest<K extends TuiDaDataEndpointType>(
        type: K,
        request: TuiDaDataEndpointMap[K]['request'],
    ): Observable<TuiDaDataResponse<TuiDaDataEndpointMap[K]['data']>>;
    public suggest<T, R extends TuiDaDataBaseSuggestRequest = TuiDaDataBaseSuggestRequest>(
        type: string,
        request: R,
    ): Observable<TuiDaDataResponse<T>>;
    public suggest<T>(
        type: string,
        request: TuiDaDataBaseSuggestRequest,
    ): Observable<TuiDaDataResponse<T>> {
        return this.request<T>('suggest', type, request);
    }

    private request<T>(
        method: 'findById' | 'suggest',
        type: string,
        request: TuiDaDataBaseSuggestRequest,
    ): Observable<TuiDaDataResponse<T>> {
        const token =
            typeof this.options.token === 'function'
                ? this.options.token()
                : this.options.token;

        return this.http.post<TuiDaDataResponse<T>>(
            `${this.options.baseUrl ?? TUI_DADATA_BASE_URL}/${method}/${type}`,
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
