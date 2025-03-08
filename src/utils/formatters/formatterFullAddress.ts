import { Address } from "../../interfaces/addressInterface.js";

export function formatterFullAddress({
  street,
  number,
  neighborhood,
  complement,
}: Address): string {
  return `${street}, ${number}, ${neighborhood}${
    complement ? `, ${complement}` : ""
  }, João Pessoa`;
}
