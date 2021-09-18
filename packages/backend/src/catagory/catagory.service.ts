import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCatagoryDTO, ICreateCatagoryDTO } from 'src/dtos/catagory';
import { CatagoryEntity } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CatagoryService {
  constructor(
    @InjectRepository(CatagoryEntity)
    private catagoryService: Repository<CatagoryEntity>,
  ) {}

  async createCatagory(dto: CreateCatagoryDTO): Promise<ICreateCatagoryDTO> {
    const catagoryName = await this.catagoryService.findOne({
      name: dto.name,
    });
    if (catagoryName)
      throw new NotAcceptableException('Catagory is already exist');

    const catagoryEntity = this.catagoryService.create({ ...dto });
    const catagory = await this.catagoryService.save(catagoryEntity);

    if (!catagory) throw new BadRequestException('Catagory is not saved');
    return catagory;
  }
}
