import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationEntity } from './entity/invitation.entity';
import { DataSource, Not, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { FindInvitationResponseDto } from './dto/find-invitation-response.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { FriendDto } from './dto/friend.dto';
import { SchoolEntity } from 'src/school/entity/school.entity';

@Injectable()
export class InvitationService {
  /** */
  constructor(
    @InjectRepository(InvitationEntity)
    private invitationRepository: Repository<InvitationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(SchoolEntity)
    private schoolRepository: Repository<SchoolEntity>,
    //
    private dataSoruce: DataSource,
  ) {}

  async createFriendInvitation(user: UserEntity): Promise<string> {
    return this.dataSoruce.manager.transaction(async (manager) => {
      const newInvitation = new InvitationEntity();
      user.invitateCnt++;
      user = await manager.save(user);
      newInvitation.inviter = user;
      newInvitation.fromName = user.instagramId;
      newInvitation.fromImageUrl = user.imageUrl;
      const { id: invitationId } = await manager.save(newInvitation);
      return invitationId;
    });
  }

  async createSchoolInvitation(schoolNm: string): Promise<string> {
    const school = await this.schoolRepository.findOneBy({
      name: schoolNm,
    });
    if (!school) {
      throw new NotFoundException('등록 안된 학교입니다.');
    }
    const newInvitation = new InvitationEntity();
    newInvitation.fromName = school.name;
    newInvitation.fromImageUrl = school.imageUrl;
    newInvitation.school = school;
    await newInvitation.save();

    return newInvitation.id;
  }

  async findInvitation(
    invitationId: string,
  ): Promise<FindInvitationResponseDto> {
    const 최대표시유저 = 15;

    const invitation = await this.invitationRepository.findOneBy({
      id: invitationId,
    });
    if (!invitation) return null;

    let friends = [];
    let otherUsers: UserEntity[] = [];
    let invitedUsers: UserEntity[] = [];
    if (invitation.school) {
      invitedUsers = await this.userRepository.find({
        where: {
          school: {
            name: invitation.school.name,
          },
        },
        take: 최대표시유저,
      });
      otherUsers = await this.userRepository.find({
        where: {
          school: {
            name: Not(invitation?.school?.name),
          },
        },
        take: 최대표시유저 - invitedUsers.length,
      });
    } else if (invitation.inviter) {
      invitedUsers = await this.userRepository.find({
        where: {
          inviter: {
            id: invitation.inviter.id,
          },
        },
        take: 3,
      });
      otherUsers = await this.userRepository.find({
        where: {
          inviter: {
            id: Not(invitation?.inviter?.id),
          },
        },
        take: 최대표시유저 - invitedUsers.length,
      });
    }

    friends = [...invitedUsers, ...otherUsers];

    return plainToClass(FindInvitationResponseDto, {
      ...invitation,
      friends: plainToInstance(FriendDto, friends),
    });
  }

  async acceptInvitation(invitationId: string, acceptor: UserEntity) {
    return this.dataSoruce.transaction(async (manager) => {
      const invitation = await manager.findOneBy(InvitationEntity, {
        id: invitationId,
      });
      if (!invitation) {
        throw new NotFoundException();
      }
      if (invitation.school) {
        acceptor.school = invitation.school;
      } else if (invitation.inviter) {
        acceptor.inviter = invitation.inviter;
        await manager.remove(invitation);
      }
      acceptor.isInvited = true;
      await manager.save(acceptor);
    });
  }
}
