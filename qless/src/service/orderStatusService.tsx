export enum OrderStatus {
    Received = 1,
    BeingCooked = 2,
    Ready = 3,
    PickedUp = 4
  }

  //converts an order status number to its coresponding string
export function getOrderStatus(id: OrderStatus): string {
  let status = "";
  switch (id) {
      case OrderStatus.Received:
          status = "Received";
          break;
      case OrderStatus.BeingCooked:
          status = "Being Cooked";
          break;
      case OrderStatus.Ready:
          status = "Ready";
          break;
      case OrderStatus.PickedUp:
          status = "Picked Up";
          break;
  }
  return status;
}