interface Item {
    text: string,
    icon: any,
    to: string
}

export interface IProps {
    id: string,
    buttonText: string,
    items: Item[]
}
