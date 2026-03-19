import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOrgDto } from './dto/update-org.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrgsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name: string) {
    const ownerRole = await this.prisma.role.upsert({
      where: { name: 'owner' },
      update: {},
      create: { name: 'owner' },
    });

    return this.prisma.org.create({
      data: {
        name,
        members: {
          create: {
            userId,
            roleId: ownerRole.id,
          },
        },
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.org.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const org = await this.prisma.org.findFirst({
      where: {
        id,
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async update(userId: string, id: string, updateOrgDto: UpdateOrgDto) {
    await this.ensureOwnerAccess(userId, id);

    return this.prisma.org.update({
      where: { id },
      data: {
        name: updateOrgDto.name,
      },
      include: {
        members: {
          include: {
            role: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwnerAccess(userId, id);

    await this.prisma.org.delete({
      where: { id },
    });

    return { message: 'Organization deleted successfully' };
  }

  private async ensureOwnerAccess(userId: string, orgId: string) {
    const membership = await this.prisma.orgMember.findFirst({
      where: {
        userId,
        orgId,
      },
      include: {
        role: true,
      },
    });

    if (!membership) {
      throw new NotFoundException('Organization not found');
    }

    if (membership.role.name !== 'owner') {
      throw new ForbiddenException(
        'Only organization owners can perform this action',
      );
    }

    return membership;
  }
}
