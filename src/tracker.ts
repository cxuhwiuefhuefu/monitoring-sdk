/*
 * @Author: your name
 * @Date: 2021-12-16 18:32:17
 * @LastEditTime: 2021-12-16 18:49:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /monitoring-sdk/src/tracker.ts
 */

import { config } from "./config";
import { IPerData, IPerDataType } from './type';

const allData: Partial<Record<IPerDataType, IperData>> = {};

const typeMap: Record<string, IPerDataType> = {
    'Navigation Time': 'navigationTime',
    'Network Info': 'networkInfo',
    FCP: 'fcp',
    FP: 'FP',
    'LCP Update': 'lcp',
    'CLS Update': 'cls',
    TBT: 'tbt',
    FID: 'fid',
    TTI: 'tti'
}

export default (type: string, data: IPerData) => {
    const currentType = typeMap[type];
    allData[currentType] = data;
    config.tracker && config.tracker(currentType, data, allData);
}