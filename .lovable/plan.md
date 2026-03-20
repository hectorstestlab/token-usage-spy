

# Pagos Simulados — Plan de Implementación

## Resumen

Agregar un flujo completo de pagos simulado (sin procesamiento real) que permita a planners/clientes pagar servicios del marketplace, y que cada tipo de usuario pueda gestionar su información de pagos desde su perfil.

## Nuevos Archivos

### 1. `src/types/payments.ts`
Tipos: `PaymentMethod` (tarjeta simulada con últimos 4 dígitos, tipo, nombre), `Transaction` (id, monto, servicio, estado, fecha, método), `PaymentSummary`.

### 2. `src/data/paymentsData.ts`
Datos mock: métodos de pago guardados, historial de transacciones por rol.

### 3. `src/components/marketplace/PaymentDialog.tsx`
Diálogo multi-paso que aparece después del HireDialog:
- **Paso 1**: Resumen del servicio (nombre, precio, proveedor)
- **Paso 2**: Seleccionar método de pago (tarjetas guardadas o "agregar nueva")
- **Paso 3**: Confirmación con toast de éxito

### 4. `src/components/shared/PaymentMethodForm.tsx`
Formulario para agregar/editar método de pago simulado (número de tarjeta mock, nombre, fecha de expiración). Se reutiliza en Settings y en el PaymentDialog.

### 5. `src/components/shared/PaymentSettings.tsx`
Sección completa de gestión de pagos para Settings:
- **Planners/Clientes**: Métodos de pago guardados (agregar, eliminar), historial de transacciones
- **Proveedores**: Información de cobro (cuenta bancaria simulada), historial de ingresos, resumen de ganancias

## Archivos Modificados

### 6. `src/components/marketplace/HireDialog.tsx`
Después de validar los campos, en vez de toast de éxito directo, abre el `PaymentDialog` para completar el pago.

### 7. `src/components/shared/SettingsPage.tsx`
Reemplazar el placeholder actual con secciones reales:
- Perfil básico (nombre, email mock)
- **Sección de Pagos** usando `PaymentSettings`

### 8. `src/layouts/DashboardLayout.tsx`
Agregar ícono de `CreditCard` en el nav para acceso rápido a pagos (dentro de Settings, o como ruta separada `/*/payments`).

### 9. `src/App.tsx`
Agregar ruta `payments` para cada rol que renderice `PaymentSettings`.

## Flujo de Usuario

```text
Marketplace → Contratar → HireDialog (datos boda) → PaymentDialog (seleccionar tarjeta → confirmar) → Toast éxito
Settings → Pagos → Ver/agregar métodos de pago + historial de transacciones
Vendor Settings → Pagos → Ver cuenta de cobro + historial de ingresos
```

