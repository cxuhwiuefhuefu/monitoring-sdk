/*
 * @Author: your name
 * @Date: 2021-12-16 16:34:32
 * @LastEditTime: 2021-12-21 17:03:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /monitoring-sdk/src/index.ts
 */

import { isSupportPerformance} from './utils';
import { log, logIndicator } from './log';
import {
    getNavigationTime,
    getNetworkInfo,
    getPaintTime,
    getFID,
    getLCP,
    getCLS,
    getTTI
} from './indicator';
import { hiddenTime } from './utils';
import { IPerCBProps, IPerProps } from './types';
import { config } from './config';

export default class PerMoniteur implements IPerprops {
    constructor(args: IPerCBProps) {
        config.tracker = args.tracker;
        if(typeof args.log === 'boolean') {
            config.log = args.log;
        }
        if(!isSupportPerformance) {
            log(`This broswer doesn't support Performance API`);
            return;
        }
        logIndicator('Navigation', getNavigationTime());
        logIndicator('Network Info', getNetworkInfo());
        getPaintTime();
        getFID();
        getLCP();
        getCLS();
        getTTI();

        document.addEventListener(
            'visibilitychange',
            (event) => {
                hiddenTime = Math.min(hiddenTime, event.timeStamp);
            },
            {
                once: true
            }
        )
    }
    markStart(name: string) {
        performance.mark(name);
    }
    markEnd(startName: string, endName: string) {
        performance.mark(endName);
        const measureName = `PerMoniteur-${startName}`;
        performance.measure(measureName, startName, endName);
        const measures = performance.getEntriesByName(measureName);
        measures.forEach((measure) => {
            logIndicator(measureName, measure, true)
        })
    }
    clearMarks(name?: string) {
        performance.clearMarks(name);
    }
    clearMeasures(name?: string) {
        performance.clearMeasures(`PerMoniteur-${name}`);
    }
    fmpStart() {
        this.markStart('fmp-start');
    }
    fmpEnd() {
        performance.mark('fmp-end');
        performance.measure('fmp', 'fmp-start', 'fmp-end');
        const measures = performance.getEntriesByName('fmp');
        measures.forEach('fmp', {
            time: measure.duration
        })
    }
}

