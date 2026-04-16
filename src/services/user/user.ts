import { deleteItem, getAll, getByIdUser } from "../apiCrud";
import { User } from "./user.struct";

const URL = "/api/users";

export const fetchUsers = () => getAll<User[]>(`${URL}/all`);

export const fetchById = (id: string) => getByIdUser<User>(URL, id);

export const deleteUser = (id: number) => deleteItem(URL, id);