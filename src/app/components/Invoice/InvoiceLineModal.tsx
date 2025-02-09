import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ProductAutocomplete } from "../Autocomplete";
import {
  InvoiceLineCreatePayload,
  InvoiceLineUpdatePayload,
  Product,
  Unit,
  VatRate,
} from "types";
import { useEffect, useState } from "react";
import {
  priceValidation,
  productValidation,
  quantityValidation,
  taxValidation,
  validateNegativeOrZero,
} from "app/utils/validations";
import { uniqueId } from "lodash";

const InvoiceLineModal = ({
  show,
  setShow,
  invoiceLine,
  handleInvoiceLine,
  productId,
  onModalHide,
}: {
  show: boolean;
  invoiceLine?: InvoiceLineUpdatePayload | null;
  setShow: (show: boolean) => void;
  handleInvoiceLine: (
    data: InvoiceLineCreatePayload | InvoiceLineUpdatePayload
  ) => void;
  productId?: number;
  onModalHide: () => void;
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const defaultValues: InvoiceLineCreatePayload | InvoiceLineUpdatePayload = {
    id: undefined,
    product_id: undefined,
    quantity: undefined,
    _destroy: false,
    label: "",
    unit: "piece" as Unit,
    vat_rate: "0" as VatRate,
    price: "",
    tax: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvoiceLineCreatePayload | InvoiceLineUpdatePayload>({
    defaultValues: defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (invoiceLine) {
      setProduct(invoiceLine as Product);
      reset(invoiceLine);
    }
    if (productId) {
      setValue("product_id", productId);
    }
  }, [invoiceLine, productId, reset, setValue]);

  const hideModal = () => {
    reset(defaultValues);
    setProduct(null);
    setShow(false);
    onModalHide();
  };

  const onSubmit = (
    data: InvoiceLineCreatePayload | InvoiceLineUpdatePayload
  ) => {
    handleInvoiceLine({ id: invoiceLine?.id ?? Number(uniqueId()), ...data });
    hideModal();
  };

  const handleProductChange = (product: Product | null) => {
    setProduct(product);
    setValue("product_id", product?.id);
    setValue("label", product?.label);
  };

  return (
    <Modal show={show} onHide={hideModal}>
      <ModalHeader>
        <ModalTitle>
          {invoiceLine ? "Update" : "Add"} invoice product
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column gap-2"
        >
          <Form.Group controlId="customer">
            <Form.Label className="fw-bold">Product type</Form.Label>
            <ProductAutocomplete
              value={product}
              {...register("product_id", { required: productValidation })}
              onChange={handleProductChange}
            />
            <Form.Text className="text-danger">
              {errors.product_id?.message}
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="quantity">
            <Form.Label className="fw-bold">Quantity</Form.Label>
            <Form.Control
              type="number"
              min={0}
              {...register("quantity", {
                required: quantityValidation,
                validate: (value: number | undefined) =>
                  validateNegativeOrZero(value),
              })}
              value={watch("quantity") ? watch("quantity") : ""}
            />
            <Form.Text className="text-danger">
              {errors.quantity?.message}
            </Form.Text>
          </Form.Group>
          <div className="row">
            <Form.Group className="col-md-6" controlId="unit">
              <Form.Label className="fw-bold">Unit</Form.Label>
              <Form.Check
                type="radio"
                id="default-radio"
                label="Hour"
                checked={watch("unit") === "hour"}
                onChange={() => setValue("unit", "hour")}
              />
              <Form.Check
                type="radio"
                id="default-radio"
                label="Day"
                checked={watch("unit") === "day"}
                onChange={() => setValue("unit", "day")}
              />
              <Form.Check
                type="radio"
                id="default-radio"
                label="Piece"
                checked={watch("unit") === "piece"}
                onChange={() => setValue("unit", "piece")}
              />
            </Form.Group>

            <Form.Group className="col-md-6" controlId="vatRate">
              <Form.Label className="fw-bold">Vat Rate</Form.Label>
              <Form.Check
                type="radio"
                id="default-radio"
                label="0"
                checked={watch("vat_rate") === "0"}
                onChange={() => setValue("vat_rate", "0")}
              />
              <Form.Check
                type="radio"
                id="default-radio"
                label="5.5"
                checked={watch("vat_rate") === "5.5"}
                onChange={() => setValue("vat_rate", "5.5")}
              />
              <Form.Check
                type="radio"
                id="default-radio"
                label="10"
                checked={watch("vat_rate") === "10"}
                onChange={() => setValue("vat_rate", "10")}
              />
              <Form.Check
                type="radio"
                id="default-radio"
                label="20"
                checked={watch("vat_rate") === "20"}
                onChange={() => setValue("vat_rate", "20")}
              />
            </Form.Group>
          </div>
          <Form.Group controlId="price">
            <Form.Label className="fw-bold">Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min={0}
              {...register("price", {
                required: priceValidation,
                validate: (value: string | number | undefined) =>
                  validateNegativeOrZero(value),
              })}
            />
            <Form.Text className="text-danger">
              {errors.price?.message}
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="tax">
            <Form.Label className="fw-bold">Tax</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              {...register("tax", {
                required: taxValidation,
                validate: (value: string | number | undefined) =>
                  validateNegativeOrZero(value),
              })}
            />
            <Form.Text className="text-danger">{errors.tax?.message}</Form.Text>
          </Form.Group>
          <ModalFooter>
            <Button variant="primary" type="submit">
              {invoiceLine ? "Update" : "Add"} product
            </Button>
            <Button variant="secondary" onClick={hideModal}>
              Close
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default InvoiceLineModal;
