import { useFieldArray, useForm } from "react-hook-form";
import { Form, Button, Container } from "react-bootstrap";
import Table from "../UI/Table/Table";
import { InvoiceLineModal } from ".";
import { useEffect, useState } from "react";
import { useApi } from "api";
import { CustomerAutocomplete } from "../Autocomplete";
import { Customer } from "types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  InvoiceUpdatePayload,
  InvoiceCreatePayload,
  InvoiceLineCreatePayload,
  InvoiceLineUpdatePayload,
} from "api/gen/client";

export enum InvoicesLinesHeaders {
  Quantity = "Quantity",
  Label = "Label",
  Unit = "Unit",
  VatRate = "Vat Rate",
  Price = "Price",
  Tax = "Tax",
  Actions = "",
}

const InvoiceForm = () => {
  const api = useApi();
  const { id } = useParams<{ id: string }>();
  const { state: customerFullName } = useLocation();
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
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
    trigger,
    clearErrors,
  } = useForm<InvoiceCreatePayload | InvoiceUpdatePayload>({
    defaultValues,
  });

  const { fields, append } = useFieldArray({
    control,
    name: "invoice_lines_attributes",
  });

  useEffect(() => {
    if (id) {
      const getInvoiceToUpdate = async () => {
        try {
          const { data } = await api.getInvoice(id);
          if (data) {
            setCustomer(customerFullName);
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
  }, [id]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "date" || name === "deadline") {
        trigger("deadline");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  const validateDeadline = (deadline: string | null | undefined) => {
    const date = getValues("date");
    if (!date || !deadline) return "Both date and deadline are required";
    const deadlineDate = new Date(deadline);
    const invoiceDate = new Date(date);
    return (
      deadlineDate > invoiceDate || "Deadline must be after the invoice date"
    );
  };

  const createInvoice = async () => {
    const invoiceData = getValues();
    try {
      const { data } = await api.postInvoices(null, {
        invoice: invoiceData as InvoiceCreatePayload,
      });
      navigate(`/invoice/${data.id}`);
    } catch (error) {
      //probably display error toast/banner
      console.log(error);
    }
  };

  const updateInvoice = async () => {
    const invoiceData = getValues();
    try {
      const { data } = await api.putInvoice(id, {
        invoice: invoiceData as InvoiceUpdatePayload,
      });
      navigate(`/invoice/${data.id}`);
    } catch (error) {
      //probably display error toast/banner
      console.log(error);
    }
  };

  const prepareTableData = (
    invoiceLines: InvoiceLineCreatePayload[] | InvoiceLineUpdatePayload[]
  ) => {
    if (invoiceLines.length > 0) {
      return {
        headers: Object.values(InvoicesLinesHeaders) as string[],
        rows: invoiceLines.map(
          (line: InvoiceLineCreatePayload | InvoiceLineUpdatePayload) => ({
            quantity: line.quantity,
            label: line.label,
            unit: line.unit,
            vat_rate: line.vat_rate,
            price: line.price,
            tax: line.tax,
            actions: (
              <Button
                className="btn-sm"
                variant="outline-secondary"
                type="button"
              >
                ...
              </Button>
            ),
          })
        ),
      };
    }

    return {
      headers: Object.values(InvoicesLinesHeaders),
      rows: [],
    };
  };

  const handleAddProduct = (
    invoiceLine: InvoiceLineCreatePayload | InvoiceLineUpdatePayload
  ) => {
    append(invoiceLine);
  };

  const handleCustomerChange = (value: Customer | null) => {
    setCustomer(value);
    setValue("customer_id", value?.id);
    clearErrors("customer_id");
  };

  const onSubmit = () => {
    if (id) {
      updateInvoice();
      return;
    }
    createInvoice();
  };

  return (
    <Container className="my-4 p-4 bg-white shadow">
      <h2 className="mb-4">{id ? "Update" : "Create"} Invoice</h2>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="row gap-3 justify-content-between"
      >
        <div className="row gap-3 col-md-6">
          <Form.Group controlId="customer">
            <Form.Label className="fw-bold">Customer</Form.Label>
            {customerFullName ? (
              <p>{customerFullName}</p>
            ) : (
              <CustomerAutocomplete
                value={customer}
                {...register("customer_id", {
                  required: {
                    value: true,
                    message: "Please select a customer",
                  },
                })}
                onChange={handleCustomerChange}
              />
            )}
            <Form.Text className="text-error">
              {errors.customer_id?.message}
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label className="fw-bold">Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter date"
              {...register("date", {
                required: {
                  value: true,
                  message: "Date is required",
                },
              })}
            />
            <Form.Text className="text-error">{errors.date?.message}</Form.Text>
          </Form.Group>

          <Form.Group controlId="deadline">
            <Form.Label className="fw-bold">Deadline</Form.Label>
            <Form.Control
              type="date"
              placeholder="Enter deadline"
              {...register("deadline", {
                required: {
                  value: true,
                  message: "Deadline is required",
                },
                validate: validateDeadline,
              })}
            />
            <Form.Text className="text-error">
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
            />
            <Form.Check
              type="radio"
              id="default-radio"
              label="No"
              checked={watch("finalized") === false}
              onChange={() => setValue("finalized", false)}
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
            />
            <Form.Check
              type="radio"
              id="default-radio"
              label="No"
              checked={watch("paid") === false}
              onChange={() => setValue("paid", false)}
            />
          </Form.Group>
        </div>
        <Form.Group controlId="invoice_lines_attributes">
          <Form.Label className="fw-bold">Products</Form.Label>
          <Table
            data={prepareTableData(fields as InvoiceLineCreatePayload[])}
            fallbackContent={<tr>No products added</tr>}
            {...register("invoice_lines_attributes", {
              required: {
                value: true,
                message: "Please add at least one product",
              },
            })}
          />
          <Form.Text className="text-error">
            {errors.invoice_lines_attributes?.root?.message}
          </Form.Text>
        </Form.Group>

        <div className="d-flex flex-row justify-content-end gap-3">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
          <Button
            variant="outline-primary"
            disabled={isSubmitting}
            onClick={() => setShowProductModal(!showProductModal)}
          >
            Add product
          </Button>
        </div>
      </Form>

      <InvoiceLineModal
        show={showProductModal}
        onHandleProduct={handleAddProduct}
        setShow={setShowProductModal}
      />
    </Container>
  );
};

export default InvoiceForm;
