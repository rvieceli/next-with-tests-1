import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, updateUser } from 'app/services/fauna';
import { getSession } from 'app/services/nextAuth';
import { createCheckoutSession } from 'app/services/stripe/createCheckoutSession';
import { createCustomer } from 'app/services/stripe/createCustomer';

const subscriptions = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
    return;
  }

  const session = await getSession({ req: request });

  const user = await getUserByEmail(session?.user?.email!);

  let customerId = user.data.stripe_customer_id;

  if (!customerId) {
    const customer = await createCustomer({
      email: session?.user?.email!,
      name: session?.user?.name!,
    });

    await updateUser(user.ref.id, {
      stripe_customer_id: customer.id,
    });

    customerId = customer.id;
  }

  const checkoutSession = await createCheckoutSession(customerId);

  return response.status(201).json({
    sessionId: checkoutSession.id,
  });
};

export default subscriptions;
