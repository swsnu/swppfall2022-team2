import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, setSignOut } from './store/slices/user';
import { AppDispatch } from './store';
import './NavBar.css';
const NavBar: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);
  const handleRedirect = () => {
    navigate('/matching');
  };

  const handleMyPage = () => {
    navigate('/mypage');
  };
  const handleMain = () => {
    navigate('/main');
  };
  const handleLogout = () => {
    try{dispatch(setSignOut(userState.loggedinuser?.user ?? { id: 0, nickname: 'noone'}));
      navigate('/login');
      }
        catch(err){
            
        }
  };

  return (
    <nav className='navbar sticky-top navbar-expand-lg navbar-light bg-light'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='#'>
          <img
            src={require('./images/logo.jpg')}
            alt=''
            width='30'
            height='24'
            className='d-inline-block align-text-top'
          />
          밥친구
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarText'
          aria-controls='navbarText'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
          <div className='navbar-nav'>
            <a className='nav-link active' aria-current='page' onClick={handleMain}>
              Home
            </a>
            <a className='nav-link' onClick={handleRedirect}>
              Matching
            </a>
            <a className='nav-link' onClick={handleMyPage}>
              MyPage
            </a>
            <span className='loginusertext'>
              Logged in as {userState.loggedinuser?.user.nickname}
            </span>
            <a className='nav-link-logout' onClick={handleLogout}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
