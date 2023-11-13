import { CommodityModel } from '~/infrastructures/pg/entities/commodity';
import { CustomBaseModel } from '~/infrastructures/pg/entities/custom-base';

export interface VarietyModel extends CustomBaseModel {
  name: string;
  commodity: Omit<CommodityModel, 'varieties'>;
}
