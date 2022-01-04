/*
 * @Author: Suuny
 * @Date: 2021-12-17 09:56:12
 * @LastEditTime: 2021-12-22 18:19:52
 * @LastEditors: Suuny
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /monitoring-sdk/src/utils.ts
 */


import { IPerCallback } from "./types";


// 是否支持 Performance 这个 API
export const isSupportPerformance = () => {
    const performance = window.performance;
    return (
        performance && 
        !!performance.getEntriesByType &&
        !!performance.now && 
        !!performance.mark
    )
}


// 是否是生产环境
export const isDev = () => {
    return process.env.NODE_ENV === 'devlopment';
}


// 
export const getObserver = (type: string, cb: IPerCallback) => {
    const perfObserve = new PerformanceObserver((entryList) => {
        cb(entryList.getEntries());
    })
    perfObserve.observe({
        type, 
        buffered: true
    })
}


// 最后隐藏的时间
export let hiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity;


// 各个指标的分值
export const scores: Record<string, number[]> = {
    fcp: [2000, 4000],
    lcp: [2500, 4500],
    fid: [100, 300],
    tbt: [300, 600],
    cls: [0.1, 0.25]
}


// 分值水平  好的/需要改进的/不好的
export const scoreLevel = ['good', 'needsImprovement', 'poor'];


// 获取分值
export const getScore = (type: string, data: number) => {
    const score = scores[type];
    for(let i = 0; i < score.length; i++) {
        if(data <= score[i]) {
            return scoreLevel[i];
        }
    }
    return scoreLevel[2];
}
