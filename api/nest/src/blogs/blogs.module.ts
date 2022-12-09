import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
