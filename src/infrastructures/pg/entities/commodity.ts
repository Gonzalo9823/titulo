import { CustomBaseModel } from '~/infrastructures/pg/entities/custom-base';
import { VarietyModel } from '~/infrastructures/pg/entities/variety';

export interface CommodityModel extends CustomBaseModel {
  name: string;
  varieties: Omit<VarietyModel, 'commodity'>[];
}
