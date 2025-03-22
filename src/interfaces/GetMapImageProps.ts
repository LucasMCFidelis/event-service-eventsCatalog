import { Decimal } from "@prisma/client/runtime/library";

export interface GetMapImageProps {
  latitude: number;
  longitude: number;
  eventPrice?: Decimal;
}