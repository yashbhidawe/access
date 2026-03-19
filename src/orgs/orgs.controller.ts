import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Request,
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
  create(@Request() req, @Body() dto: CreateOrgDto) {
    return this.orgsService.create(req.user.id, dto.name);
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
