/**
 * Route path constants for the application
 */
export enum RoutePaths {
  // Base routes
  INVOICES = "/invoices",

  // Invoice specific routes
  INVOICE_REVIEW = "/invoice/:id",
  INVOICE_CREATE = "/create-invoice",
  INVOICE_EDIT = "/edit-invoice/:id",
}

/**
 * Route key constants for the application
 */
export enum RouteKeys {
  INVOICES = "invoices",
  INVOICE_REVIEW = "invoice-review",
  INVOICE_CREATE = "invoice-create",
  INVOICE_EDIT = "invoice-edit",
}

/**
 * Route labels for display purposes
 */
export const RouteLabels = {
  [RouteKeys.INVOICES]: "Invoices",
  [RouteKeys.INVOICE_REVIEW]: "Invoice Review",
  [RouteKeys.INVOICE_CREATE]: "Create Invoice",
  [RouteKeys.INVOICE_EDIT]: "Edit Invoice",
} as const;

/**
 * Helper function to generate dynamic route paths
 */
export const generatePath = {
  invoiceReview: (id: string) => RoutePaths.INVOICE_REVIEW.replace(":id", id),
  invoiceEdit: (id: string) => RoutePaths.INVOICE_EDIT.replace(":id", id),
};
