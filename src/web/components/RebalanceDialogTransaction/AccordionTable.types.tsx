export interface IProps {
    classes: any,
    data: {
        convertedFrom: string,
        convertedTo: string, 
        sum: number,
        isDone: boolean
    },
    accordionTitle: string
}

export interface IState {
    expanded: boolean
}