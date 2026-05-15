import { UnauthorizedException } from '@nestjs/common';

/**
 * Valida o header x-user-id e devolve o userId como número.
 * Lança UnauthorizedException se inválido.
 * Centraliza a validação que antes estava duplicada em 20+ controllers.
 */
export function getUserIdFromHeader(header: string | undefined): number {
  const userId = Number(header);
  if (!Number.isFinite(userId) || userId <= 0) {
    throw new UnauthorizedException('x-user-id header inválido');
  }
  return userId;
}
