import React from "react";

import DateEditor from "react-tabulator/lib/editors/DateEditor";
import MultiValueFormatter from "react-tabulator/lib/formatters/MultiValueFormatter";
// import MultiSelectEditor from "react-tabulator/lib/editors/MultiSelectEditor";

import "react-tabulator/lib/styles.css"; // default theme
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)

import { ReactTabulator, reactFormatter } from "react-tabulator";

function SimpleButton(props) {
  const rowData = props.cell._cell.row.data;
  const cellValue = props.cell._cell.value || "Edit | Show";
  return <button onClick={() => alert(rowData.name)}>{cellValue}</button>;
}

const data = [
  // {
  //   id: 1,
  //   name: "Oli Bob",
  //   age: "12",
  //   color: "red",
  //   dob: "01/01/1980",
  //   rating: 5,
  //   passed: true,
  //   pets: ["cat", "dog"]
  // },
  {
    id:1, 
    number: 1, 
    name:"AAAA", 
    date: "12.12.23", 
    half: 2, 
    adress: "Ч12", 
    phone: "9526034176", 
    eventAdress: "Л21", 
    eventTime: "16:00",
    notes: "Добавить что-то", 
    price: 300, 
    boolean: true, 
    status: false,
  },
];

// Editable Example:
const colorOptions = {
  "": "&nbsp;",
  red: "red",
  green: "green",
  yellow: "yellow"
};
const petOptions = [
  { id: "cat", name: "cat" },
  { id: "dog", name: "dog" },
  { id: "fish", name: "fish" }
];
const editableColumns = [
  {
    title: "Name",
    field: "name",
    width: 150,
    editor: "input",
    headerFilter: "input"
  },
  {
    title: "Age",
    field: "age",
    hozAlign: "left",
    formatter: "progress",
    editor: "progress"
  },
  {
    title: "Favourite Color",
    field: "color",
    editor: "select",
    editorParams: {
      allowEmpty: true,
      showListOnEmpty: true,
      values: colorOptions
    },
    headerFilter: "select",
    headerFilterParams: { values: colorOptions }
  },
  {
    title: "Date Of Birth",
    field: "dob",
    sorter: "date",
    editor: DateEditor,
    editorParams: { format: "MM/DD/YYYY" }
  },
  {
    title: "Pets",
    field: "pets",
    sorter: (a, b) => a.toString().localeCompare(b.toString()),
    // editor: MultiSelectEditor,
    editorParams: { values: petOptions },
    formatter: MultiValueFormatter,
    formatterParams: { style: "PILL" }
  },
  {
    title: "Passed?",
    field: "passed",
    hozAlign: "center",
    formatter: "tickCross",
    editor: true
  }
];

class Home extends React.Component {
  state = {
    data: [],
    selectedName: ""
  };
  ref = null;

  columns = [
    { title: "id", field: "id", width: 20, hozAlign: "center" },
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
    { title: "Свободность", field: "boolean", width: 80, formatter: "tickCross" },
    { title: "Возврат", field: "status", width: 80, formatter: "tickCross" },
    ////////////////////////////////////////////////////////

    // { title: "Name", field: "name", width: 150 },
    // { title: "Age", field: "age", hozAlign: "left", formatter: "progress" },
    // { title: "Favourite Color", field: "color" },
    // { title: "Date Of Birth", field: "dob" },
    // { title: "Rating", field: "rating", hozAlign: "center", formatter: "star" },
    // {
    //   title: "Passed?",
    //   field: "passed",
    //   hozAlign: "center",
    //   formatter: "tickCross"
    // },
    {
      title: "Custom",
      field: "custom",
      hozAlign: "center",
      editor: "input",
      formatter: reactFormatter(
        <SimpleButton
          onSelect={(name) => {
            this.setState({ selectedName: name });
            alert(name);
          }}
        />
      )
    }
  ];

  rowClick = (e, row) => {
    // console.log("ref table: ", this.ref.current); // this is the Tabulator table instance
    // console.log("rowClick id: ${row.getData().id}", row, e);
    this.setState({ selectedName: row.getData().name });
  };

  setData = () => {
    this.setState({ data });
  };

  clearData = () => {
    this.setState({ data: [] });
  };

  render() {
    const options = {
      height: 150,
      movableRows: true,
      movableColumns: true
    };
    return (
      <div>
        <ReactTabulator
          onRef={(ref) => (this.ref = ref)}
          columns={this.columns}
          data={data}
          events={{
            rowClick: this.rowClick
          }}
          options={options}
          data-custom-attr="test-custom-attribute"
          className="custom-css-class"
        />
        <i>
          Selected Name: <strong>{this.state.selectedName}</strong>
        </i>

        <h3>
          Asynchronous data: (e.g. fetch) -{" "}
          <button onClick={this.setData}>Set Data</button>
          <button onClick={this.clearData}>Clear</button>
        </h3>
        <ReactTabulator columns={this.columns} data={this.state.data} />

        <h3>Editable Table</h3>
        <ReactTabulator
          columns={editableColumns}
          data={data}
          footerElement={<span>Footer</span>}
        />

        {/* <p>
          <a href="https://github.com/ngduc/react-tabulator" target="_blank">
            Back to: Github Repo: react-tabulator
          </a>
        </p>
        <p>
          <a
            href="https://github.com/ngduc/react-tabulator/blob/master/docs/examples.md"
            target="_blank"
          >
            More Codesandbox Examples
          </a>
        </p>
        <p>
          <a href="http://tabulator.info/examples/4.0" target="_blank">
            More Tabulator's Examples
          </a>
        </p> */}
      </div>
    );
  }
}

export default Home;
