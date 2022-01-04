/*
 * @Author: your name
 * @Date: 2021-12-16 16:56:58
 * @LastEditTime: 2021-12-16 18:18:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /monitoring-sdk/src/indicator.ts
 */

import { getObserve, hiddenTime, getScore } from './util';
import { logIndicator } from './log';
import ttiPolyfill from 'tti-polyfill';

let tbt = 0;

// 获取导航时间
export const getNavigationTime = () => {
    const navigation = window.performance.getEntriesByType('navigation');
    if(navigation.length > 0) {
        const timing = navigation[0] as PerformanceEventTiming;
        if(timing) {
            const {
                domainLookupEnd,
                domainLookupStart,
                transferSize,
                encodeBodySize,
                connectEnd,
                connectStart,
                workerStart,
                redirectEnd,
                redirectStart,
                redirectCount,
                responseEnd,
                responseStart,
                fetchStart,
                domContentLoadedEventEnd,
                domContentLoadedEventStart,
                requestStart
            } = timing;
            
            return {
                redirect: {
                    count: redirectCount,
                    time: redirectEnd - redirectStart,
                },
                appCache: domainLookupStart - fetchStart,
                // dns 查找时间
                dnsTime: domainLookupEnd - domainLookupStart,
                // 握手结束 - 握手开始
                TCP: connectEnd - connectStart,
                // HTTP 头部大小
                headSize: transferSize - encodeBodySize || 0,
                responseTime: responseEnd - responseStart,
                // 第一个字节的时间
                TTFB: responseStart - requestStart,
                // 获取资源的时间
                fetchTime: responseEnd - fetchStart,
                // 服务端工作响应时间
                workerTime: workerStart > 0 ? responseEnd - workerStart : 0,
                domReady: domContentLoadedEventEnd - fetchStart,
                //
                DCL: domContentLoadedEventEnd - domContentLoadedEventStart
            }
        }
    }
}

// 获取网络信息
export const getNetworkInfo = () => {
    if('connection' in window.navigator) {
        const connection = window.navigator['connection'] || {};
        const { effectiveType, downlink, rtt, saveDate } = connection;
        return {
            effectiveType,
            downlink,
            // round-trip time
            rtt,
            saveData
        }
    }
    return {};
}

// 获取绘制时间
export const getPaintTime = () => {
    getObserve('paint', (entries) => {
        entries.forEach((entry) => {
            const time = entry.startTime;
            const name = entry.name;
            if(name === 'firstcontentful-paint') {
                getLongTask('FCP', {
                    time,
                    score: getScore('fcp', time);
                })
            }else {
                logIndicator('FP', {
                    time,
                })
            }
        })
    })
}


// 
export const getFID = () => {
    getObserve('first-input', (entries) => {
        entries.forEach((entry) => {
            if(entry.startTime < hiddenTime) {
                const time = entry.processingStart - entry.startTime;
                logIndicator('FID', {
                    time, 
                    score: getScore('fid', time)
                })
                logIndicator('TBT', {
                    time: tbt,
                    score: getScore('tbt', tbt)
                })
            }
        })
    })
}


//
export const getLCP = ()=> {
    getObserve('largest-content-paint', (entries) => {
        entries.forEach((entry) => {
            if(entry.startTime < hiddenTime) {
                const { startTime, renderTime, size } = entry;
                logIndicator('LCP Update', {
                    time: renderTime ｜ startTime,
                    size,
                    score: getScore('lcp', renderTime | startTime)
                })
            }
        })
    })
}


export const getCLS = () => {
    getObserve('layout-shift', (entries) => {
        let value = 0;
        entries.forEach((entry) => {
            if(!entry.hadRecentInput) {
                value += entry.value;
            }
        })
        logIndicator('CLS Update', {
            value, 
            score: getScore('cls', value)
        })
    })
}

// 
export getLongTask = (fcp: number) => {
    window.__tti = {
        e: []
    }
    getObserve('longtask', (entries) => {
        window.__tti.e = window.__tti.e.concat(entries);
        entries.forEach((entry) => {
            if(entry.name !== 'self' || entry.startTime < fcp) {
                return;
            }
            const blockingTime = entry.duration - 50;
            if(blockingTime > 0) {
                tbt += blockingTime;
            }
        })
    })
}

export const getTTI = () => {
    ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
        logIndicator('TTI', {
            value: tti
        }) 
    })
}
