import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from "react-redux";
import { selectUser, MenuType } from '../store/slices/user';
import React, { useState } from "react";
import './Menu.css';

const Menu = () => {

  const userState = useSelector(selectUser);
  const menulist: MenuType[] = userState.menulist;
  const restaurantlist: String[] = ["학생식당","전망대(3식당)","기숙사식당","동원관식당(113동)","자하연식당", "301동식당","웰스토리(220동)","예술계식당(아름드리)","투굿(공대간이식당)","두레미담","아워홈"]
  const breakfastlist: MenuType[] = menulist.filter((menu)=>menu.mealtype==="breakfast")
  const lunchlist: MenuType[] = menulist.filter((menu)=>menu.mealtype==="lunch")
  const dinnerlist: MenuType[] = menulist.filter((menu)=>menu.mealtype==="dinner")

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index: number) => {
    setToggleState(index);
  };

    return (
      <div className="card menu-list overflow-auto">
        <div className="bloc-tabs">
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          >
            아침
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          >
            점심
          </button>
          <button
            className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(3)}
          >
            저녁
          </button>
        </div>
  
        <div className="content-tabs overflow-auto">
          <div className={toggleState === 1 ? "content  active-content overflow-auto" : "content"}>
            {
            restaurantlist.map((restaurant)=>(
              breakfastlist.filter((meal)=>meal.menuplace===restaurant).length===0 ? <div></div> : 
              <Card className="card-menu">
                <Card.Header>{restaurant}</Card.Header>
                <Card.Body>
                  <Card.Text>{breakfastlist.filter((meal)=>meal.menuplace===restaurant).map((meal)=>
                      <div>
                        <a>{meal.menuname}  {meal.menuprice}</a>
                        <a>{meal.menuextra}</a>
                      </div>
                        )}</Card.Text>
                </Card.Body>
              </Card>
            ))
          }
          </div>
  
          <div className={toggleState === 2 ? "content  active-content overflow-auto" : "content"}>
          {
            restaurantlist.map((restaurant)=>(
              lunchlist.filter((meal)=>meal.menuplace===restaurant).length===0 ? <div></div> : 
              <Card className="card-menu">
                <Card.Header>{restaurant}</Card.Header>
                <Card.Body>
                  <Card.Text>{lunchlist.filter((meal)=>meal.menuplace===restaurant).map((meal)=>
                      <div>
                        <a>{meal.menuname}  {meal.menuprice}</a>
                        <a>{meal.menuextra}</a>
                      </div>
                        )}</Card.Text>
                </Card.Body>
              </Card>
            ))
         }
          </div>
  
          <div className={toggleState === 3 ? "content  active-content overflow-auto" : "content"}>
          {
            restaurantlist.map((restaurant)=>(
              dinnerlist.filter((meal)=>meal.menuplace===restaurant).length===0 ? <div></div> : 
              <Card className="card-menu">
                <Card.Header>{restaurant}</Card.Header>
                <Card.Body>
                  <Card.Text>{dinnerlist.filter((meal)=>meal.menuplace===restaurant).map((meal)=>
                      <div>
                        <a>{meal.menuname}  {meal.menuprice}</a>
                        <a>{meal.menuextra}</a>
                      </div>
                        )}</Card.Text>
                </Card.Body>
              </Card>
            ))
          }
          </div>
        </div>
      </div>
    );
};

export default Menu;
