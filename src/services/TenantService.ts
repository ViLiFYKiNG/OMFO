import { Repository } from 'typeorm';
import { Tenant } from '../entity/Tenant';
import { Logger } from 'winston';
import { ITenant } from '../types';

export class TenantService {
  constructor(
    private tenantRepository: Repository<Tenant>,
    private logger: Logger,
  ) {}

  async create(tenantData: ITenant) {
    return await this.tenantRepository.save(tenantData);
  }
}
