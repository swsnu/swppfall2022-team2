import React from 'react';
import ChatList from './chatting/ChatList';
import Menu from './menus/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectUser } from './store/slices/user';
import { AppDispatch } from './store';
import { setSignOut } from './store/slices/user';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css';

const Main: React.FunctionComponent = () => {
  const userState = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  if (userState.loggedinuser === null) {
    return <Navigate to='/login' />;
  }

  const handleRedirect = () => {
    navigate('/matching');
  };

  const handleMyPage = () => {
    navigate('/mypage');
  };

  const handleLogout = () => {
    dispatch(setSignOut(userState.loggedinuser?.user ?? { id: 0, username: 'noone' }))
      .catch((err) => console.log(err))
      .then();
  };

  return (
    <div>
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
              <a className='nav-link active' aria-current='page' href='#'>
                Home
              </a>
              <a className='nav-link' onClick={handleRedirect}>
                Matching
              </a>
              <a className='nav-link' onClick={handleMyPage}>
                My Page
              </a>
              <a className='nav-link'>Board</a>
              <a className='nav-link' onClick={handleLogout}>
                Log out
              </a>
              <span className='navbar-text ms-auto'>
                Logged in as {userState.loggedinuser.user.username}
              </span>
            </div>
          </div>
        </div>
      </nav>
      <div className='chat-list'>
        <ChatList />
      </div>
      <div className='menu-list'>
        <Menu />
      </div>
    </div>
  );
};

export default Main;
