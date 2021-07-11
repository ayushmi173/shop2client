import { BadRequestException, Injectable } from '@nestjs/common';
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
    console.log('enter in service');
    const catagoryEntity = this.catagoryService.create({ ...dto });
    const catagory = await this.catagoryService.save(catagoryEntity);
    if (!catagory) throw new BadRequestException('invalid data');
    console.log('db data', catagory);
    return catagory;
  }
}
