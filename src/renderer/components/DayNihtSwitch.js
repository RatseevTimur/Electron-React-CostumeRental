import React, { useState, useEffect, useRef } from 'react';

// import { Button } from 'primereact/button';
// import { InputSwitch } from 'primereact/inputswitch';

import "./DayNihtSwitch.scss"

export default function DayNihtSwitch(props) {
  

    return (
        <div className="day-niht-switch">
            <label for="toggle">
                <input id="toggle" className="toggle-switch" type="checkbox" />
                    
                <div className="sun-moon">
                    <div className="dots"></div>
                </div>

                <div className="background">
                    <div className="stars1"></div>
                    <div className="stars2"></div>
                </div>

                {/* <div className="fill"></div> */}
            </label>
        </div>
    );
}
        