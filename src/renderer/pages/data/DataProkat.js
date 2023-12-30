import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DataService } from '../../service/DataService';
import { СostumesData } from '../../service/СostumesData';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { InputMask } from "primereact/inputmask";
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';
// import * as fs from 'fs';
// import {writeJsonFile} from 'write-json-file';
import { Upload } from "./Upload";
import DialogWindow from './DialogWindow.js'

import DayNihtSwitch from "../../components/DayNihtSwitch.js"

export default function ProductsDemo() {
    // var fs = require('fs');

    // async componentDidMount() {
    //     const json = await writeJsonFile('foo.json', {foo: true});
    // }

    let emptyProduct = {
        id: null,
        // name: '',
        // image: null,
        // description: '',
        // category: null,
        // price: 0,
        // rating: 0,
        "Номер": 30,
        "Имя": 'Зайчонок средний',
        "Дата": "Thu Dec 21 2023 00:00:00 GMT+0300 (Москва, стандартное время)",
        "ПоловинаДня": "PM",

        "Клиент": "Федор ИИ",
        "Адрес": "Ленина 23",
        "Телефон": "89287572938",
        "Место": "Мечетка Школа №3",
        "Залог": "1000 рублей",
        "ВремяМероприятия": "16:00",

        "Примечание": 'Доработать размер',
        "Фото": 'https://s09.stc.yc.kpcdn.net/share/i/12/12927358/wr-960.webp',
        "Цена": 72,
    
        // category: 'Accessories',
        inventoryStatus: 'Вернулся',
        "Статус": 'Вернулся',
        "Свободность": true
    };

    const [openDialogWindow, setOpenDialogWindow] = useState(false)
    const [matches, setMatches] =useState({})
    
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [dataCostumes , setCostumes] = useState(null) // Таблица костюмов
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    //<<<Загрузка таблиц
    useEffect(() => {
        // DataService.getProducts().then((data) => setProducts(data));
        setProducts(JSON.parse(localStorage.getItem('данные2023')))
        СostumesData.getProductsMini().then((dataCostumes) => setCostumes(dataCostumes));
    }, []);
    //>>>>>>>>>>>>>>

    useEffect(()=>{
        localStorage.setItem("данные2023", JSON.stringify(products) )
    },[products])

    //<<<<<Поиск в базе
    function searchCostum(searchKey, value){
        let findCostum = dataCostumes.find(item => item[searchKey] === String(value))
        
        if(findCostum){
            setProduct({...product, 
               Номер: findCostum.Номер,
               Имя: findCostum.Имя,
               Цена: findCostum.Цена,
               Фото: findCostum.Фото,
            })
            // let obj = null
            // for (const [key, value] of Object.entries(findCostum)) {
            //     setProduct({...product, [key]: value})
            // }
        }
        else{
            setProduct({...product, 
                Имя: null,
                Цена: null,
                Фото: null,
            })
        }
        
    }
    //>>>>>>>>>>>>>>>>>>>

    //<<<<< Сохранение таблицы в JSON
    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
          JSON.stringify(products)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "data.json";
    
        link.click();
    };
    //>>>>>>>>>>>>>>>>


    //<<<<<<< EXPORTS

    const cols = [ // Изменить колонки тут, и можно отрисовать колонки в таблице по массиву
        // Например
        // {cols.map((col, index) => (
        //     <Column key={index} field={col.field} header={col.header} />
        // ))}
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'category', header: 'Category' },
        { field: 'quantity', header: 'Quantity' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, products);
                doc.save('products.pdf');
            });
        });
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(products);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'products');
        });
    };

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };

    //>>>>>>>>>>

    //<<<<<< Imports
    const customloader = async (event) => {
        let file = null
        file = event.files[0];
        const reader = new FileReader();
        // let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        // reader.readAsDataURL(blob);
        reader.readAsText(file);

        reader.onloadend = function () {
            // const base64data = reader.result;
            const obj = JSON.parse(reader.result)
            setProducts(obj)
            console.log(obj)
        };
        
    };
    //<<<<<<<<

    //<<<< Перезапись c FS
    // let raw = fs.readFileSync("../database/items.json");
    // let itemList = JSON.parse(raw);
    // let found = false;
    // for (let item of itemList.averages) {
    //     if (item.name === this.state.data.item_name) {
    //         found = true;
    //         item.count += 1;
    //     }
    // }
    // if (!found) {
    //     let newItem = {
    //         name: this.state.data.item_name,
    //         count: 1,
    //     }
    //     itemList.averages.push(newItem);
    // }
    // let newRaw = JSON.stringify(itemList);
    // fs.writeFileSync("../database/items.json", newRaw);
    //>>>>>>


    function dateFormat(date){
        console.log("searchForMatches ДО", date, "ПОСЛЕ Форматированная", new Date(date).toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' }))
        return new Date(date).toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' })
    }

    function searchForMatches(products, product){
        // new Date(rowData.Дата).toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })

        let matches = products.find(item => item.Номер === String(product.Номер) && 
            dateFormat(item.Дата) === dateFormat(product.Дата) )
        setMatches(matches)
        
        console.log("products, product", products, product)
        if(matches && matches?.ПоловинаДня === product.ПоловинаДня){
            alert(`Костюм занят ${matches.Клиент}`)
            /* 
            Добавить сюда функцию, которая открывает диалоговое окно
            сообщая, что данный костюм занят в ЭТУ ЖЕ половину дня в
            такое-тое время, таким-то пользователем

            Выбрать другой Костюм? на это время?

            вывести список Свободных?
            */
        }
        else if(matches && matches?.ПоловинаДня != product.ПоловинаДня){
            console.log("matches", matches)
            /* 
            Добавить сюда функцию, которая открывает диалоговое окно
            сообщая, что данный костюм занят в такое-то время
            Уверенны ли вы что успеете подготовить костюм на новое время
            для другого клиента, 
            если "да", то добавить запись
            */

            setOpenDialogWindow(true)

        }
        else{ 
            console.log("SAVE matches", matches)
            saveProduct()
        }
    }

    //Открыть окно для создания новой записи
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    // Сохранить новоую или отредактированую запись 
    const saveProduct = () => {
        setSubmitted(true);
        
          if (product.Имя.trim()) {
            let _products = [...products];
            let _product = { ...product };

            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                _product.id = createId();
                _product.ПорядковыйНомер = products.length + 1
                // _product.Фото = 'product-placeholder.svg';
                _product.Фото = '/assets/photos/def-img.png'
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            _product.Дата = String(_product.Дата)
            _product.Цена = +_product.Цена
            
            setProducts(_products);
            setProductDialog(false);
            // setProduct(emptyProduct);
        }
    };

    // Открыть окно для редактирования строки
    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    // Открыть окно для удаления строки
    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    // Функция удаления записи (Диологовое окно)
    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // Создать id новому продукту
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    // Функция удаления записи (Панель инструментов)
    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

// Функция удаления записи (Диологовое окно)
    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    // Выбор категории  !!! пока отключен !!!
    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        console.log(name, val)
        
        let _product = { ...product };

        // _product[`${name}`] = name === "Дата" ? val.toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' }) : val;
        _product[`${name}`] = val // name === "Дата" ? String(val) : val;

        if(name === "Дата"){
            // console.log(new Date(String(val)).getHours() >= 12 ? 'PM' : 'AM')
            _product.ПоловинаДня = val.getHours() >= 12 ? 'PM' : 'AM'
            _product.ВремяМероприятия = val.toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: false  })
        }

        console.log("_product", _product)
        if(name === "Имя" || name === "Номер"){
            searchCostum(name, val)
        }else{
            setProduct(_product);
        }

    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        console.log(val)
        let _product = { ...product };

        _product[`${name}`] = val;

        if(name === "Имя" || name === "Номер"){
            searchCostum(name, val)
        }else{
            setProduct(_product);
        }
    };

    //<<<<<<<<<<<< Toolbar
    // Левые кнопки панели инструментов
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };
    // Правые кнопки панели инструментов
    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
                <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="file/*" customUpload uploadHandler={customloader} />
            </div>
        )
    };
    //>>>>>>>>>>>>>>>>

    // Стилизация фотографии
    //!! Сделать кликабельной с увеличением фото
    const imageBodyTemplate = (rowData) => {
        return <img src={`${rowData.Фото}`} alt={rowData.Фото} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    // Стилизация иконки(ячейки) половины дня
    const iconBodyTemplate = (rowData) => {
        return(
            <span /*className="p-input-icon-left"*/
                style={{backgroundColor: `${rowData.ПоловинаДня === 'AM' ? '#ffe85d' : '#546bab' }`, 
                    color: `${rowData.ПоловинаДня === 'AM' ? null : 'white' }`,
                    padding: "10px", borderRadius: "10px"}}
            >
                <i className={`pi ${rowData.ПоловинаДня === 'AM' ? 'pi-sun' : 'pi-moon' }`} />
                {rowData.ПоловинаДня}
            </span>
        )
    };

    // Форматирование ячейки даты
    const dateBodyTemplate = (rowData) => {
        // console.log(rowData.Дата.toLocaleString([], { hour: '2-digit', minute: '2-digit' }))
        return new Date(rowData.Дата).toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    // Форматирование денежных значений
    const priceBodyTemplate = (rowData) => {
        return (+rowData.Цена).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    };

    // Ячейка рейтинга !!! пока отключена !!!
    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    // Стилизация ячейки статуса "заказа"
    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.Статус} severity={getSeverity(rowData)}></Tag>;
    };

    // Кнопки функционала в строках таблицы
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    // Стилизация статуса "заказа"
    const getSeverity = (product) => {
        switch (product.Статус) {
            case 'Готов':
                return 'success';
            case 'В Прокате':
                return 'warning';
            case 'НЕготов':
                return 'danger';

            default:
                return null;
        }
    };
    // Поиск и кнопки в шапке самой таблицы
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />

                {/* <div className="flex align-items-center justify-content-end gap-2"> */}
                    {/* <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" /> */}
                    <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
                    <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
                    <Button type="button" icon="pi pi-file-export" severity="info" rounded onClick={exportData} data-pr-tooltip="JSON" />
                {/* </div> */}
            </span>
        </div>
    );
    // Футер для сохранения новой и редактирования имеющейся записи
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={() => searchForMatches(products, product)} />
        </React.Fragment>
    );
    // Футер для окна удаления одной записи
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    // Футера для диологового окна удаления множества записей
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]} size='small'
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                            
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="ПорядковыйНомер" header="Порядковый №" sortable style={{ minWidth: '1rem' }}></Column>
                    <Column field="Номер" header="№" sortable style={{ minWidth: '1rem' }}></Column>
                    <Column field="Имя" header="Название" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="Дата" header="Дата" body={dateBodyTemplate} sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="ПоловинаДня" header="AM/PM" body={iconBodyTemplate} sortable tyle={{ width: '1rem' }}></Column>
                    
                    <Column field="Клиент" header="Клиент" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="Телефон" header="Телефон" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="Адрес" header="Адрес" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="Залог" header="Залог" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="Место" header="Место" sortable style={{ minWidth: '6rem' }}></Column>
                    <Column field="ВремяМероприятия" header="Вр.Мер-я" sortable style={{ width: '1rem' }}></Column>

                    <Column field="Примечание" header="Примечание" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="Фото" header="Фото" body={imageBodyTemplate}></Column>
                    <Column field="Цена" header="Цена" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    {/* <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column field="Статус" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '60rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                <div className="field grid">

                    <div className="field col-6">
                        
                        <div class="flex column-gap-2 row-gap-2 justify-content-between">

                            <div class="border-round w-8rem h-5rem bg-primary font-bold align-items-center justify-content-center px-1 py-0">
                                <label htmlFor="Номер" className="font-bold">
                                    № костюма
                                </label>
                                <span className="p-float-label p-input-icon-right">
                                    {/* <i className={"pi pi-user"} /> */}
                                
                                <InputNumber id="Номер" placeholder="Номер" value={product.Номер} autoFocus={true}
                                    onChange={(e) => onInputNumberChange(e, 'Номер')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Номер })} />
                                {submitted && !product.Номер && <small className="p-error">Укажите номер</small>}
                                </span>
                            </div>

                            <div class="border-round w-120rem h-5rem bg-primary font-bold align-items-center justify-content-center px-1 py-0">
                                <label htmlFor="Имя" className="font-bold">
                                    Название
                                </label>
                                <span className="p-float-label p-input-icon-right">
                                
                                <InputText id="Имя" placeholder="Название" value={product.Имя} onChange={(e) => onInputChange(e, 'Имя')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Имя })} />
                                {submitted && !product.Имя && <small className="p-error">Требуется имя костюма.</small>}
                                </span>
                            </div>

                        </div>

                        <div class="flex justify-content-between" style={{marginTop: 10}}>
                            <div class="border-round w-14rem h-5rem bg-primary font-bold align-items-center justify-content-center px-1 py-0">
                                <div className="field">
                                    <label htmlFor="Дата" className="font-bold">
                                        Дата
                                    </label>
                                    <span className="p-float-label p-input-icon-right">
                                        <i className={"pi pi-user"} />
                                        <Calendar id="Дата" placeholder="Дата" value={new Date(product.Дата)} onChange={(e) => onInputChange(e, 'Дата')}
                                            required className={classNames({ 'p-invalid': submitted && !product.Дата })} showTime hourFormat="24" showIcon
                                            stepHour={1} stepMinute={15}
                                        />
                                    {submitted && !product.Дата && <small className="p-error">Укажите дату</small>}
                                    </span>
                                </div>
                            </div>
                          
                            <div class="border-round w-8rem h-5rem bg-primary align-items-center justify-content-center">
                                <DayNihtSwitch />
                            </div>
                        </div>
               

                       
                        
                    </div>

                    <div className="field col-6">
                      
                        <img 
                            src={product.Фото ? product.Фото : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg"}
                            alt={product.Фото ? product.Фото : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo-available_87543-11093.jpg"} 
                            className="product-image block m-auto pb-3" style={{width: '100%', borderRadius: 14}}
                        />
                        
                    </div>
                </div>

                <div className="field col">
                    <label htmlFor="Клиент" className="font-bold">
                        Клиент ФИО
                    </label>
                    <span className="p-float-label p-input-icon-right">
                    
                    <InputText id="Клиент" placeholder="Введите ФИО" value={product.Клиент} onChange={(e) => onInputChange(e, 'Клиент')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.Клиент })} />
                    {submitted && !product.Клиент && <small className="p-error">Требуется ФИО клиента.</small>}
                    </span>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="Адрес" className="font-bold">
                            Адрес Жительства
                        </label>
                        <InputText id="Адрес" value={product.Адрес} onChange={(e) => onInputChange(e, 'Адрес')} />
                    </div>
                    <div className="field col">
                        <label htmlFor="Место" className="font-bold">
                        Место Мероприятия
                        </label>
                        <InputText id="Место" value={product.Место} onChange={(e) => onInputChange(e, 'Место')} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="Примечание" className="font-bold">
                        Примечание
                    </label>
                    <InputTextarea id="Примечание" value={product.Примечание} onChange={(e) => onInputChange(e, 'Примечание')} required rows={3} cols={20} />
                </div>

                {/* <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div> */}
                

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="Цена" className="font-bold">
                            Цена
                        </label>
                        <InputNumber id="Цена" value={product.Цена} onValueChange={(e) => onInputNumberChange(e, 'Цена')} mode="currency" currency="RUB" locale="ru-RU" />
                    </div>
                    <div className="field col">
                        <label htmlFor="Телефон" className="font-bold">
                        Телефон
                        </label>
                        {/* <InputNumber id="Телефон" value={product.Телефон} onValueChange={(e) => onInputNumberChange(e, 'Телефон')} /> */}
                        <InputMask id="Телефон" value={product.Телефон} onChange={(e) => onInputNumberChange(e, 'Телефон')}
                         mask="8-999-999-99-99" placeholder="8-___-___-__-__"/>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Вы уверены, что хотите удалить <b>{product.Клиент}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Вы уверены, что хотите удалить выбранные записи?</span>}
                </div>
            </Dialog>
            
            <Upload/>
            <DialogWindow product={product} product={products} saveProduct={saveProduct} matches={matches}
                openDialogWindow={openDialogWindow} setOpenDialogWindow={setOpenDialogWindow} 
                dateFormat={dateFormat}
            />
        </div>
    );
}
        