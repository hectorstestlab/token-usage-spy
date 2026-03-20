

# Métodos de Pago Compartidos — Cliente → Planner

## Resumen

Permitir que clientes autoricen métodos de pago para uso del planner, con un flujo de aprobación/denegación de pagos y visibilidad compartida en historiales.

## Nuevos Archivos

### 1. `src/types/paymentApprovals.ts`
- `SharedPaymentMethod`: extiende `PaymentMethod` con `ownerId`, `ownerName`, `approvedForPlanner`, `sharedAt`
- `PaymentApprovalRequest`: `id`, `transactionId`, `clientId`, `plannerId`, `listing`, `amount`, `paymentMethodLast4`, `status` (pendiente/aprobado/denegado), `requestedAt`, `resolvedAt`

### 2. `src/data/paymentApprovalsData.ts`
Mock data: métodos compartidos y solicitudes de aprobación pendientes/resueltas.

### 3. `src/components/client/ClientPaymentApprovals.tsx`
Panel donde el cliente:
- Ve lista de solicitudes de pago pendientes (servicio, monto, planner, tarjeta) con botones Aprobar/Denegar
- Ve historial de solicitudes resueltas
- Gestiona qué tarjetas están autorizadas para el planner (toggle on/off)

### 4. `src/components/planner/PlannerPayWithClient.tsx`
En el flujo de pago del planner, opción adicional "Usar tarjeta del cliente" que muestra las tarjetas autorizadas por los clientes asignados. Al seleccionar una, el pago queda en estado "Pendiente de aprobación".

## Archivos Modificados

### 5. `src/components/shared/PaymentSettings.tsx`
- **Vista Cliente**: Agregar sección "Tarjetas compartidas con tu planner" con toggles para autorizar/revocar tarjetas
- **Vista Planner**: Agregar sección "Tarjetas de clientes autorizadas" (solo lectura)

### 6. `src/components/marketplace/PaymentDialog.tsx`
- Cuando `role === "planner"`: en el paso de selección de método, agregar sección "Tarjetas de clientes" con las tarjetas autorizadas. Al elegir una, el flujo cambia: en vez de "Pago procesado", muestra "Solicitud enviada al cliente — pendiente de aprobación"

### 7. `src/components/shared/PaymentSettings.tsx` (historial)
- Transacciones hechas por el planner con tarjeta del cliente aparecen en ambos historiales con badge "Pagado por planner" o "Pendiente aprobación"

### 8. `src/components/client/ClientDashboard.tsx`
- Agregar alerta/banner cuando hay solicitudes de pago pendientes con link a la sección de aprobaciones

### 9. `src/layouts/DashboardLayout.tsx`
- Agregar item de navegación "Aprobaciones" para el rol cliente (con badge de pendientes)

### 10. `src/App.tsx`
- Agregar ruta `/client/approvals` → `ClientPaymentApprovals`

## Flujo

```text
Cliente: Settings → Pagos → Autoriza tarjeta para planner
Planner: Marketplace → Contratar → PaymentDialog → "Usar tarjeta del cliente" → Solicitud enviada
Cliente: Dashboard muestra alerta → Aprobaciones → Aprobar/Denegar
Ambos: Historial muestra la transacción con indicador de quién pagó
```

