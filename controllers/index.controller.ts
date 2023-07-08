import { Request, Response } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { v5 } from "https://deno.land/std@0.193.0/uuid/mod.ts";
const { generate } = v5;
const NAMESPACE_URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";

interface User {
  id: string;
  name: string;
}

const users: User[] = [
  {
    id: "1",
    name: "John",
  },
  {
    id: "2",
    name: "Jane",
  },
];

export const createUser = async ({ request, response }: {
  request: Request;
  response: Response;
}) => {

  if (request.hasBody) {
    try {
      const body = request.body();
      const { name } = await body.value;

      if (!name) {
        response.status = 400;
        response.body = {
          message: "Invalid data: Name is required",
        };
        return;
      }

      const id = await generate(NAMESPACE_URL, name);
      const newUser = { id, name };
      users.push(newUser);

      response.status = 201;
      response.body = {
        message: "New user created",
        data: newUser,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        message: "Invalid data: Unable to read request body",
      };
      return;
    }
  }

};

export const getUsers = ({ response }: { response: Response }) => {
  response.body = {
    message: "Success",
    data: users,
  };
};

export const getUserId = ({ params, response }: { params: { id: string }; response: Response }) => {

  const user = users.find((user) => user.id === params.id);
  if (user) {
    response.status = 200;
    response.body = {
      message: "Success",
      data: user,
    };
  } else {
    response.status = 404;
    response.body = {
      message: "User not found",
    };
  }
};

export const deleteUser = ({ params, response }: { params: { id: string }; response: Response }) => {
  const index = users.findIndex((user) => user.id === params.id);
  if (index !== -1) {
    users.splice(index, 1);
    response.status = 200;
    response.body = {
      message: "User deleted",
      data: users,
    };
  } else {
    response.status = 404;
    response.body = {
      message: "User not found",
    };
  }
};

export const updateUser = async ({ params, request, response }: { params: { id: string }; request: Request; response: Response }) => {
  const index = users.findIndex((user) => user.id === params.id);

  try {
    const body = request.body();
    const { name } = await body.value;
    if (!name && index !== -1 && request.hasBody) {
      response.status = 400;
      response.body = {
        message: "Invalid data: Name is required"
      };
      return;
    }
    users[index].name = name;
    response.status = 200;
    response.body = {
      message: "User updated",
      data: users[index],
    };

  } catch (error) {
    response.status = 404;
    response.body = {
      message: "User not found",
    };
  }

};
