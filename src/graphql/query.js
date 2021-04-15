import gql from "graphql-tag";

export const GET_ADMIN_QUERY = gql`
  query {
    me {
      id
      createdAt
      updatedAt
      name
      role
      verified
      fail_count
    }
  }
`;

export const GET_PROJECTS_QUERY = gql`
  query projects($input: ProjectsInput!) {
    projects(input: $input) {
      error
      ok
      totalPages
      totalResults
      results {
        id
        title
        goal
        subjects_index
      }
    }
  }
`;

export const GET_PROJECT_QUERY = gql`
  query project($input: ProjectInput!) {
    project(input: $input) {
      error
      ok
      result {
        id
        title
        goal
        subjects_index
        subjects {
          id
          title
          containers_index
        }
      }
    }
  }
`;

export const GET_SUBJECTS_QUERY = gql`
  query subjects($input: SubjectsInput!) {
    subjects(input: $input) {
      error
      ok
      results {
        id
        title
        goal
        containers_index
      }
      totalResults
      totalPages
    }
  }
`;
export const GET_SUBJECT_QUERY = gql`
  query subject($input: SubjectInput!) {
    subject(input: $input) {
      error
      ok
      result {
        id
        title
        goal
        containers_index
        containers {
          title
          content
        }
      }
    }
  }
`;
