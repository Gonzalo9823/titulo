import { CustomBaseModel } from '~/models/pg/entities/custom-base';
import { VarietyModel } from '~/models/pg/entities/variety';

export interface CommodityModel extends CustomBaseModel {
  name: string;
  varieties: Omit<VarietyModel, 'commodity'>[];
}
