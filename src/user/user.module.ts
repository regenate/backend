import { Module } from '@nestjs/common';
import { UploaderModule } from '@src/uploader/uploader.module';
import { UtilModule } from '@src/util/util.module';
import { userProviders } from './providers';
import {
  MenteeController,
  MentorController,
  UserController,
} from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [...userProviders, UserService],
  imports: [UtilModule, UploaderModule],
  controllers: [UserController, MentorController, MenteeController],
  exports: [UserService],
})
export class UserModule {}
