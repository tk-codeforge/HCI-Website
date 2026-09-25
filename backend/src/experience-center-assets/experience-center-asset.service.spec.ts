import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExperienceCenterAssetService } from './experience-center-asset.service';
import { ExperienceCenterAsset } from './entities/experience-center-asset.entity';

describe('ExperienceCenterAssetService', () => {
  let service: ExperienceCenterAssetService;

  // ExperienceCenterAssetService injects a TypeORM repository, so unlike
  // the CmsParentChildService spec this one needs to be mocked or Nest
  // has nothing to resolve @InjectRepository(ExperienceCenterAsset) with.
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceCenterAssetService,
        {
          provide: getRepositoryToken(ExperienceCenterAsset),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExperienceCenterAssetService>(
      ExperienceCenterAssetService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
