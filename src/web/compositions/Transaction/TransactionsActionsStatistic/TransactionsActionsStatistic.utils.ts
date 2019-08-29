export const getActionsSummary = (actions: any[]) =>
  actions
    ? actions.reduce(
        (sum, action) => {
          if (!action.isAccountTrade) {
            return {
              ...sum,
              trades: sum.trades + 1,
            }
          } else if (action.type === 'deposit') {
            return {
              ...sum,
              deposits: sum.deposits + 1,
            }
          }

          return {
            ...sum,
            withdrawals: sum.withdrawals + 1,
          }
        },
        {
          deposits: 0,
          withdrawals: 0,
          trades: 0,
        }
      )
    : {
        deposits: 0,
        withdrawals: 0,
        trades: 0,
      }
