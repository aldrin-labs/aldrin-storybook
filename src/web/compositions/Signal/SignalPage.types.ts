export type IState = {}

export interface IProps {
  el: {
    isPrivate: boolean
    name: string
    _id: string
    updatedAt: number | string
    eventsCount: number | string
  }
  onClick: () => void
  isSelected: boolean
  openDialog: (_id: string) => void
  toggleEnableSignal: (
    arg: any,
    arg2: string,
    arg3: boolean,
    update: (obj: object) => void
  ) => void
  index: number
  _id: string
  enabled: boolean
  updateSignalMutation: (obj: object) => void
}
