import { getRandomInt } from "@core/utils/helpers"

const hints = [
  "On May 22, 2010, a man in Florida paid 10,000 bitcoin for two pizzas. This is generally recognized as the first commercial crypto transaction.",
  "Everyone wants to get in on cryptocurrencies. This is why new currencies are popping up in the industry daily. As of now, there are over 5,000 different currencies in the world.",
  "Solana's scalability ensures transactions remain less than $0.01 for both developers and users.",
  "Solana is all about speed, with 400 millisecond block times. And the more people use it, the faster it gets.",
  "Not only is Solana ultra-fast and low cost, it's censorship resistant. Meaning, the network will remain open for applications to run freely and transactions will never be stopped.",
  "The core Solana innovation is Proof of History (POH), a globally-available, permissionless source of time in the network that works before consensus.",
  "We really appreciate your feedback, which you can share by clicking on the button in the top left corner. Let’s keep making it more simple and powerful together!",
  "The markets on Aldrin DEX are sorted by category and packed with lots of relevant information.",
]

export const getRandomHint = (): string => {
  return hints[getRandomInt(0, hints.length)]
}