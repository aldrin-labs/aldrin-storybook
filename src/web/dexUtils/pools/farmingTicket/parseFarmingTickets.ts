import { Program } from '@project-serum/anchor'

import {
  GetProgramAccountsResult,
  GetProgramAccountsResultItem,
} from '@sb/dexUtils/common/types'

const parseFarmingTicket = ({
  ticket,
  program,
}: {
  ticket: GetProgramAccountsResultItem
  program: Program
}) => {
  const data = Buffer.from(ticket.account.data)
  const ticketData = program.coder.accounts.decode('FarmingTicket', data)

  const statesAttached = ticketData.statesAttached
    .map((el) => {
      return {
        farmingState: el.farmingState.toString(),
        lastVestedWithdrawTime: el.lastVestedWithdrawTime.toNumber(),
        lastWithdrawTime: el.lastWithdrawTime.toNumber(),
      }
    })
    .filter((el) => el.lastWithdrawTime > 0)

  return {
    tokensFrozen: ticketData.tokensFrozen.toNumber(),
    endTime: ticketData.endTime.toString(),
    startTime: ticketData.startTime.toString(),
    pool: ticketData.pool.toString(),
    userKey: ticketData.userKey.toString(),
    farmingTicket: ticket.pubkey.toString(),
    amountsToClaim: [{ amount: 0, farmingState: '' }],
    statesAttached,
  }
}

const parseFarmingTickets = ({
  tickets,
  program,
}: {
  tickets: GetProgramAccountsResult
  program: Program
}) => {
  return tickets.map((ticket) => parseFarmingTicket({ ticket, program }))
}

export { parseFarmingTickets }
