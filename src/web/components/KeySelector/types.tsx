export interface Key {
  exchange: string
  name: string
  keyId: string
}

export interface IProps {
  selectedKey: Key
  keys: [Key]
  selectKey: (value: Key) => any
}