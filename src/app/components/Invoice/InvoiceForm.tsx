import { useForm } from "react-hook-form";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import Table from "../UI/Table/Table";
import { InvoiceLineActionButtons, InvoiceLineModal } from ".";
import { useEffect, useState } from "react";
import { useApi } from "api";
import { CustomerAutocomplete } from "../Autocomplete";
import {
  Customer,
  Invoice,
  InvoiceCreatePayload,
  InvoiceLineUpdatePayload,
  InvoiceUpdatePayload,
} from "types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  customerValidation,
  dateValidation,
  deadlineValidation,
  validateDeadline,
} from "app/utils/validations";
import { Link } from "react-router-dom";
import { mapInvoiceLineToTableData } from "app/utils/invoiceUtils";
import { createInvoice, updateInvoice } from "api/api";
import PopoverActionButtons from "../UI/Button/PopoverActionButtons";
import { isEqual } from "lodash";
import InvoiceLinesTotals from "./InvoiceLinesTotals";

const InvoiceForm = () => {
  const api = useApi();
  const { id: invoiceId } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const defaultValues: InvoiceCreatePayload | InvoiceUpdatePayload = {
    id: 0,
    customer_id: undefined,
    finalized: false,
    paid: false,
    date: "",
    deadline: "",
    invoice_lines_attributes: [],
  };

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [productModal, setShowProductModal] = useState<boolean>(false);
  const [invoiceLineToUpdate, setInvoiceLineToUpdate] =
    useState<InvoiceLineUpdatePayload | null>();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
    trigger,
    clearErrors,
  } = useForm<InvoiceCreatePayload | InvoiceUpdatePayload>({
    defaultValues,
    mode: "onChange",
  });

  const isFieldDisabled = !!invoice?.finalized && !!invoice?.paid;

  useEffect(() => {
    if (invoiceId) {
      const getInvoiceToUpdate = async () => {
        try {
          const { data } = await api.getInvoice(invoiceId);
          if (data) {
            setInvoice(data);
            setCustomer(state?.customer);
            reset({
              invoice_lines_attributes: data.invoice_lines,
              ...(data as InvoiceCreatePayload | InvoiceUpdatePayload),
            });
          }
        } catch (error) {
          //probably display error toast/banner
          console.log(error);
        }
      };

      getInvoiceToUpdate();
    }
  }, [api, invoiceId, reset, state?.customer]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "date" || name === "deadline") {
        trigger("deadline");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  const onEditInvoiceLine = (invoiceLine: InvoiceLineUpdatePayload) => {
    setInvoiceLineToUpdate(invoiceLine);
    setShowProductModal(true);
  };

  const handleInvoiceLine = (invoiceLine: InvoiceLineUpdatePayload) => {
    const currentLines = getValues()
      .invoice_lines_attributes as InvoiceLineUpdatePayload[];

    const existingIndex = currentLines.findIndex((line) =>
      isEqual(line, invoiceLine)
    );

    if (existingIndex !== -1) {
      currentLines[existingIndex] = invoiceLine;
    } else {
      setValue("invoice_lines_attributes", [
        ...(getValues().invoice_lines_attributes as InvoiceLineUpdatePayload[]),
        invoiceLine,
      ]);
    }
  };

  const isMatchingLine = (
    line: InvoiceLineUpdatePayload,
    lineToDelete: InvoiceLineUpdatePayload
  ): boolean => {
    if (line.id && lineToDelete.id) {
      return line.id === lineToDelete.id;
    }
    return isEqual(line, lineToDelete);
  };

  const deleteInvoiceFromState = (
    currentLines: InvoiceLineUpdatePayload[],
    invoiceLine: InvoiceLineUpdatePayload
  ) => {
    if (currentLines && invoiceLine) {
      const activeLines = currentLines.filter(
        (line) => !isMatchingLine(line, invoiceLine)
      );
      setValue("invoice_lines_attributes", activeLines);
    }
    return;
  };

  const deleteInvoiceLine = (invoiceLine: InvoiceLineUpdatePayload) => {
    const currentLines =
      (getValues().invoice_lines_attributes as InvoiceLineUpdatePayload[]) ??
      [];

    // For existing invoice, mark the line as destroyed
    const updatedLines = currentLines.map((line) =>
      isMatchingLine(line, invoiceLine) ? { ...line, _destroy: true } : line
    );

    const invoiceToUpdate = {
      ...(getValues() as InvoiceUpdatePayload),
      invoice_lines_attributes: updatedLines,
    };

    if (invoice?.id) {
      updateInvoice(api, invoice.id.toString(), invoiceToUpdate).then(() => {
        deleteInvoiceFromState(currentLines, invoiceLine);
      });
      return;
    }
    deleteInvoiceFromState(currentLines, invoiceLine);
  };

  const handleCustomerChange = (value: Customer | null) => {
    setCustomer(value);
    setValue("customer_id", value?.id);
    clearErrors("customer_id");
  };

  const preparedTableData = mapInvoiceLineToTableData(
    watch().invoice_lines_attributes as InvoiceLineUpdatePayload[],
    (invoiceLine: InvoiceLineUpdatePayload) => (
      <PopoverActionButtons
        disabled={!!invoice?.finalized}
        children={
          <InvoiceLineActionButtons
            onEdit={() => onEditInvoiceLine(invoiceLine)}
            onDelete={() => deleteInvoiceLine(invoiceLine)}
            disabled={!!invoice?.finalized}
          />
        }
      />
    )
  );

  const onSubmit = () => {
    if (invoice?.id) {
      updateInvoice(
        api,
        invoice?.id?.toString(),
        getValues() as InvoiceUpdatePayload
      ).then((data) => {
        if (data?.id) navigate(`/invoice/${data?.id}`);
      });
      return;
    }
    createInvoice(api, getValues() as InvoiceCreatePayload).then((data) => {
      navigate(`/invoice/${data?.id}`);
    });
  };

  return (
    <Container className="my-4 p-4 bg-white shadow">
      <h2 className="mb-4">{invoiceId ? "Update" : "Create"} Invoice</h2>
      <Form
        name="form"
        onSubmit={handleSubmit(onSubmit)}
        className="row gap-3 justify-content-between"
      >
        <div className="row gap-3 col-md-6">
          <Form.Group controlId="customer">
            <Form.Label className="fw-bold">Customer</Form.Label>
            {state ? (
              <p>{state?.customer}</p>
            ) : (
              <CustomerAutocomplete
                value={customer}
                {...register("customer_id", {
                  required: customerValidation,
                })}
                onChange={handleCustomerChange}
              />
            )}
            <Form.Text className="text-danger">
              {errors.customer_id?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="date">
            <Form.Label className="fw-bold">Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter date"
              {...register("date", {
                required: dateValidation,
              })}
              disabled={!!invoice?.finalized}
            />
            <Form.Text className="text-danger">
              {errors.date?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="deadline">
            <Form.Label className="fw-bold">Deadline</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter deadline"
              {...register("deadline", {
                required: deadlineValidation,
                validate: (deadline) =>
                  validateDeadline(getValues("date"), deadline),
              })}
              disabled={!!invoice?.finalized}
            />
            <Form.Text className="text-danger">
              {errors.deadline?.message}
            </Form.Text>
          </Form.Group>
        </div>

        <div className="row gap-3 col-md-5">
          <Form.Group className="col-md-6" controlId="finalized">
            <Form.Label className="fw-bold">Finalized</Form.Label>
            <Form.Check
              type="radio"
              id="default-radio"
              label="Yes"
              checked={watch("finalized") === true}
              onChange={() => setValue("finalized", true)}
              disabled={!!invoice?.finalized}
            />
            <Form.Check
              type="radio"
              id="default-radio"
              label="No"
              checked={watch("finalized") === false}
              onChange={() => setValue("finalized", false)}
              disabled={!!invoice?.finalized}
            />
          </Form.Group>

          <Form.Group className="col-md-6" controlId="paid">
            <Form.Label className="fw-bold">Paid</Form.Label>
            <Form.Check
              type="radio"
              id="default-radio"
              label="Yes"
              checked={watch("paid") === true}
              onChange={() => setValue("paid", true)}
              disabled={isFieldDisabled}
            />
            <Form.Check
              type="radio"
              id="default-radio"
              label="No"
              checked={watch("paid") === false}
              onChange={() => setValue("paid", false)}
              disabled={isFieldDisabled}
            />
          </Form.Group>
        </div>

        <Form.Group controlId="invoice_lines_attributes">
          <Form.Label className="fw-bold">Products</Form.Label>
          <Table
            data={preparedTableData}
            fallbackContent={
              <tr>
                <td>No products added</td>
              </tr>
            }
            {...register("invoice_lines_attributes")}
          />
          <InvoiceLinesTotals
            invoiceLines={
              getValues().invoice_lines_attributes as InvoiceLineUpdatePayload[]
            }
          />
          <Form.Text className="text-danger">
            {errors.invoice_lines_attributes?.root?.message}
          </Form.Text>
        </Form.Group>

        <div className="row justify-content-between">
          <Link className="text-reset text-decoration-none col-md-2" to="/">
            <Button className="w-100" variant="outline-primary" type="button">
              {isSubmitting ? (
                <Spinner animation="border" />
              ) : (
                "Back to Invoice List"
              )}
            </Button>
          </Link>
          <div className="row gap-2 col-md-8 justify-content-end p-0">
            {!isFieldDisabled && (
              <Button
                className="col-md-3"
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner animation="border" /> : "Submit"}
              </Button>
            )}
            {!invoice?.finalized && (
              <Button
                name="form"
                className="col-md-3"
                variant="outline-primary"
                disabled={isSubmitting}
                onClick={() => setShowProductModal(!productModal)}
              >
                {isSubmitting ? <Spinner animation="border" /> : "Add product"}
              </Button>
            )}
          </div>
        </div>
      </Form>

      <InvoiceLineModal
        show={productModal}
        handleInvoiceLine={handleInvoiceLine}
        setShow={setShowProductModal}
        invoiceLine={invoiceLineToUpdate}
        onModalHide={() => setInvoiceLineToUpdate(null)}
      />
    </Container>
  );
};

export default InvoiceForm;
