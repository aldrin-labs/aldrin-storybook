import { WithStyles } from '@material-ui/core';
import React from 'react';

type T = string | number;
type TObj = {
  render: string;
  color: string;
  isNumber: boolean;
  style: any;
};

export type Cell = T & TObj;

export type OnChange = (id: number) => void;

export type OnChangeWithEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;

export type Row = Cell[];
export type ExtendableRow = Cell[];

export type Rows = { head: TObj[]; body: Row[]; footer: Row };

export interface Props extends WithStyles {
  withCheckboxes?: boolean;
  expandableRows?: boolean;
  // removes animation from checkbox
  staticCheckbox?: boolean;
  padding: 'default' | 'checkbox' | 'dense' | 'none';
  rows?: Rows;
  checkedRows?: number[];
  expandedRows?: number[];
  title?: string | number;
  onChange?: OnChange & OnChangeWithEvent;
  onSelectAllClick?: OnChange & OnChangeWithEvent;
  // Shadow depth, corresponds to dp in the spec. It's accepting values between 0 and 24 inclusive.
  elevation?: number;
}
