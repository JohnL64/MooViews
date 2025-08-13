import React, { useState } from 'react';
import css from '../../styles/Navbar.module.css';
import { useHistory} from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

const ConfirmSignout = ({ signout, setSignout }) => {
	const [signingOut, setSigningOut] = useState(false);
	const history = useHistory();

	function logOutUser() {
		setSigningOut(true);
		fetch('/signout')
			.then(res => res.json())
			.then(data => {
				if (data.signedOut) {
        	history.go(0);
				}
			})
	}

	function changeSignoutAndScroll(signoutChoice) {
		if (signoutChoice) {
			document.body.style.overflow = 'hidden';
			setSignout(true);
		} else {
			document.body.style.overflow = 'auto';
			setSignout(false);
		}
	}

	return (
		<div className={css.outerSignOut}>
			<div className={css.signOutBox} onClick={() => changeSignoutAndScroll(true)}>
				<p>Sign Out</p>
			</div>
				{ signout && <div className={css.outerConfirmSignOut} onClick={() => changeSignoutAndScroll(false)}>
					<div className={css.confirmSignOut} onClick={(e) => e.stopPropagation()}>
						<IoClose className={css.closeSignOut} onClick={() => changeSignoutAndScroll(false)}/> 
						<p className={css.mooViewsTitle}>Moo<span>Views</span></p>
						{!signingOut && <div className={css.signOutContent}>
							<p className={css.confirmQ}>Are you sure you want to sign out?</p>
							<div className={css.signOutChoice}>
								<p className={css.confirmYesNo} onClick={logOutUser}>Yes</p>
								<p className={css.confirmYesNo} onClick={() => changeSignoutAndScroll(false)}>No</p>
							</div>
						</div>} 
						{signingOut && <div className={css.signingOut}> 
							<div className='loadingDots' id={css.signOutDots}>
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>}
					</div>
				</div>}
		</div>
	)
};

export default ConfirmSignout;
