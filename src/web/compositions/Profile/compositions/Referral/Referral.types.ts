import { withSnackbarProps } from 'notistack'

export interface IProps extends withSnackbarProps {
  getReferralCodeQuery: {
    getReferralCode: {
      referralCode: string
    }
  }
  getReferralsQuery: {
    getReferrals: {
      count: number
    }
  }
  registerSharedReferralLinkMutation: (mutationObj: {
    variables: {
      link: string
    }
  }) => Promise<{
    data: {
      registerSharedReferralLink: {
        status: 'ERR' | 'OK'
        errorMessage: string
      }
    }
  }>
}
