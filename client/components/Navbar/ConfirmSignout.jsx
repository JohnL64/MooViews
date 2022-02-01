import React from 'react';
import css from '../../styles/Navbar.module.css';
import { useHistory} from 'react-router-dom';

const ConfirmSignout = ({ signout, setSignout }) => {
	const history = useHistory();

	function selectorName(name) {
		if (document.body.style.backgroundColor === 'black') return css[name];
		else return css[name + 'Alt'];
	}

	function logOutUser() {
		fetch('/signout')
			.then(res => res.json())
			.then(data => {
				if (data.signedOut) {
        	history.go(0);
				}
			})
	}

	return (
		<div className={css.outerSO}>
			<div className={css.signOutBox} onClick={() => setSignout(true)}>
				<p>Sign Out</p>
			</div>
				{ signout && 
				<div className={selectorName('confirmSO')}>
					<p>Are you sure?</p>
					<p>
						<span onClick={logOutUser}>Yes</span>
						<span onClick={() => setSignout(false)}>No</span>
					</p>
				</div>}
		</div>
	)
};

export default ConfirmSignout;
