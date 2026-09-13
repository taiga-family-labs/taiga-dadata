import {provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideTaiga} from '@taiga-ui/core';
import {provideTuiDaData} from '@taiga-ui-labs/dadata';

import {AppComponent} from './app/app.component';
import {DADATA_TOKEN} from './app/dadata-token';

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        provideHttpClient(),
        provideTaiga(),
        provideTuiDaData({token: () => DADATA_TOKEN()}),
    ],
}).catch(console.error);
