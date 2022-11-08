import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

const Menu = () => {

    return(
        <div className="card menu-list overflow-auto">
            <div className="card-header">
                <h5 className="card-title">Today's Menu</h5>
            </div>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="home" title="아침">
                <div className="row">
                    <div className="col-sm-6">
                            <Card border="primary">
                                <Card.Header>학생회관</Card.Header>
                                <Card.Body>                 
                                    <Card.Text>
                                        제육볶음    3000
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                    </div>
                    <div className="col-sm-6">
                        <Card border="secondary" style={{ width: '17rem' }}>
                            <Card.Header>아워홈</Card.Header>
                            <Card.Body>                 
                                <Card.Text>
                                    야채탕&청포묵김가루무침    3000<br/>
                                    베이글&마늘빵&슬라이스햄&치즈   4000
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <Card border="success" style={{ width: '17rem' }}>
                            <Card.Header>기숙사식당</Card.Header>
                            <Card.Body>                 
                                <Card.Text>
                                    제육숙주볶음    4500
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>                       
                </Tab>
                <Tab eventKey="profile" title="점심">
                   
                </Tab>
                <Tab eventKey="contact" title="저녁">
                    
                </Tab>
            </Tabs>
       </div>
    )
}
    


export default Menu;