import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelType } from '../../common/enums/channel-type.enum';
import { Company } from '../../common/interfaces/company.interface';

@Injectable()
export class CompanyService {
  private companies: Company[] = [
    {
      id: '1',
      name: 'Amazon',
      subscribedChannels: [ChannelType.EMAIL, ChannelType.UI],
    },
    {
      id: '2',
      name: 'Boeing',
      subscribedChannels: [ChannelType.UI],
    },
    {
      id: '3',
      name: 'Cisco',
      subscribedChannels: [ChannelType.EMAIL],
    },
  ];

  getCompanyById(companyId: string): Company {
    const company = this.companies.find((company) => company.id === companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
    return company;
  }

  isSubscribedToChannel(companyId: string, channel: ChannelType): boolean {
    const company = this.getCompanyById(companyId);
    return company.subscribedChannels.includes(channel);
  }
}
