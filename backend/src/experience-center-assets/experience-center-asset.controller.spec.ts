import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceCenterAssetController } from './experience-center-asset.controller';
import { ExperienceCenterAssetService } from './experience-center-asset.service';

describe('ExperienceCenterAssetController', () => {
  let controller: ExperienceCenterAssetController;

  // ExperienceCenterAssetService itself needs a repository, so it can't be
  // instantiated directly here the way the CmsParentChildController spec
  // does — the service is mocked instead, same end result ("should be
  // defined") without dragging TypeORM into a controller test.
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByTypeAndSlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceCenterAssetController],
      providers: [
        { provide: ExperienceCenterAssetService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ExperienceCenterAssetController>(
      ExperienceCenterAssetController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
