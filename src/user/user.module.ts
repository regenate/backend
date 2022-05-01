import { Module } from '@nestjs/common';
import { UtilModule } from '@src/util/util.module';
import { userProviders } from './providers';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [...userProviders, UserService],
  imports: [UtilModule],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
