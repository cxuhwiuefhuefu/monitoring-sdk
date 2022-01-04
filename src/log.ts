/*
 * @Author: your name
 * @Date: 2021-12-16 18:23:26
 * @LastEditTime: 2021-12-16 18:30:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /monitoring-sdk/log.ts
 */

import tracker from './tracker';
import { IPerData } from './type';
import { config } from './config';

export const log = (message?: any) {
    if(!config.log) {
        return;
    }
    console.log(
        `%cPer`,
        'background: #606060;color:white;padding:1px 10px;border-raduis: 3px',
        message
    )
}

export const logIndicator = (type: string, data: IPerData, measure = fasle) => {
    !measure && tracker(type, data);
    if(!config.log) {
        return;
    }
    console.log(
        `%cPer%c${type}`,
        'background: #606060; color: white; padding: 1px 10px; border-top-left-radius: 3px; border-bottom-left-radius: 3px;',
        'background: #1475b2; color: white; padding: 1px 10px; border-top-right-radius: 3px;border-bottom-right-radius: 3px;',
        data
    )
}