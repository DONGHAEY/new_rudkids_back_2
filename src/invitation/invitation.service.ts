import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationEntity } from './entity/invitation.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { InvitationDto } from './dto/response/invitation.dto';
import { InvitationTypeEnum } from './entity/enum/invitation-type.enum';
import { CommunityEntity } from 'src/community/entity/community.entity';
import { plainToInstance } from 'class-transformer';
import { InvitedUserDto } from './dto/response/invited-user.dto';
import { CreateCommunityInvitationDto } from './dto/request/create-community-invitation.dto';
import { OnboardingStepEnum } from 'src/user/entity/enum/onboarding-step.enum';

@Injectable()
export class InvitationService {
  /** */
  constructor(
    @InjectRepository(InvitationEntity)
    private invitationRepository: Repository<InvitationEntity>,
    @InjectRepository(CommunityEntity)
    private communityRepository: Repository<CommunityEntity>,
    private dataSoruce: DataSource,
  ) {}

  private static minMarkUserAmount = 15;

  async createFriendInvitation(user: UserEntity): Promise<string> {
    if (user.onboardingStep < OnboardingStepEnum.COMPLETE_SET_INSTAGRAM) {
      throw new ConflictException(
        '인스타그램 등록 완료 사용자들이 이용할 수 있습니다.',
      );
    }
    const newInvitation = new InvitationEntity();
    newInvitation.invitor = user;
    newInvitation.type = InvitationTypeEnum.FRIEND;
    newInvitation.description = `Invite Only From @${user.instagram.instagramId}`;
    newInvitation.acceptCnt = 0;
    newInvitation.maxAcceptCnt = 1;
    await newInvitation.save();
    return newInvitation.id;
  }

  async createCommunityInvitation(
    communityName: string,
    createCommunityInvitationDto: CreateCommunityInvitationDto,
  ): Promise<string> {
    const community = await this.communityRepository.findOneBy({
      name: communityName,
    });
    if (!community) {
      throw new NotFoundException('해당 커뮤니티는 존재하지 않네요..');
    }
    const newInvitation = new InvitationEntity();
    newInvitation.community = community;
    newInvitation.type = InvitationTypeEnum.COMMUNITY;
    newInvitation.description = createCommunityInvitationDto.description;
    newInvitation.acceptCnt = 0;
    newInvitation.maxAcceptCnt = createCommunityInvitationDto.maxAcceptCnt ?? 1;
    await newInvitation.save();
    return newInvitation.id;
  }

  async getInvitation(invitationId: string): Promise<InvitationDto> {
    const invitation = await this.invitationRepository.findOneBy({
      id: invitationId,
    });
    if (!invitation) return null;
    const findInvitationDto = new InvitationDto();
    findInvitationDto.type = invitation.type;
    findInvitationDto.description = invitation.description;
    findInvitationDto.acceptCnt = invitation.acceptCnt;
    findInvitationDto.maxAcceptCnt = invitation.maxAcceptCnt;
    switch (invitation.type) {
      case InvitationTypeEnum.COMMUNITY: {
        findInvitationDto.fromImageUrl = invitation.community.imageUrl;
        findInvitationDto.fromName = invitation.community.name;
        break;
      }
      case InvitationTypeEnum.FRIEND: {
        findInvitationDto.fromImageUrl = invitation.invitor.instagram.imageUrl;
        findInvitationDto.fromName = invitation.invitor.instagram.instagramId;
        break;
      }
    }
    return findInvitationDto;
  }

  async acceptInvitation(invitationId: string, acceptor: UserEntity) {
    if (acceptor.onboardingStep !== OnboardingStepEnum.COMPLETE_SIGNUP) {
      throw new HttpException('초대를 이미 수락했습니다', HttpStatus.ACCEPTED);
    }
    await this.dataSoruce.transaction(async (manager) => {
      const invitation = await manager.findOneBy(InvitationEntity, {
        id: invitationId,
      });
      if (!invitation) throw new NotFoundException();
      invitation.acceptCnt++;
      if (invitation.acceptCnt >= invitation.maxAcceptCnt) {
        await manager.remove(invitation);
      } else {
        await manager.save(invitation);
      }
      switch (invitation.type) {
        case InvitationTypeEnum.COMMUNITY: {
          acceptor.community = invitation.community;
          break;
        }
        case InvitationTypeEnum.FRIEND: {
          acceptor.invitor = invitation.invitor;
          break;
        }
      }
      acceptor.onboardingStep = OnboardingStepEnum.COMPLETE_ACCEPT_INVITATION;
      await manager.save(acceptor);
    });
  }

  async deleteInvitation(invitor: UserEntity, invitationId: string) {
    const invitation = await this.invitationRepository.findOneBy({
      id: invitationId,
      invitor: {
        id: invitor.id,
      },
    });
    if (!invitation) throw new NotFoundException();
    await invitation.remove();
  }

  async getMarkUsers(invitationId: string) {
    return this.dataSoruce.transaction(async (manager) => {
      const invitation = await manager.findOneBy(InvitationEntity, {
        id: invitationId,
      });
      if (!invitation) throw new NotFoundException();
      let invitedUsers = [];

      const defaultWhere = { onboardingStep: OnboardingStepEnum.FINISHED };

      switch (invitation.type) {
        case InvitationTypeEnum.COMMUNITY: {
          invitedUsers = await manager.findBy(UserEntity, {
            ...defaultWhere,
            community: {
              id: invitation.community.id,
            },
          });
          break;
        }
        case InvitationTypeEnum.FRIEND: {
          invitedUsers = await manager.findBy(UserEntity, {
            ...defaultWhere,
            invitor: {
              id: invitation.invitor.id,
            },
          });
          break;
        }
      }

      if (invitedUsers.length < InvitationService.minMarkUserAmount) {
        const moreRequireUserTake =
          InvitationService.minMarkUserAmount - invitedUsers.length;
        const otherUsers = await manager.find(UserEntity, {
          where: {
            ...defaultWhere,
            id: Not(In(invitedUsers.map((invitedUser) => invitedUser.id))),
          },
          take: moreRequireUserTake,
        });
        invitedUsers = [...invitedUsers, ...otherUsers];
      }

      return plainToInstance(InvitedUserDto, invitedUsers);
    });
  }
}
