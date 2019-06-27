export interface IProps {
    dialogHedaing: string,
    titleDescription: string,
    btnFirst: string,
    btnSecond: string,
    accordionTitle: string,
    data: {
        convertedFrom: string,
        convertedTo: string, 
        sum: number,
        isDone: boolean
    }
}

export interface IState {
  open: boolean
}