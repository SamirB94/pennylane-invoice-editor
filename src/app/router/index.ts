import {
  InvoicesListPage,
  InvoiceReviewPage,
  InvoiceCreatePage,
  InvoiceEditPage,
} from "../../app/pages";
import { RouteKeys, RoutePaths, RouteLabels } from "./constants";

interface Route {
  key: string;
  path: string;
  label: string;
  component: React.FC;
  children?: Route[];
}

interface FlatRoute extends Route {
  parent: string | undefined;
}

const routes: Route[] = [
  {
    key: RouteKeys.INVOICES,
    path: RoutePaths.INVOICES,
    label: RouteLabels[RouteKeys.INVOICES],
    component: InvoicesListPage,
    children: [
      {
        key: RouteKeys.INVOICE_REVIEW,
        path: RoutePaths.INVOICE_REVIEW,
        label: RouteLabels[RouteKeys.INVOICE_REVIEW],
        component: InvoiceReviewPage,
      },
      {
        key: RouteKeys.INVOICE_CREATE,
        path: RoutePaths.INVOICE_CREATE,
        label: RouteLabels[RouteKeys.INVOICE_CREATE],
        component: InvoiceCreatePage,
      },
      {
        key: RouteKeys.INVOICE_EDIT,
        path: RoutePaths.INVOICE_EDIT,
        label: RouteLabels[RouteKeys.INVOICE_EDIT],
        component: InvoiceEditPage,
      },
    ],
  },
];

const flattenRoutes = (
  routes: Route[],
  parent: string | undefined = undefined
): Route[] => {
  return routes.reduce<Route[]>((acc, { key, children, ...route }) => {
    const flatRoute: FlatRoute = {
      key,
      children,
      ...route,
      parent,
    };

    if (children) {
      const flatChildren = flattenRoutes(children, key);
      acc.push(flatRoute, ...flatChildren);
    } else {
      acc.push(flatRoute);
    }

    return acc;
  }, []);
};

export type { Route };
export { flattenRoutes };
export default routes;
