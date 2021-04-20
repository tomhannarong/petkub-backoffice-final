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
    users{
      id
      email
      personalInformation{
        fname
        lname
        birthday
        gender
      }
      contact{
        name
        phone
        facebook
        line
        instagram
      }
      profileImg
      roles
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
