import express, { NextFunction, Request, Response } from 'express';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import logger from '../config/logger';
import { TenantController } from '../controllers/TenantController';

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository, logger);

const tenantController = new TenantController(tenantService, logger);
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  tenantController.create(req, res, next);
});

export default router;
