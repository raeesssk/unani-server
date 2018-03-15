const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:zeartech@localhost:5432/orientfurniture';

const clientEmployeeMaster = new pg.Client(connectionString);
clientEmployeeMaster.connect();

const employee_master = clientEmployeeMaster.query('CREATE TABLE employee_master(emp_id SERIAL PRIMARY KEY, emp_name VARCHAR(40) not null, emp_mobile VARCHAR(40), emp_email VARCHAR(60), emp_address VARCHAR(150), emp_city VARCHAR(40), emp_state VARCHAR(40), emp_pin_code integer, emp_created_at timestamp default CURRENT_TIMESTAMP, emp_updated_at timestamp default CURRENT_TIMESTAMP, emp_status integer)');
employee_master.on('end', () => { clientEmployeeMaster.end(); });

const clientUser = new pg.Client(connectionString);
clientUser.connect();

const user = clientUser.query('CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(40) not null, password VARCHAR(40) not null,created_at timestamp default CURRENT_TIMESTAMP, updated_at timestamp default CURRENT_TIMESTAMP)');
user.on('end', () => { clientUser.end(); });

const clientCustomerMaster = new pg.Client(connectionString);
clientCustomerMaster.connect();

const customer_master = clientCustomerMaster.query('CREATE TABLE customer_master(cm_id SERIAL PRIMARY KEY, cm_name VARCHAR(40) not null, cm_mobile VARCHAR(40), cm_email VARCHAR(60), cm_address VARCHAR(150), cm_city VARCHAR(40), cm_state VARCHAR(40), cm_pin_code integer, cm_created_at timestamp default CURRENT_TIMESTAMP, cm_updated_at timestamp default CURRENT_TIMESTAMP, cm_status integer)');
customer_master.on('end', () => { clientCustomerMaster.end(); });

const clientVendorMaster = new pg.Client(connectionString);
clientVendorMaster.connect();

const vendor_master = clientVendorMaster.query('CREATE TABLE vendor_master(vm_id SERIAL PRIMARY KEY, vm_name VARCHAR(40) not null,vm_mobile VARCHAR(40),vm_email VARCHAR(60),vm_address VARCHAR(150),vm_city VARCHAR(40),vm_state VARCHAR(40),vm_pin_code integer,vm_created_at timestamp default CURRENT_TIMESTAMP, vm_updated_at timestamp default CURRENT_TIMESTAMP,vm_firm_name VARCHAR(70),vm_landline VARCHAR(15),vm_vat_no VARCHAR(20),vm_cst_no VARCHAR(20),vm_status integer)');
vendor_master.on('end', () => { clientVendorMaster.end(); });

const clientExpenseType = new pg.Client(connectionString);
clientExpenseType.connect();

const expense_type_master = clientExpenseType.query('CREATE TABLE expense_type_master(etm_id SERIAL PRIMARY KEY UNIQUE,etm_type VARCHAR(60) not null,etm_created_at timestamp default CURRENT_TIMESTAMP, etm_updated_at timestamp default CURRENT_TIMESTAMP,etm_status integer)');
expense_type_master.on('end', () => { clientExpenseType.end(); });

const clientProductMaster = new pg.Client(connectionString);
clientProductMaster.connect();

const product_master = clientProductMaster.query('CREATE TABLE product_master(pm_id SERIAL PRIMARY KEY,pm_name VARCHAR(40) not null,pm_description VARCHAR(40),pm_purchase_cost real,pm_tax real,pm_vat real,pm_tin real,pm_selling_cost real,pm_quantity integer,pm_created_at timestamp default CURRENT_TIMESTAMP, pm_updated_at timestamp default CURRENT_TIMESTAMP,pm_image bytea,pm_vat_per real,pm_status integer)');
product_master.on('end', () => { clientProductMaster.end(); });

const clientPurchaseMaster = new pg.Client(connectionString);
clientPurchaseMaster.connect();

const purchase_master = clientPurchaseMaster.query('CREATE TABLE purchase_master (prm_id SERIAL PRIMARY KEY ,prm_invoice_no character varying(40),prm_date date,prm_vm_id integer,prm_amount real NOT NULL,    prm_created_at timestamp without time zone DEFAULT now(),prm_updated_at timestamp without time zone DEFAULT now(),CONSTRAINT purchase_master_vm_id_fkey FOREIGN KEY (prm_vm_id)REFERENCES public.vendor_master (vm_id))');
purchase_master.on('end', () => { clientPurchaseMaster.end(); });

const clientPurchaseProduct = new pg.Client(connectionString);
clientPurchaseProduct.connect();

const purchase_product_master = clientPurchaseProduct.query('CREATE TABLE public.purchase_product_master(ppm_id SERIAL PRIMARY KEY,ppm_prm_id integer,ppm_pm_id integer,ppm_quantity integer,ppm_purchase_rate real,ppm_created_at timestamp without time zone DEFAULT now(),ppm_updated_at timestamp without time zone DEFAULT now(),CONSTRAINT purchase_product_master_pm_id_fkey FOREIGN KEY (ppm_pm_id) REFERENCES public.product_master (pm_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION, CONSTRAINT purchase_product_master_prm_id_fkey FOREIGN KEY (ppm_prm_id) REFERENCES public.purchase_master (prm_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION)');
purchase_product_master.on('end', () => { clientPurchaseProduct.end(); });

const clientSaleMaster = new pg.Client(connectionString);
clientSaleMaster.connect();

const sale_master = clientSaleMaster.query('CREATE TABLE public.sale_master(sm_id SERIAL PRIMARY KEY,sm_invoice_no character varying(40) COLLATE pg_catalog."default" NOT NULL,sm_date date,sm_cm_id integer, sm_amount real,sm_car_name character,sm_car_model character,sm_car_number character,sm_created_at timestamp without time zone DEFAULT now(),sm_updated_at timestamp without time zone DEFAULT now(),CONSTRAINT sale_master_cm_id_fkey FOREIGN KEY (sm_cm_id) REFERENCES public.customer_master (cm_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION)');
sale_master.on('end', () => { clientSaleMaster.end(); });

const clientSaleProduct = new pg.Client(connectionString);
clientSaleProduct.connect();

const sale_product_master = clientSaleProduct.query('CREATE TABLE public.sale_product_master(spm_id SERIAL PRIMARY KEY,spm_pm_id integer,spm_sm_id integer,spm_quantity integer,spm_discount_percent real,   spm_discount_amount real,spm_created_at timestamp without time zone DEFAULT now(),spm_updated_at timestamp without time zone DEFAULT now(), CONSTRAINT sale_product_master_pm_id_fkey FOREIGN KEY (spm_pm_id) REFERENCES public.product_master (spm_pm_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,   CONSTRAINT sale_product_master_sm_invoice_no_fkey FOREIGN KEY (spm_sm_id) REFERENCES public.sale_master (sm_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION)');
sale_product_master.on('end', () => { clientSaleProduct.end(); });

const clientExpenseMaster = new pg.Client(connectionString);
clientExpenseMaster.connect();

const expense_master = clientExpenseMaster.query('CREATE TABLE expense_master(em_id SERIAL PRIMARY KEY UNIQUE,em_type_id integer REFERENCES expense_type_master(etm_id),em_invoice_no VARCHAR(40) REFERENCES purchase_master(prm_invoice_no),em_amount real,em_other VARCHAR(50), em_payment_mode VARCHAR(40),em_cheque_no integer,em_bank_name VARCHAR(70),em_bank_branch VARCHAR,em_created_at timestamp default CURRENT_TIMESTAMP, em_updated_at timestamp default CURRENT_TIMESTAMP)');
expense_master.on('end', () => { clientExpenseMaster.end(); });



