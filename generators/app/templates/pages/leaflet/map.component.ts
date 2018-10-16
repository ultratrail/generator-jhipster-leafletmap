import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { icon, latLng, marker, point, polyline, tileLayer } from 'leaflet';
import { Map } from './map.model';
import { MapService } from './map.service';
import { Principal } from 'app/core';

@Component({
    selector: 'jhi-map',
    templateUrl: './map.component.html'
})
export class MapComponent implements OnInit, OnDestroy {

    currentAccount: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;

    // Define our base layers so we can reference them multiple times
    OSMaps = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
        detectRetina: true
    });

    // Marker center of France
    center = marker([46.4547, 2.2529], {
        icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('../../../../../../node_modules/leaflet/dist/images/marker-shadow.png')
        })
    });

    // Tétras Lyre Triangle trace

    trace = polyline([
        [45.016988, 5.860209],
        [44.929941, -0.423671],
        [49.711282, 2.421459],
        [45.016988, 5.860209]
    ]);

    // Layers
    layersControl = {
        baseLayers: {
            'OS Maps': this.OSMaps,
        },
        overlays: {
            'France': this.center,
            'Triangle': this.trace
        }
    };

    // Set the initial set
    options = {
        layers: [this.OSMaps, this.trace, this.center],
        zoom: 4,
        center: latLng([46.4547, 2.2529])
    };
    constructor(
        private mapService: MapService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    ngOnInit() {

        this.principal.identity().then(account => {
            this.currentAccount = account;
        });

    }

    ngOnDestroy() {

    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
