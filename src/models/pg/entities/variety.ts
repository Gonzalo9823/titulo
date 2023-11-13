import { CommodityModel } from '~/models/pg/entities/commodity';
import { CustomBaseModel } from '~/models/pg/entities/custom-base';

export interface VarietyModel extends CustomBaseModel {
  name: string;
  commodity: Omit<CommodityModel, 'varieties'>;
}
