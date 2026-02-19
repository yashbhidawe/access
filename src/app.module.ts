import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrgsModule } from './orgs/orgs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [OrgsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
