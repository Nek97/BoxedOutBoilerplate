// @ts-nocheck
import { AssetCodeEnum } from '@boxedout-libs/shared/asset.enum';
import { BankEnum } from '@boxedout-libs/db-boxedoutAdmin/entities/fiat.enum';
import { FakerHelper } from '@nestjs-yalc/utils/faker-helper';
import * as faker from 'faker';

const fakerHelper = new FakerHelper();

export class DataGeneratorHelper {
  allAssetKeys: string[] = [];
  allFiatKeys: string[] = [];
  // Will return a key in the format (in/out)-<AssetSymbol>-xx, like in-BTC-503
  createAssetDatabaseKey = (): string => {
    const prefix = faker.datatype.number(1) === 1 ? 'in' : 'out';
    const asset = fakerHelper.randomFromEnum(AssetCodeEnum);
    const xx = this.allAssetKeys.length;
    const key = `${prefix}-${asset}-${xx}`;

    this.allAssetKeys.push(key);
    return key;
  };

  // Will return a key in the format (in/out)-<Bank>-xx, out is always bunq (our own bank), in uses the BankEnum
  createFiatDatabaseKey = (): string => {
    const prefix = faker.datatype.number(1) === 1 ? 'in' : 'out';
    let bank;
    if (prefix === 'out') {
      bank = 'bunq';
    } else {
      bank = fakerHelper.randomFromEnum(BankEnum);
    }
    const xx = this.allFiatKeys.length;
    const key = `${prefix}-${bank}-${xx}`;
    this.allFiatKeys.push(key);
    return key;
  };
}
