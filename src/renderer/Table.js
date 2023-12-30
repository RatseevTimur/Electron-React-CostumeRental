// import React, { useState, useEffect, useRef } from 'react';
// import React, { useEffect, useState, useRef, Suspense } from "react";

import 'react-tabulator/lib/styles.css';
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet
import { ReactTabulator } from 'react-tabulator'

// const Box = React.lazy(() => import('../components/3D/Box.js'));
// const Gforma = React.lazy(() => import('../components/3D/Gforma.js'));
// const Pforma = React.lazy(() => import('../components/3D/Pforma.js'));

const DataTable = () => {
  const columns = [
    { title: "Номер", field: "number", width: 60, hozAlign: "center" },
    { title: "Название", field: "name", width: 150 },
    { title: "Дата", field: "date", width: 80 },
    { title: "Половина дня", field: "half", width: 80 },

    { title: "Клиент", field: "client", width: 60, hozAlign: "center" },
    { title: "Адрес Клиента", field: "adress", width: 150 },
    { title: "Телефон", field: "phone", width: 80 },
    { title: "Место мероприятия", field: "eventAdress", width: 80 },

    { title: "Время мероприятия", field: "eventTime", width: 80 },
    { title: "Примечание", field: "notes", width: 80 },
    { title: "Залог", field: "half", width: 80 },
    { title: "Цена", field: "price", width: 80 },
    { title: "Свободность", field: "boolean", width: 80 },
    { title: "Возврат", field: "status", width: 80 },

    // { title: "Age", field: "age", hozAlign: "left", formatter: "progress" },
    // { title: "Favourite Color", field: "col" },
    // { title: "Date Of Birth", field: "dob", hozAlign: "center" },
    // { title: "Rating", field: "rating", hozAlign: "center", formatter: "star" },
    // { title: "Passed?", field: "passed", hozAlign: "center", formatter: "tickCross" }
  ];

  var data = [
    {id:1, number: 1, name:"AAAA", 
      date: "12.12.23", half: 2, adress: "Ч12", phone: "9526034176", eventAdress: "Л21", eventTime: "16:00",
      notes: "Добавить что-то", price: 300, boolean: true, status: false,

      age:"12", col:"red", dob:""
    },
    // {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
    // {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
    // {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
    // {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
  ];

  return (
    <ReactTabulator data={data} columns={columns} layout={"fitData"} />
  );
}

export default DataTable;