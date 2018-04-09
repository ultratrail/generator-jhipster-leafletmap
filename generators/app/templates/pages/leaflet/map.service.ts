import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Map } from './map.model';
import { createRequestOption } from '../../shared';

export type MapResponseType = HttpResponse<Map>;
export type MapArrayResponseType = HttpResponse<Map[]>;

@Injectable()
export class MapService {

    private resourceUrl = SERVER_API_URL + 'api/leaflet/map';

    constructor(private http: HttpClient) { }

    private convertResponse(res: MapResponseType): MapResponseType {
        const body: Map = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: MapArrayResponseType): MapArrayResponseType {
        const jsonResponse: Map[] = res.body;
        const body: Map[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Map.
     */
    private convertItemFromServer(json: any): Map {
        const copy: Map = Object.assign(new Map(), json);
        return copy;
    }

    /**
     * Convert a Map to a JSON which can be sent to the server.
     */
    private convert(map: Map): Map {
        const copy: Map = Object.assign({}, map);
        return copy;
    }
}
