import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { JhiPaginationUtil } from 'ng-jhipster';

import { MapComponent } from './map.component';
export const LeafletRoute: Routes = [
    {
        path: 'leaflet-map',
        component: MapComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Maps'
        }
    },
];
