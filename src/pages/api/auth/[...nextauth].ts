import { query } from 'faunadb';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { fauna } from 'app/services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user,user:email',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session }) => {
      try {
        const userActiveSubscription = await fauna.query(
          query.Get(
            query.Intersection([
              query.Match(
                query.Index('subscription_by_user_ref'),
                query.Select(
                  'ref',
                  query.Get(
                    query.Match(
                      query.Index('user_by_email'),
                      query.Casefold(session.user?.email!)
                    )
                  )
                )
              ),
              query.Match(query.Index('subscription_by_status'), 'active'),
            ])
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    signIn: async ({ user }) => {
      const { email } = user;

      try {
        const match = query.Match(
          query.Index('user_by_email'),
          query.Casefold(email!)
        );

        await fauna.query(
          query.If(
            query.Not(query.Exists(match)),
            query.Create(query.Collection('users'), { data: { email } }),
            query.Get(match)
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});
