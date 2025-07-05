// Recurring timer widget is client-side only, no proxy needed
export default function recurringTimerProxyHandler() {
  return {
    status: 200,
    data: { message: "Client-side widget" }
  };
}