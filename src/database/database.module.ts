import { Global, Module } from '@nestjs/common';
import { dbProviders } from './providers';

@Global()
@Module({
  providers: [...dbProviders],
  exports: [...dbProviders],
})
export class DatabaseModule {}
