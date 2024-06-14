// Declaring this interface provides type safety for message keys
type Messages = typeof import('@/locale/messages/pt-BR.json');
type ZodErrors = typeof import('@/locale/messages/zod/pt-BR.json');

declare interface IntlMessages extends Messages, ZodErrors {}
