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
import { Product } from "types";
import { useState } from "react";
import {
  InvoiceLineUpdatePayload,
  InvoiceLineCreatePayload,
  Unit,
  VatRate,
} from "api/gen/client";

const InvoiceLineModal = ({
  show,
  setShow,
  invoiceLine,
  onHandleProduct,
  productId,
}: {
  show: boolean;
  invoiceLine?: InvoiceLineUpdatePayload;
  setShow: (show: boolean) => void;
  onHandleProduct: (
    data: InvoiceLineCreatePayload | InvoiceLineUpdatePayload
  ) => void;
  productId?: number;
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const defaultValues: InvoiceLineCreatePayload | InvoiceLineUpdatePayload = {
    product_id: productId ?? undefined,
    quantity: undefined,
    label: "",
    unit: "" as Unit,
    vat_rate: "" as VatRate,
    price: "",
    tax: "",
  };

  const { register, handleSubmit, reset, setValue } = useForm<
    InvoiceLineCreatePayload | InvoiceLineUpdatePayload
  >({
    defaultValues: invoiceLine ?? defaultValues,
  });

  const hideModal = () => {
    reset();
    setProduct(null);
    setShow(false);
  };

  const onSubmit = (
    data: InvoiceLineCreatePayload | InvoiceLineUpdatePayload
  ) => {
    onHandleProduct(data);
    hideModal();
  };

  const handleProductChange = (product: Product | null) => {
    setProduct(product);
    setValue("product_id", product?.id);
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
              onChange={handleProductChange}
            />
          </Form.Group>
          <Form.Group controlId="formQuantity">
            <Form.Label className="fw-bold">Quantity</Form.Label>
            <Form.Control type="number" {...register("quantity")} />
          </Form.Group>
          <Form.Group controlId="formLabel">
            <Form.Label className="fw-bold">Label</Form.Label>
            <Form.Control type="text" {...register("label")} />
          </Form.Group>
          <Form.Group controlId="formUnit">
            <Form.Label className="fw-bold">Unit</Form.Label>
            <Form.Control type="text" {...register("unit")} />
          </Form.Group>
          <Form.Group controlId="formVatRate">
            <Form.Label className="fw-bold">VAT Rate</Form.Label>
            <Form.Control type="text" {...register("vat_rate")} />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label className="fw-bold">Price</Form.Label>
            <Form.Control type="text" {...register("price")} />
          </Form.Group>
          <Form.Group controlId="formTax">
            <Form.Label className="fw-bold">Tax</Form.Label>
            <Form.Control type="text" {...register("tax")} />
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
