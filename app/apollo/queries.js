import { gql } from '@apollo/client';

export const ME = gql`
  query {
    me{
      id
      email
      personalInformation{
        fname
        lname
      }
      roles
      deletedAt
    }
  }
`;

export const QUERY_USERS = gql`
  query {
    users {
        id
    }
  }
`;
