import gql from "graphql-tag";

// user Mutation
export const LOGIN_MUTATION = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      error
      ok
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation createAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      error
      ok
    }
  }
`;

// project Mutation
export const CREATE_PROJECT_MUTATION = gql`
  mutation createProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      error
      ok
      project {
        id
        title
        goal
      }
    }
  }
`;

export const EDIT_PROJECT_MUTATION = gql`
  mutation editProject($input: EditProjectInput!) {
    editProject(input: $input) {
      error
      ok
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation deleteProject($input: DeleteProjectInput!) {
    deleteProject(input: $input) {
      error
      ok
    }
  }
`;

// subject Mutation
export const CREATE_SUBJECT_MUTATION = gql`
  mutation createSubject($input: CreateSubjectInput!) {
    createSubject(input: $input) {
      error
      ok
      subject {
        id
        title
        goal
      }
    }
  }
`;

export const EDIT_SUBJECT_MUTATION = gql`
  mutation editSubject($input: EditSubjectInput!) {
    editSubject(input: $input) {
      error
      ok
    }
  }
`;

export const DELETE_SUBJECT_MUTATION = gql`
  mutation deleteSubject($input: DeleteSubjectInput!) {
    deleteSubject(input: $input) {
      error
      ok
    }
  }
`;

// container Mutation문
export const CREATE_CONTAINER_MUTATION = gql`
  mutation createContainer($input: CreateContainerInput!) {
    createContainer(input: $input) {
      error
      ok
    }
  }
`;

export const EDIT_CONTAINER_MUTATION = gql`
  mutation editContainer($input: EditContainerInput!) {
    editContainer(input: $input) {
      error
      ok
    }
  }
`;

export const DELETE_CONTAINER_MUTATION = gql`
  mutation deleteContainer($input: DeleteContainerInput!) {
    deleteContainer(input: $input) {
      error
      ok
    }
  }
`;

export const CONTAINERS_INDEX_MUTATION = gql`
  mutation changeContainersIndex($input: ChangeContainersIndexInput!) {
    changeContainersIndex(input: $input) {
      error
      ok
    }
  }
`;
