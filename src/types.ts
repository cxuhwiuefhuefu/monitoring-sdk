/*
 * @Author: your name
 * @Date: 2021-12-16 18:50:04
 * @LastEditTime: 2021-12-20 15:15:52
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /monitoring-sdk/src/types.ts
 */

export type IPerCallback = (entries: any[]) => void;

export interface IPerCBProps {
    tracker?: (type: IPerDataType, data: any, allData: any) => void;
    log?: boolean
}

export type IPerDataType = 
    | 'navigationTime'
    | 'networkInfo'
    | 'fcp'
    | 'lcp'
    | 'cls'
    | 'fid'
    | 'tbt'
    | 'tti'
    | 'fmp'

export interface IPerProps {
    markStart: (name: string) => void,
    markEnd: (startName: string, endName: string) => void,
    clearMarks: (name?: string) => void,
    clearMeasures: (name?: string) => void,
    fmpStart: () => void,
    fmpEnd: () => void
}
