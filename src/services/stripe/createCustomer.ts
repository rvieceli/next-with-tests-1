import { stripe } from ".";

type Customer = {
  email: string;
  name: string;
};

const createCustomer = (data: Customer) => {
  return stripe.customers.create(data);
};

export { createCustomer };
