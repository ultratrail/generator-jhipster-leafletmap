import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { CartegenSharedModule } from '../../shared';
import {
    MapService,
    MapComponent,
    LeafletRoute
} from './';

const PAGE_SET_STATES = [
    ...LeafletRoute,
];

@NgModule({
    imports: [
        CartegenSharedModule,
        RouterModule.forRoot(PAGE_SET_STATES, { useHash: true }),
        LeafletModule.forRoot()
    ],
    declarations: [
    MapComponent,
],
    entryComponents: [
    MapComponent,
],
    providers: [
    MapService,
],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CartegenLeafletModule {}
