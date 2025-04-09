import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import 'reflect-metadata';
import { JobOfferQueryDto } from './job-offer-query.dto';

// This test suite is just to make sure separating the skills is working
// correctly and that the page and size are being converted to numbers
describe('JobOfferQueryDto', () => {
  it('should convert and validate comma-separated skills', async () => {
    const input = {
      skills: 'react,nodejs,vue',
      page: '2',
      size: '10',
    };

    const dto = plainToInstance(JobOfferQueryDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.skills).toEqual(['react', 'nodejs', 'vue']);
    expect(dto.page).toBe(2);
    expect(dto.size).toBe(10);
  });
});
