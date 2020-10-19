import React from 'react';
import { SnackbarProvider } from 'notistack';
import { withStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import SvgIcon from '@sb/components/SvgIcon';
import errorIcon from '@icons/errorIcon.svg';
import successIcon from '@icons/successIcon.svg';
import infoIcon from '@icons/infoIcon.svg';


const canselStyeles = (theme) => ({
	icon: {
		fontSize: 20
	}
});

const CloseButton = withStyles(canselStyeles)((props) => (
	<IconButton key="close" aria-label="Close" color="inherit">
		<CloseIcon className={props.classes.icon} />
	</IconButton>
));

const snackStyeles = (theme) => ({
	success: {
		color: '#fff',
		fontSize: '1.25rem',
		fontWeight: 'bold',
		// backgroundColor: theme.customPalette.green.main,
		background: 'rgba(22, 37, 61, 0.95)',
		boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
		backdropFilter: 'blur(4px)',
		borderRadius: '16px',
		flexGrow: 0
	},
	error: {
		color: '#fff',
		fontSize: '1.25rem',
		fontWeight: 'bold',
		// backgroundColor: theme.customPalette.red.main,
		background: 'rgba(22, 37, 61, 0.95)',
		boxShadow: '0px 0px 32px rgba(8, 22, 58, 0.1)',
		backdropFilter: 'blur(4px)',
		borderRadius: '16px',
		flexGrow: 0
	}
});

const IntegrationNotistack = ({ ...props }) => {
	console.log('snackbar rerender');
	return (
		<SnackbarProvider
			domRoot={document.getElementById('react-notification')}
			iconVariant={{
				success: (
					<SvgIcon
						src={successIcon}
						width="3.5rem"
						height="auto"
						style={{
							marginRight: '.8rem'
						}}
					/>
				),
				error: (
					<SvgIcon
						src={errorIcon}
						width="3.5rem"
						height="auto"
						style={{
							marginRight: '.8rem'
						}}
					/>
				),
				info: (
					<SvgIcon
						src={infoIcon}
						width="3.5rem"
						height="auto"
						style={{
							marginRight: '.8rem'
						}}
					/>
				)
			}}
			maxSnack={3}
			autoHideDuration={3000}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left'
			}}
			action={<CloseButton />}
			classes={{
				variantSuccess: props.classes.success,
        variantError: props.classes.error,
        variantInfo: props.classes.success,
			}}
		>
			{props.children}
		</SnackbarProvider>
	);
};

export default withStyles(snackStyeles)(IntegrationNotistack);
