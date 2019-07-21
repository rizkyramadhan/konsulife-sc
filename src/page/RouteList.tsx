import FormPayment from "./payment/FormPayment";
import ListPayment from "./payment/ListPayment";
import FormPRPrint from "./pr-print/FormPRPrint";
import ListPRPrint from "./pr-print/ListPRPrint";
import FormPR from "./pr/FormPR";
import ListPR from "./pr/ListPR";
import ListPRVendor from "./pr/ListPRVendor";
import ReportAR from "./report/ReportAR";
import ReportDO from "./report/ReportDO";
import ReportInventory from "./report/ReportInventory";
import ReportInventoryByWO from "./report/ReportInventoryByWO";
import ReportPO from "./report/ReportPO";
import ReportSO from "./report/ReportSO";
import ReportStock from "./report/ReportStock";
import FormRute from "./rute/FormRute";
import ListRute from "./rute/ListRute";
import FormSO from "./so/FormSO";
import ListDraftSO from "./so/ListDraftSO";
import ListSO from "./so/ListSO";
import FormSOCanvas from "./socanvas/FormSOCanvas";
import ListSOCanvas from "./socanvas/ListSOCanvas";
import FormUser from "./user/FormUser";
import ListUser from "./user/ListUser";
import FormWO from "./wo/FormWO";
import ListWO from "./wo/ListWO";
import FormARInvoicePrint from "./arinvoice-print/FormARInvoicePrint";
import ListARInvoicePrint from "./arinvoice-print/ListARInvoicePrint";
import FormARInvoiceTOPrint from "./arinvoice-to-print/FormARInvoiceTOPrint";
import ListARInvoiceTOPrint from "./arinvoice-to-print/ListARInvoiceTOPrint";
import FormARInvoiceTO from "./arinvoice-to/FormARInvoiceTO";
import ListARInvoiceTO from "./arinvoice-to/ListARInvoiceTO";
import ListInvoiceTOCust from "./arinvoice-to/ListInvoiceTOCust";
import FormARInvoice from "./arinvoice/FormARInvoice";
import ListARInvoice from "./arinvoice/ListARInvoice";
import ListInvoiceCust from "./arinvoice/ListInvoiceCust";
import FormCustomer from "./customer/FormCustomer";
import ListCustomer from "./customer/ListCustomer";
import ListDraftCustomer from "./customer/ListDraftCustomer";
import FormDOPrint from "./do-print/FormDOPrint";
import ListDOPrint from "./do-print/ListDOPrint";
import FormDO from "./do/FormDO";
import ListDO from "./do/ListDO";
import ListDOCopySO from "./do/ListDOCopySO";
import Home from "./home/Home";
import FormInvStockReturn from "./it-print/FormInvStockReturn";
import FormInvStockTransfer from "./it-print/FormInvStockTransfer";
import ListInvStockReturn from "./it-print/ListInvStockReturn";
import ListInvStockTransfer from "./it-print/ListInvStockTransfer";
import FormInvTransfer from "./it/FormInvTransfer";
import FormInvTransferReturn from "./it/FormInvTransferReturn";
import ListInvTransfer from "./it/ListInvTransfer";
import React from "react";

export default {
  // "/": <MainMenu />,
  "/": <Home />,
  "/rute": <ListRute />,
  "/rute/form/:id?": <FormRute />,
  "/wo": <ListWO />,
  "/wo/form/:id?": <FormWO />,
  "/so": <ListSO />,
  "/so/draft": <ListDraftSO />,
  "/so/form": <FormSO />,
  "/so-canvas": <ListSOCanvas />,
  "/so-canvas/form": <FormSOCanvas />,
  "/do": <ListDO />,
  "/do/open/:CardCode/:CardName/": <ListDOPrint />,
  "/do/view/:CardCode/:CardName/:id": <FormDOPrint />,
  "/do/copySO/:CardCode/:CardName": <ListDOCopySO />,
  "/do/form/:CardCode/:CardName/:ItemSelect": <FormDO />,
  "/it": <ListInvTransfer />,
  "/it/it-tran": <ListInvStockTransfer />,
  "/it/it-ret": <ListInvStockReturn />,
  "/it/it-tran/form": <FormInvTransfer />,
  "/it/it-tran/view/:id": <FormInvStockTransfer />,
  "/it/it-ret/form": <FormInvTransferReturn />,
  "/it/it-ret/view/:id": <FormInvStockReturn />,
  "/pr": <ListPRVendor />,
  "/pr/open/:vendor": <ListPRPrint />,
  "/pr/view/:vendor/:id": <FormPRPrint />,
  "/pr/list/:id?": <ListPR />,
  "/pr/form/:id?": <FormPR />,
  "/payment-receipt": <ListPayment />,
  "/payment-receipt/form": <FormPayment />,
  "/it/form/:id?": <FormInvTransfer />,
  "/ar-invoice": <ListInvoiceCust />,
  "/ar-invoice/list/:CardCode/:CardName/": <ListARInvoice />,
  "/ar-invoice/open/:CardCode/:CardName/": <ListARInvoicePrint />,
  "/ar-invoice/form/:id?": <FormARInvoice />,
  "/ar-invoice/view/:CardCode/:CardName/:id?": <FormARInvoicePrint />,
  "/ar-invoice-to": <ListInvoiceTOCust />,
  "/ar-invoice-to/open/:CardCode/:CardName/": <ListARInvoiceTOPrint />,
  "/ar-invoice-to/list/:CardCode/:CardName/": <ListARInvoiceTO />,
  "/ar-invoice-to/form/:id?": <FormARInvoiceTO />,
  "/ar-invoice-to/view/:CardCode/:CardName/:id?": <FormARInvoiceTOPrint />,
  "/customer": <ListCustomer />,
  "/customer/draft": <ListDraftCustomer />,
  "/customer/form/:id?": <FormCustomer />,
  "/user": <ListUser />,
  "/user/form/:id?": <FormUser />,
  "/report-po": <ReportPO />,
  "/report-so": <ReportSO />,
  "/report-do": <ReportDO />,
  "/report-ar-invoice": <ReportAR />,
  "/report-stock": <ReportStock />,
  "/report-inventory": <ReportInventory />,
  "/report-inventory/open/:id": <ReportInventoryByWO />
};
