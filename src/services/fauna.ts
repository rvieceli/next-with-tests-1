import { Client, query } from "faunadb";

const fauna = new Client({
  secret: process.env.FAUNA_SECRET,
  domain: process.env.FAUNA_DOMAIN,
});

type UserData = {
  email: string;
  stripe_customer_id?: string;
};

type SubscriptionData = {
  id: string;
  userId: string;
  status: string;
  price_id: string;
};

type QueryResult<Data = undefined> = {
  ref: {
    id: string;
  };
  data: Data;
};

const getUserByEmail = (email: string) => {
  return fauna.query<QueryResult<UserData>>(
    query.Get(query.Match(query.Index("user_by_email"), query.Casefold(email)))
  );
};

const getUserRefByCustomerId = (customerId: string) => {
  return fauna.query<string>(
    query.Select(
      "ref",
      query.Get(
        query.Match(query.Index("user_by_stripe_customer_id"), customerId)
      )
    )
  );
};

const updateUser = (id: string, data: Partial<UserData>) => {
  return fauna.query(
    query.Update(query.Ref(query.Collection("users"), id), {
      data,
    })
  );
};

const createSubscription = (data: SubscriptionData) => {
  return fauna.query<QueryResult<SubscriptionData>>(
    query.Create(query.Collection("subscriptions"), {
      data,
    })
  );
};

const updateSubscription = (id: string, data: SubscriptionData) => {
  return fauna.query<QueryResult<SubscriptionData>>(
    query.Replace(
      query.Select(
        "ref",
        query.Get(query.Match(query.Index("subscription_by_id"), id))
      ),
      { data }
    )
  );
};

export {
  fauna,
  getUserByEmail,
  getUserRefByCustomerId,
  updateUser,
  createSubscription,
  updateSubscription,
};
