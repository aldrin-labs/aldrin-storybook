export interface IState {
    period: string,
    labelWidth: number,
}

export interface IProps {
    classes: any, 
    rebalanceOption: string[]
    // ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Every ___ Days', 'STOP REBALANCE'];
}