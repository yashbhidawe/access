import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrgsService } from './orgs.service';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';

@UseGuards(AuthGuard)
@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Post()
  create(@Body() dto: CreateOrgDto) {
    const fakeUserId = 'bd9050ca-f8e0-4439-9589-1475f1e7a5e4';
    return this.orgsService.create(fakeUserId, dto.name);
  }

  @Get()
  findAll() {
    return this.orgsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrgDto: UpdateOrgDto) {
    return this.orgsService.update(id, updateOrgDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orgsService.remove(id);
  }
}
