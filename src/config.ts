/*
 * @Author: your name
 * @Date: 2021-12-16 16:30:31
 * @LastEditTime: 2021-12-16 16:32:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /monitoring-sdk/src/config.ts
 */

import { IPerCBProps } from './types';
import { isDev } from './utils';

export const config: IPerCBProps = {
    tracker: () => {},
    log: isDev()
}
