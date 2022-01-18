import { FarmingTicket, FarmingState } from "./types";

interface GetTicketParams {
  tickets: FarmingTicket[]
  farmingState: FarmingState
}
export const getTicketsAvailableToClose = ({ tickets, farmingState }: GetTicketParams) =>
  tickets.filter((t) => (parseFloat(t.startTime) + farmingState.periodLength) * 1000 < Date.now())