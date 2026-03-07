import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrgsService {
  constructor(private prisma: PrismaService) {}
  async create(userId: string, name: string) {
    const ownerRole = await this.prisma.role.findFirst({
      where: { name: 'owner' },
    });

    if (!ownerRole) {
      throw new NotFoundException('Owner role not found');
    }

    return this.prisma.org.create({
      data: {
        name: name,
        members: {
          create: {
            userId: userId,
            roleId: ownerRole.id,
          },
        },
      },
    });
  }
  findAll() {
    return `This action returns all orgs`;
  }
  findOne(id: string) {
    return `This action returns a #${id} org`;
  }
  update(id: string, updateOrgDto: UpdateOrgDto) {
    return `This action updates a #${id} org`;
  }
  remove(id: string) {
    return `This action removes a #${id} org`;
  }
}
