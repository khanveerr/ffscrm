<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::get('set_password/{password?}','HomeController@set_password');

Route::group(['prefix' => 'api'], function()
{
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');

    Route::get('zone/all/{keyword?}','ZoneController@index');
    Route::post('zone/add','ZoneController@store');
    Route::get('zone/get/{id}','ZoneController@edit');
    Route::get('zone/delete/{id}','ZoneController@destroy');

    Route::get('category/all','CategoryController@index');
    Route::post('category/add','CategoryController@store');
    Route::get('category/get/{id}','CategoryController@edit');
    Route::get('category/delete/{id}','CategoryController@destroy');

    Route::get('company/all','CompanyController@index');
    Route::post('company/add','CompanyController@store');
    Route::get('company/get/{id}','CompanyController@edit');
    Route::get('company/delete/{id}','CompanyController@destroy');

    Route::get('vendor/all','VendorController@index');
    Route::post('vendor/add','VendorController@store');
    Route::get('vendor/get/{id}','VendorController@edit');
    Route::get('vendor/delete/{id}','VendorController@destroy');

    Route::get('req_vendor/all/{keyword?}','ReqVendorController@index');
    Route::get('req_vendor/all/{zone_id}/{type_id}','ReqVendorController@get_vendors');
    Route::post('req_vendor/add','ReqVendorController@store');
    Route::get('req_vendor/get/{id}','ReqVendorController@edit');
    Route::get('req_vendor/delete/{id}','ReqVendorController@destroy');
    Route::get('req_vendor/export_vendor_master','ReqVendorController@export_vendor_master');

    Route::get('brand/all','BrandController@index');
    Route::post('brand/add','BrandController@store');
    Route::get('brand/get/{id}','BrandController@edit');
    Route::get('brand/delete/{id}','BrandController@destroy');

    Route::get('quote/all','QuoteController@index');
    Route::post('quote/add','QuoteController@store');
    Route::get('quote/get/{id}','QuoteController@edit');
    Route::get('quote/delete/{id}','QuoteController@destroy');

    Route::get('model_no/all','ModelNoController@index');
    Route::post('model_no/add','ModelNoController@store');
    Route::get('model_no/get/{id}','ModelNoController@edit');
    Route::get('model_no/delete/{id}','ModelNoController@destroy');

    Route::get('cost_centre/all','CostCentreController@index');
    Route::post('cost_centre/add','CostCentreController@store');
    Route::get('cost_centre/get/{id}','CostCentreController@edit');
    Route::get('cost_centre/delete/{id}','CostCentreController@destroy');

    Route::get('department/all','DepartmentController@index');
    Route::post('department/add','DepartmentController@store');
    Route::get('department/get/{id}','DepartmentController@edit');
    Route::get('department/delete/{id}','DepartmentController@destroy');

    Route::get('site/all/{keyword?}','SiteController@index');
    Route::get('site/get_all','SiteController@get_all_sites');
    Route::post('site/add','SiteController@store');
    Route::get('site/get/{id}','SiteController@edit');
    Route::get('site/delete/{id}','SiteController@destroy');
    Route::get('site/states','SiteController@get_site_states');

    Route::get('state/all/{keyword?}','StateController@index');
    Route::get('state/get_all','StateController@get_all_states');
    Route::post('state/add','StateController@store');
    Route::get('state/get/{id}','StateController@edit');
    Route::get('state/delete/{id}','StateController@destroy');

    Route::get('employee/all','EmployeeController@index');
    Route::post('employee/add','EmployeeController@store');
    Route::get('employee/get/{id}','EmployeeController@edit');
    Route::get('employee/delete/{id}','EmployeeController@destroy');

    Route::get('inventory/all','InventoryController@index');
    Route::post('inventory/add','InventoryController@store');
    Route::get('inventory/get/{id}','InventoryController@edit');
    Route::get('inventory/delete/{id}','InventoryController@destroy');

    Route::get('inventory/assign/{id}','UserAssignController@index');
    Route::post('inventory/assign/add','UserAssignController@store');
    Route::get('inventory/assign/get/{id}','UserAssignController@edit');
    Route::get('inventory/assign/delete/{id}','UserAssignController@destroy');

    Route::get('inventory/transfer/{id}','InventoryTransferController@index');
    Route::post('inventory/transfer/add','InventoryTransferController@store');
    Route::get('inventory/transfer/get/{id}','InventoryTransferController@edit');
    Route::get('inventory/transfer/delete/{id}','InventoryTransferController@destroy');

    Route::get('item_type/all/{keyword?}','ItemTypeController@index');
    Route::post('item_type/add','ItemTypeController@store');
    Route::get('item_type/get/{id}','ItemTypeController@edit');
    Route::get('item_type/delete/{id}','ItemTypeController@destroy');

    Route::get('items/all','ItemMasterController@index');

    Route::get('proc_calc/all','ProcCalcController@index');
    Route::post('proc_calc/add','ProcCalcController@store');
    Route::get('proc_calc/get/{id}','ProcCalcController@edit');
    Route::get('proc_calc/delete/{id}','ProcCalcController@destroy');
    Route::get('proc_calc/items/get/{id}','ProcCalcController@getProcItems');
    Route::get('proc_calc/export/{id}/{type}','ProcCalcController@export');
    Route::post('proc_calc/upload/image', 'ProcCalcController@upload_image');
    Route::post('proc_calc/item/update', 'ProcCalcController@update_item');

    Route::post('user/all','UserController@get_all');
    Route::post('user/add','UserController@store');
    Route::get('user/get/{id}','UserController@edit');
    Route::get('user/delete/{id}','UserController@destroy');
    Route::post('user/change_password','UserController@change_password');

    Route::get('item/all/{zone_id}/{type_id}/{keyword?}','ItemController@index');
    Route::post('item/add','ItemController@store');
    Route::get('item/get/{id}','ItemController@edit');
    Route::get('item/delete/{id}','ItemController@destroy');

    Route::get('item_price/all/{item_id}','ItemPriceController@index');
    Route::post('item_price/add','ItemPriceController@store');
    Route::get('item_price/get/{id}','ItemPriceController@edit');
    Route::get('item_price/delete/{id}','ItemPriceController@destroy');

    
    Route::get('procurement/items/{zone_id}','ProcurementController@get_items');
    Route::post('procurement/items/export','ProcurementController@export');
    Route::post('procurement/items/export_by_proc_id','ProcurementController@export_by_proc_id');
    Route::get('procurement/items/export_po/{id}','ProcurementController@export_po');

    Route::post('procurement/request/items','ProcureMasterController@submit_request');
    Route::post('procurement/draft/requisition','ProcureMasterController@draft_requisition');
    Route::post('requisition/all','ProcureMasterController@index');
    Route::get('requisition/items/get/{id}','ProcureMasterController@get_requisition_items');
    Route::get('requisition/items/get_all/{id}','ProcureMasterController@get_all_requisition_items');
    Route::get('requisition/update/status/{id}/{status}','ProcureMasterController@update_requisition_status');
    Route::post('requisition/export/all','ProcureMasterController@get_requisition_export_report');

    Route::post('procurement/report','ProcureMasterController@get_report_data');

    Route::get('/supplier_list/get/{year}/{month}/{site_id}','SupplierController@index');
    Route::get('/supplier_list/export/{year}/{month}/{site_id}','SupplierController@export');


    Route::get('/zone/import_data','ProcurementController@import_data');


    Route::post('lead/all','LeadController@index');
    Route::post('lead/save','LeadController@store');
    Route::post('lead/set_important','LeadController@set_important');
    Route::get('lead/get/{id}','LeadController@get_lead_details');
    Route::post('lead/update_reminder','LeadController@update_reminder');
    Route::post('lead/delete/{id}','LeadController@delete');
    Route::get('lead/kaps/{lead_id}','LeadController@get_lead_kaps');
    Route::post('lead/export', 'LeadController@lead_export');
    Route::get('lead/send_contract_renewal_reminders', 'LeadController@send_lead_contract_renewal_reminders');
    Route::get('lead/send_lead_database_followup_reminders', 'LeadController@send_lead_database_followup_reminders');

    Route::post('kap/save','KAPController@save_kap');
    Route::post('kap/update','KAPController@update_kap');
    Route::get('kap/send_reminders','KAPController@send_kap_reminders');
    Route::get('kap/get_all','KAPController@get_kaps');

    Route::get('lead/active_users','UserController@get_all_active_users');
    Route::get('lead/users','UserController@get_all_users');

    Route::get('user/companies','LeadController@get_companies');
    Route::get('states','LeadController@get_states');

    Route::get('industries','LeadController@get_industry_lists');
    Route::get('leadsources','LeadController@get_leadsource_list');

    Route::post('city/all','CityController@index');
    Route::get('city/get_all','CityController@get_all_cities');
    Route::post('city/add','CityController@store');
    Route::get('city/get/{id}','CityController@edit');
    Route::get('city/delete/{id}','CityController@destroy');

    Route::post('nps/all','NPSController@index');
    Route::post('nps/add','NPSController@store');
    Route::get('nps/get/{id}','NPSController@edit');
    Route::get('nps/delete/{id}','NPSController@destroy');


    Route::post('site_activated/all','SiteActivatedController@index');
    Route::get('site_activated/get_all','SiteActivatedController@get_all_cities');
    Route::post('site_activated/add','SiteActivatedController@store');
    Route::get('site_activated/get/{id}','SiteActivatedController@edit');
    Route::get('site_activated/delete/{id}','SiteActivatedController@destroy');

    Route::post('report/get_sales_funnel_data','DashboardController@get_sales_funnel_data');
    Route::post('report/industry_wise','DashboardController@get_industry_report_data');
    Route::post('report/get_total_leads_by_source','DashboardController@get_total_leads_by_source');
    Route::get('report/get_leadowner_report_data','DashboardController@get_leadowner_report_data');
    Route::post('report/get_contracts_won_and_site_activated_report_data','DashboardController@get_contracts_won_and_site_activated_report_data');
    Route::post('report/get_site_started_report_data','DashboardController@get_leadowner_sitestarted_report_data');
    Route::post('report/get_contracts_won_and_site_started_monthwise_report_data','DashboardController@get_contracts_won_and_site_started_monthwise_report_data');



});
Auth::routes();

Route::post('/user/register', 'UserController@register');

Route::get('/home', 'HomeController@index')->name('home');