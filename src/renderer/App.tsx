import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import icon from '../../assets/icon.svg';

import Table from './Table';
import EddTable from './EdTable.js'
import Prime from './Prime.js'
import PrimeMini from './PrimeMini.js'

import TabMenuRouts from './components/TabMenuRouts';

import CostumersTable from './pages/baza/CostumersTable.js'
import DataTable from './pages/data/DataProkat.js';

// import './App.css';

import Stats from "../../pages/stats/Stats.js"

import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

import 'react-tabulator/lib/styles.css';

function Hello() {
  return (
    <>
      <div className="Hello">
        <img width="50" alt="icon" src={icon} />
      </div>
      
      <Table/>
      
    </>
  );
}

export default function App() {
  return (
    <Router>
      <TabMenuRouts/>
      {/* <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/table">More</Link>
        </li>
        <li>
          <Link to="/prime">Prime</Link>
        </li>
        <li>
          <Link to="/primemini">PrimeMini</Link>
        </li>
      
        <li>
          <Link to="data">Учет</Link>
        </li>
        <li>
          <Link to="costumers-table">База</Link>
        </li>

        <li>
          <Link to="according-to-Costumes">По Костюмам</Link>
        </li>
      </ul>

      <hr /> */}
      <Routes>

        {/* <Route path="/" element={<Hello />} />
        <Route path="/table" element={<EddTable />} />
        <Route path="/prime" element={<Prime />} />
        <Route path="/primemini" element={<PrimeMini />} /> */}
        <Route path="/costumers-table" element={<CostumersTable />} />
        <Route path="/data" element={<DataTable />} />

      </Routes>
    </Router>
  );
}
