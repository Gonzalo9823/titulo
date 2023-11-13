import { ClientModel } from '~/infrastructures/pg/entities/client';
import { CommodityModel } from '~/infrastructures/pg/entities/commodity';
import { CustomBaseModel } from '~/infrastructures/pg/entities/custom-base';
import { GrowerModel } from '~/infrastructures/pg/entities/grower';
import { GrowerFarmModel } from '~/infrastructures/pg/entities/grower-farm';
import { VarietyModel } from '~/infrastructures/pg/entities/variety';

export interface HarvestModel extends CustomBaseModel {
  grower: Omit<GrowerModel, 'farms'>;
  farm: Omit<GrowerFarmModel, 'grower'>;
  client: ClientModel;
  commodity: Omit<CommodityModel, 'varieties'>;
  variety: Omit<VarietyModel, 'commodity'>;
}
