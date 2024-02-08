import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from "react-router-dom";

import { TabMenu } from 'primereact/tabmenu';

const TabMenuRouts = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);



    const items = [
        {label: 'Учет', icon: 'pi pi-fw pi-bars', href: ''},
        {label: 'База', icon: 'pi pi-database', href: 'costumers-table'},
        {label: 'Статистика по Костюмам', icon: 'pi pi-chart-bar', href: 'stats'},
        {label: 'Фильтры', icon: 'pi pi-chart-bar', href: 'filters'}
    ];

   const navigator = (e) => {
    setActiveIndex(e.index)
    navigate(`/${e.value.href}`)
   }

    return (
        <div>
            <div className="card" style={{marginBottom: 5}}>
                <TabMenu model={items} 
                    activeIndex={activeIndex}
                    onTabChange={(e) => navigator(e)}
                />
            </div>
        </div>
    );
}

export default TabMenuRouts