import { WithStyles } from '@material-ui/core';
import React from 'react';
declare type T = string | number;
declare type TObj = {
    render: string;
    color: string;
    isNumber: boolean;
    style: any;
};
export declare type Cell = T & TObj;
export declare type OnChange = (id: number) => void;
export declare type OnChangeWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;
export declare type Row = Cell[];
export declare type ExtendableRow = Cell[];
export declare type Rows = {
    head: TObj[];
    body: Row[];
    footer: Row;
};
export interface Props extends WithStyles {
    withCheckboxes?: boolean;
    expandableRows?: boolean;
    staticCheckbox?: boolean;
    padding: 'default' | 'checkbox' | 'dense' | 'none';
    rows?: Rows;
    checkedRows?: number[];
    expandedRows?: number[];
    title?: string | number;
    onChange?: OnChange & OnChangeWithEvent;
    onSelectAllClick?: OnChange & OnChangeWithEvent;
    elevation?: number;
}
export {};
