// Mock data for Oracle objects and lineage

export type ObjectType = 'package' | 'procedure' | 'function' | 'table' | 'view' | 'trigger' | 'file';

export interface OracleObject {
  id: string;
  name: string;
  type: ObjectType;
  schema: string;
  description?: string;
  code?: string;
  dependencies?: string[];
}

export const mockObjects: OracleObject[] = [
  {
    id: 'pkg_1',
    name: 'PKG_DATA_LOADER',
    type: 'package',
    schema: 'apexstg',
    description: 'Main data loading package for batch processing',
    code: `CREATE OR REPLACE PACKAGE PKG_DATA_LOADER AS
  -- Main data loading procedures
  PROCEDURE load_customer_data(p_batch_id NUMBER);
  PROCEDURE validate_records(p_table_name VARCHAR2);
  FUNCTION get_batch_status(p_batch_id NUMBER) RETURN VARCHAR2;
END PKG_DATA_LOADER;`,
    dependencies: ['tbl_customers', 'tbl_batch_log', 'proc_validate']
  },
  {
    id: 'proc_1',
    name: 'PROC_VALIDATE_CUSTOMER',
    type: 'procedure',
    schema: 'plstg',
    description: 'Validates customer records before insertion',
    code: `CREATE OR REPLACE PROCEDURE PROC_VALIDATE_CUSTOMER(
  p_customer_id IN NUMBER,
  p_status OUT VARCHAR2
) AS
BEGIN
  -- Validation logic
  SELECT CASE 
    WHEN COUNT(*) > 0 THEN 'VALID'
    ELSE 'INVALID'
  END INTO p_status
  FROM tbl_customers
  WHERE customer_id = p_customer_id;
END;`,
    dependencies: ['tbl_customers']
  },
  {
    id: 'func_1',
    name: 'FN_CALCULATE_REVENUE',
    type: 'function',
    schema: 'apexstg',
    description: 'Calculates total revenue for a given period',
    code: `CREATE OR REPLACE FUNCTION FN_CALCULATE_REVENUE(
  p_start_date DATE,
  p_end_date DATE
) RETURN NUMBER AS
  v_total NUMBER;
BEGIN
  SELECT SUM(amount) INTO v_total
  FROM tbl_transactions
  WHERE transaction_date BETWEEN p_start_date AND p_end_date;
  
  RETURN NVL(v_total, 0);
END;`,
    dependencies: ['tbl_transactions']
  },
  {
    id: 'tbl_1',
    name: 'TBL_CUSTOMERS',
    type: 'table',
    schema: 'staging',
    description: 'Main customer dimension table',
    code: `CREATE TABLE TBL_CUSTOMERS (
  customer_id NUMBER PRIMARY KEY,
  customer_name VARCHAR2(100),
  email VARCHAR2(100),
  created_date DATE,
  status VARCHAR2(20)
);`,
    dependencies: []
  },
  {
    id: 'tbl_2',
    name: 'TBL_TRANSACTIONS',
    type: 'table',
    schema: 'staging',
    description: 'Transaction fact table',
    code: `CREATE TABLE TBL_TRANSACTIONS (
  transaction_id NUMBER PRIMARY KEY,
  customer_id NUMBER,
  amount NUMBER(10,2),
  transaction_date DATE,
  status VARCHAR2(20),
  FOREIGN KEY (customer_id) REFERENCES TBL_CUSTOMERS(customer_id)
);`,
    dependencies: ['tbl_customers']
  },
  {
    id: 'view_1',
    name: 'VW_CUSTOMER_SUMMARY',
    type: 'view',
    schema: 'apexstg',
    description: 'Aggregated customer transaction summary',
    code: `CREATE OR REPLACE VIEW VW_CUSTOMER_SUMMARY AS
SELECT 
  c.customer_id,
  c.customer_name,
  COUNT(t.transaction_id) as total_transactions,
  SUM(t.amount) as total_amount
FROM TBL_CUSTOMERS c
LEFT JOIN TBL_TRANSACTIONS t ON c.customer_id = t.customer_id
GROUP BY c.customer_id, c.customer_name;`,
    dependencies: ['tbl_customers', 'tbl_transactions']
  },
  {
    id: 'trig_1',
    name: 'TRG_AUDIT_CUSTOMER',
    type: 'trigger',
    schema: 'plstg',
    description: 'Audit trigger for customer table changes',
    code: `CREATE OR REPLACE TRIGGER TRG_AUDIT_CUSTOMER
AFTER INSERT OR UPDATE OR DELETE ON TBL_CUSTOMERS
FOR EACH ROW
BEGIN
  INSERT INTO tbl_audit_log (
    table_name, 
    action, 
    timestamp
  ) VALUES (
    'TBL_CUSTOMERS',
    CASE 
      WHEN INSERTING THEN 'INSERT'
      WHEN UPDATING THEN 'UPDATE'
      WHEN DELETING THEN 'DELETE'
    END,
    SYSDATE
  );
END;`,
    dependencies: ['tbl_customers', 'tbl_audit_log']
  },
  {
    id: 'file_1',
    name: 'customer_reference.csv',
    type: 'file',
    schema: 'staging',
    description: 'Reference file for customer data mapping',
    dependencies: []
  }
];

export interface LineageEdge {
  source: string;
  target: string;
  type: 'reads' | 'writes' | 'calls' | 'references';
}

export const mockLineage: LineageEdge[] = [
  { source: 'pkg_1', target: 'proc_1', type: 'calls' },
  { source: 'pkg_1', target: 'tbl_1', type: 'reads' },
  { source: 'proc_1', target: 'tbl_1', type: 'reads' },
  { source: 'func_1', target: 'tbl_2', type: 'reads' },
  { source: 'tbl_2', target: 'tbl_1', type: 'references' },
  { source: 'view_1', target: 'tbl_1', type: 'reads' },
  { source: 'view_1', target: 'tbl_2', type: 'reads' },
  { source: 'trig_1', target: 'tbl_1', type: 'references' },
  { source: 'pkg_1', target: 'file_1', type: 'reads' },
];

export const mockKnowledgeBase = [
  {
    id: 'kb_1',
    title: 'Customer Data Loading Process',
    category: 'Process Documentation',
    content: 'The customer data loading process uses PKG_DATA_LOADER to batch process incoming customer files...',
    tags: ['data-loading', 'customers', 'batch-process']
  },
  {
    id: 'kb_2',
    title: 'Revenue Calculation Logic',
    category: 'Business Logic',
    content: 'Revenue is calculated using FN_CALCULATE_REVENUE which aggregates transaction amounts within a date range...',
    tags: ['revenue', 'calculations', 'business-logic']
  },
  {
    id: 'kb_3',
    title: 'Data Validation Rules',
    category: 'Data Quality',
    content: 'All customer records must pass validation checks before insertion into the main tables...',
    tags: ['validation', 'data-quality', 'rules']
  }
];
