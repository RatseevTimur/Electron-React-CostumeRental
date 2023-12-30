import React, { useState, useEffect, useRef } from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DataService } from '../../service/DataService';
import { СostumesData } from '../../service/СostumesData';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { InputMask } from "primereact/inputmask";
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';


export default function DialogWindow(props) {
    const toast = useRef(null);

    // product={product} product={products} saveProduct={saveProduct} matches={matches}
    //             openDialogWindow={openDialogWindow} setOpenDialogWindow={setOpenDialogWindow} 
    //             dateFormat={dateFormat}

    useEffect(()=>{
        console.log(props.product)
    },[])

    // Функция удаления записи (Диологовое окно)
    const addProduct = () => {
      props.saveProduct()
      props.setOpenDialogWindow(false)
    };
   
    // Футер для окна удаления одной записи
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={()=>props.setOpenDialogWindow(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={addProduct} />
        </React.Fragment>
    );
  

    return (
        <Dialog visible={props.openDialogWindow} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
            header={<p><i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />Внимание!</p>} 
            modal footer={deleteProductDialogFooter} onHide={()=>props.setOpenDialogWindow(false)}>
            <div className="confirmation-content">
                {/* <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} /> */}
                {props.product && props.matches && (
                    <span>
                        Данный костюм выбран клиентом - <b>{props.matches.Клиент}</b>
                        <b>{props.dateFormat(props.matches.Дата)}</b> в <b>{props.matches.ВремяМероприятия}</b>
                        {props.matches.ПоловинаДня}
                        <br/>
                        <br/>
                        Вы уверены что успеете подготовить костюм, и хотите добавить эту запись <b>{props.product.Клиент}</b>?
                    </span>
                )}
            </div>
        </Dialog>
    );
}
        