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
    try {
      dispatch(setSignOut(userState.loggedinuser?.user ?? { id: 0, nickname: 'noone' }));
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <nav className='navbar sticky-top navbar-expand-lg navbar-light bg-light'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='#'>
          <img
            src={require('./images/babchingu_navbar_logo.png')}
            alt=''
            width='48'
            height='38'
            className='d-inline-block align-text-top'
          />
        </a>
        {/* <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarText'
          aria-controls='navbarText'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
        </button> */}
        <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
          <div className='navbar-nav'>
            <a className='nav-link active' aria-current='page' onClick={handleMain}>
              홈
            </a>
            <a className='nav-link' onClick={handleRedirect}>
              친구 찾기
            </a>
            <a className='nav-link' onClick={handleMyPage}>
              마이페이지
            </a>
            <span className='loginusertext'>
              {userState.loggedinuser?.user.nickname}(으)로 접속 중
            </span>
            <a className='nav-link-logout' onClick={handleLogout}>
              로그아웃
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
