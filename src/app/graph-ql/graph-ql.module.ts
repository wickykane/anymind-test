import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { NgModule } from '@angular/core';

const uri = 'https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphql';

export const cache = new InMemoryCache();

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache,
          link: httpLink.create({
            uri,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GrapqlModule {}
